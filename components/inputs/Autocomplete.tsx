/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef, ReactElement, Ref, useCallback, useState } from 'react'
import { FlatList, NativeSyntheticEvent, TextInputChangeEventData, View } from 'react-native'
import { useDebouncedCallback } from 'use-debounce'

import TextInput from '@/components/inputs/TextInput'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'

type Props<O> = {
  onValueChange: (value: O) => void
  defaultValue?: string
  getOptions: (search: string) => Promise<O[]>
  areOptionsEqual?: (optionA: O, optionB: O) => boolean
  getOptionLabel: (option: O) => string
  debounce?: number
}

// eslint-disable-next-line react/function-component-definition
function AutocompleteInner<O>(
  {
    onValueChange,
    defaultValue = '',
    getOptions,
    areOptionsEqual,
    getOptionLabel,
    debounce = 300,
  }: Props<O>,
  ref: React.ForwardedRef<View>,
) {
  const [input, setInput] = useState(defaultValue)
  const [value, setValue] = useState<O | null>(null)
  const [options, setOptions] = useState<O[]>([])

  const debouncedHandleChange = useDebouncedCallback(async (newInput: string) => {
    const newOptions = await getOptions(newInput)
    setOptions(newOptions)
  }, debounce)

  const handleChange = useCallback(
    async (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
      console.log({ event })
      const newInput = event.nativeEvent.text
      setInput(newInput)
      debouncedHandleChange(newInput)?.catch((error) => false)
    },
    [debouncedHandleChange],
  )

  const handleOptionPress = (option: O) => () => {
    setValue(option)
    setInput(getOptionLabel(option))
    onValueChange(option)
    setOptions([])
  }

  return (
    <View ref={ref}>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <TextInput onChange={handleChange} value={input} />
      <View>
        <FlatList
          renderItem={({ item }) => (
            <PressableStyled
              className="border-divider p-3"
              // eslint-disable-next-line react-native/no-inline-styles
              style={{ borderBottomWidth: 1 }}
              onPress={handleOptionPress(item)}
            >
              <Typography>{getOptionLabel(item)}</Typography>
            </PressableStyled>
          )}
          data={options}
        />
      </View>
    </View>
  )
}

const Autocomplete = forwardRef(AutocompleteInner) as <O>(
  p: Props<O> & { ref?: Ref<View> },
) => ReactElement

export default Autocomplete
