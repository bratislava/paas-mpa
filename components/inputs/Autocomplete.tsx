import { forwardRef, useCallback, useState } from 'react'
import { NativeSyntheticEvent, TextInputChangeEventData, View, VirtualizedList } from 'react-native'

import TextInput from '@/components/inputs/TextInput'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'

type Props<O> = {
  onValueChange: (value: O) => void
  defaultValue?: string
  getOptions: (search: string) => O[] | Promise<O[]>
  areOptionsEqual?: (optionA: O, optionB: O) => boolean
  getOptionLabel: (option: O) => string
}

// eslint-disable-next-line react/function-component-definition
function AutocompleteInner<O>(
  { onValueChange, defaultValue = '', getOptions, areOptionsEqual, getOptionLabel }: Props<O>,
  ref: React.ForwardedRef<View>,
) {
  const [input, setInput] = useState(defaultValue)
  const [value, setValue] = useState<O | null>(null)
  const [options, setOptions] = useState<O[]>([])
  const handleChange = useCallback(
    async (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
      const newInput = event.nativeEvent.text
      setInput(newInput)
      const newOptions = await getOptions(newInput)
      setOptions(newOptions)
    },
    [getOptions],
  )

  const handleOptionPress = (option: O) => () => {
    setValue(option)
    setInput(getOptionLabel(option))
    onValueChange(option)
  }

  return (
    <View ref={ref}>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <TextInput onChange={handleChange} value={input} />
      <View>
        <VirtualizedList
          renderItem={({ item }) => (
            <PressableStyled
              className="border-b-1 border-b-light"
              onPress={handleOptionPress(item as O)}
            >
              <Typography>{getOptionLabel(item as O)}</Typography>
            </PressableStyled>
          )}
          data={options}
        />
      </View>
    </View>
  )
}

const Autocomplete = forwardRef(AutocompleteInner)

export default Autocomplete
