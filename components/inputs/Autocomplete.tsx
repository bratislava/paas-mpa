/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Portal } from '@gorhom/portal'
import { forwardRef, ReactElement, ReactNode, Ref, useCallback, useMemo, useState } from 'react'
import {
  FlatList,
  FlatListProps,
  ListRenderItem,
  NativeSyntheticEvent,
  TextInput as RNTextInput,
  TextInputChangeEventData,
  TextInputSelectionChangeEventData,
  View,
} from 'react-native'
import { useDebouncedCallback } from 'use-debounce'

import TextInput, { TextInputProps } from '@/components/inputs/TextInput'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'

type TextSelection =
  | {
      start: number
      end?: number
    }
  | undefined

type ExtractUnionType<T> = T extends [infer X, ...infer Rest]
  ? X extends any[]
    ? X[number] | ExtractUnionType<Rest>
    : never
  : never

type BaseAutocompleteProps<L extends any[], O = L[number]> = {
  onValueChange: (value: O) => void
  defaultValue?: string
  getOptions: (search: string) => Promise<L>
  areOptionsEqual?: (optionA: O, optionB: O) => boolean
  getOptionLabel: (option: O) => string
  debounce?: number
  renderItem?: ListRenderItem<O> | null
  onFocus?: () => void
  onBlur?: () => void
  leftIcon?: ReactNode
  autoFocus?: boolean
  resultsHeader?: ReactNode
  optionsPortalName?: string
  ListComponent?: React.ComponentType<FlatListProps<O>>
  listProps?: Partial<FlatListProps<O>>
  multiSourceMode?: boolean
  renderResults?: (options: L, optionsListProps: Omit<FlatListProps<O>, 'data'>) => ReactNode
} & TextInputProps

type MultiAutocompleteProps<L extends any[][], O = ExtractUnionType<L>> = {
  onValueChange: (value: O) => void
  defaultValue?: string
  getOptions: (search: string) => Promise<L>
  areOptionsEqual?: (optionA: O, optionB: O) => boolean
  getOptionLabel: (option: O) => string
  debounce?: number
  renderItem?: ListRenderItem<O> | null
  onFocus?: () => void
  onBlur?: () => void
  leftIcon?: ReactNode
  autoFocus?: boolean
  resultsHeader?: ReactNode
  optionsPortalName?: never
  ListComponent?: React.ComponentType<FlatListProps<O>>
  listProps?: Partial<FlatListProps<O>>
  multiSourceMode: true
  renderResults: (options: L, optionsListProps: Omit<FlatListProps<O>, 'data'>) => ReactNode
} & TextInputProps

export type AutocompleteProps<L extends any[], O> =
  | MultiAutocompleteProps<L, O>
  | BaseAutocompleteProps<L, O>

const AutocompleteInner = <L extends any[], O>(
  {
    onValueChange,
    defaultValue = '',
    getOptions,
    areOptionsEqual,
    getOptionLabel,
    debounce = 300,
    renderItem,
    onFocus,
    onBlur,
    leftIcon,
    autoFocus,
    resultsHeader,
    optionsPortalName,
    ListComponent = FlatList,
    listProps = {},
    multiSourceMode,
    renderResults,
    ...restProps
  }: AutocompleteProps<L, O>,
  ref: React.ForwardedRef<RNTextInput>,
) => {
  const [input, setInput] = useState(defaultValue)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const [options, setOptions] = useState<L>([] as any)
  const [lastSearchText, setLastSearchText] = useState<string | null>(null)
  const [textSelection, setTextSelection] = useState<TextSelection>()

  const debouncedHandleChange = useDebouncedCallback(async (newInput: string) => {
    const newOptions = await getOptions(newInput)
    setOptions(newOptions)
  }, debounce)

  const handleChange = useCallback(
    async (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
      const newInput = event.nativeEvent.text
      setInput(newInput)
      debouncedHandleChange(newInput)?.catch((error) => false)
    },
    [debouncedHandleChange],
  )

  const handleOptionPress = useCallback(
    (option: O) => () => {
      setLastSearchText(input)
      setInput(getOptionLabel(option))
      onValueChange(option)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setOptions([] as any)
    },
    [getOptionLabel, onValueChange, input],
  )

  const handleFocus = useCallback(async () => {
    onFocus?.()
    setTextSelection({ start: input.length, end: input.length })
    if (lastSearchText) {
      setInput(lastSearchText)
      setTextSelection({ start: lastSearchText.length, end: lastSearchText.length })
      setLastSearchText(null)
      debouncedHandleChange(lastSearchText)?.catch((error) => false)
    }
  }, [lastSearchText, onFocus, debouncedHandleChange, input])

  const handleBlur = useCallback(async () => {
    setTextSelection({ start: 0, end: 0 })
    onBlur?.()
  }, [onBlur])

  const defaultRenderItem: ListRenderItem<O> = useCallback(
    (info) => (
      <PressableStyled onPress={handleOptionPress(info.item)}>
        {renderItem ? (
          renderItem(info)
        ) : (
          <View className="border-b-px border-divider p-3">
            <Typography className="flex-1" numberOfLines={1}>
              {getOptionLabel(info.item)}
            </Typography>
          </View>
        )}
      </PressableStyled>
    ),
    [handleOptionPress, getOptionLabel, renderItem],
  )

  const handleSelectionChange = useCallback(
    (event: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
      setTextSelection(event.nativeEvent.selection)
    },
    [],
  )

  const optionsListProps: Omit<FlatListProps<O>, 'data'> = useMemo(
    () => ({
      className: 'flex-1',
      ...listProps,
      keyboardShouldPersistTaps: 'always',
      renderItem: defaultRenderItem,
    }),
    [defaultRenderItem, listProps],
  )

  return (
    <View>
      <TextInput
        {...restProps}
        ref={ref}
        onChange={handleChange}
        value={input}
        onBlur={handleBlur}
        onFocus={handleFocus}
        leftIcon={leftIcon}
        autoFocus={autoFocus}
        selection={textSelection}
        onSelectionChange={handleSelectionChange}
        returnKeyType="search"
      />
      <View>
        {multiSourceMode ? (
          renderResults?.(options, optionsListProps)
        ) : optionsPortalName ? (
          <Portal hostName={optionsPortalName}>
            {options.length > 0 && (resultsHeader ?? null)}
            <ListComponent data={options} {...optionsListProps} />
          </Portal>
        ) : (
          <>
            {options.length > 0 && (resultsHeader ?? null)}
            <ListComponent data={options} {...optionsListProps} />
          </>
        )}
      </View>
    </View>
  )
}

// The best, most reliable, and achievable solution is type assertion
// https://fettblog.eu/typescript-react-generic-forward-refs/#option-1%3A-type-assertion
const Autocomplete = forwardRef(AutocompleteInner) as <L extends any[], O>(
  p: AutocompleteProps<L, O> & { ref?: Ref<View> },
) => ReactElement

export default Autocomplete
