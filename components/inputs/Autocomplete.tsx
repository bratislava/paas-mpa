/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Portal } from '@gorhom/portal'
import { useQuery } from '@tanstack/react-query'
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

/** Extracts the types of sub arrays inside of an array into a union type. Example: `[string[], number[]]` -> `string | number` */
type ExtractUnionType<T> = T extends [infer X, ...infer Rest]
  ? X extends any[]
    ? X[number] | ExtractUnionType<Rest>
    : never
  : never

type CommonProps<L, O> = {
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
  renderResults: (data: {
    options: L
    optionsListProps: Omit<FlatListProps<O>, 'data'>
    isFetching: boolean
    isFetched: boolean
    input: string
  }) => ReactNode
} & TextInputProps

type BaseAutocompleteProps<L extends any[], O = L[number]> = CommonProps<L, O>

type MultiAutocompleteProps<L extends any[][], O = ExtractUnionType<L>> = CommonProps<L, O>

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
  const emptyOptions = useMemo(
    // for now supports only 2 sources
    () => (multiSourceMode ? ([[], []] as L) : ([] as unknown as L)),
    [multiSourceMode],
  )
  const [isDebouncing, setIsDebouncing] = useState(false)
  const [input, setInput] = useState(defaultValue)
  const [options, setOptions] = useState<L>(emptyOptions)
  const [lastSearchText, setLastSearchText] = useState<string | null>(null)
  const [textSelection, setTextSelection] = useState<TextSelection>()

  const { refetch, isFetching, isFetched } = useQuery({
    queryKey: ['Autocomplete', getOptions, input],
    queryFn: () => getOptions(input),
    enabled: false,
  })

  const debouncedHandleChange = useDebouncedCallback(async (newInput: string) => {
    setIsDebouncing(false)
    const newOptions = await refetch()
    setOptions(newOptions.data ?? emptyOptions)
  }, debounce)

  const handleChange = useCallback(
    async (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
      const newInput = event.nativeEvent.text
      setInput(newInput)
      setIsDebouncing(true)
      debouncedHandleChange(newInput)?.catch((error) => false)
    },
    [debouncedHandleChange],
  )

  const handleOptionPress = useCallback(
    (option: O) => () => {
      setLastSearchText(input)
      setInput(getOptionLabel(option))
      onValueChange(option)
      setOptions(emptyOptions)
    },
    [getOptionLabel, onValueChange, input, emptyOptions],
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
          renderResults?.({
            options,
            optionsListProps,
            isFetching: isFetching || isDebouncing,
            isFetched,
            input,
          })
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
/** `L` (as list) is the type of the options, this can either be an array or an array of arrays when `multiSourceMode` is `true`.
 *  `O` is the type of an option, is automatically inferred from `L`.  */
const Autocomplete = forwardRef(AutocompleteInner) as <L extends any[], O>(
  p: AutocompleteProps<L, O> & { ref?: Ref<View> },
) => ReactElement

export default Autocomplete
