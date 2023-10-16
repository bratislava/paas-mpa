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

export type AutocompleteProps<O> = {
  onValueChange: (value: O) => void
  defaultValue?: string
  getOptions: (search: string) => Promise<O[]>
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
} & TextInputProps

const AutocompleteInner = <O,>(
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
    ...restProps
  }: AutocompleteProps<O>,
  ref: React.ForwardedRef<RNTextInput>,
) => {
  const [input, setInput] = useState(defaultValue)
  const [value, setValue] = useState<O | null>(null)
  const [options, setOptions] = useState<O[]>([])
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
      setValue(option)
      setInput(getOptionLabel(option))
      onValueChange(option)
      setOptions([])
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
    <View ref={ref}>
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
      />
      <View>
        {optionsPortalName ? (
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
const Autocomplete = forwardRef(AutocompleteInner) as <O>(
  p: AutocompleteProps<O> & { ref?: Ref<View> },
) => ReactElement

export default Autocomplete
