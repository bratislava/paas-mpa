/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef, ReactElement, ReactNode, Ref, useCallback, useState } from 'react'
import {
  FlatList,
  ListRenderItem,
  NativeSyntheticEvent,
  TextInput as RNTextInput,
  TextInputChangeEventData,
  View,
} from 'react-native'
import { useDebouncedCallback } from 'use-debounce'

import TextInput from '@/components/inputs/TextInput'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'

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
}

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
  }: AutocompleteProps<O>,
  ref: React.ForwardedRef<RNTextInput>,
) => {
  const [input, setInput] = useState(defaultValue)
  const [value, setValue] = useState<O | null>(null)
  const [options, setOptions] = useState<O[]>([])
  const [lastSearchText, setLastSearchText] = useState<string | null>(null)

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
    if (lastSearchText) {
      setInput(lastSearchText)
      setLastSearchText(null)
    }
  }, [lastSearchText, onFocus])

  const handleBlur = useCallback(async () => {
    onBlur?.()
  }, [onBlur])

  const defaultRenderItem: ListRenderItem<O> = useCallback(
    (info) => (
      <PressableStyled className="border-b-px" onPress={handleOptionPress(info.item)}>
        {renderItem ? (
          renderItem(info)
        ) : (
          <View className="border-divider p-3">
            <Typography className="flex-1" numberOfLines={1}>
              {getOptionLabel(info.item)}
            </Typography>
          </View>
        )}
      </PressableStyled>
    ),
    [handleOptionPress, getOptionLabel, renderItem],
  )

  return (
    <View ref={ref}>
      <TextInput
        ref={ref}
        onChange={handleChange}
        value={input}
        onBlur={handleBlur}
        onFocus={handleFocus}
        leftIcon={leftIcon}
      />
      <View>
        <FlatList
          keyboardShouldPersistTaps="always"
          renderItem={defaultRenderItem}
          data={options}
        />
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
