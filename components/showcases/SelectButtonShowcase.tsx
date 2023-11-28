import { View } from 'react-native'

import SelectButton from '@/components/inputs/SelectButton'

const SelectButtonShowcase = () => {
  return (
    <View className="flex-col p-4 g-4">
      <SelectButton value="Value" />
      <SelectButton placeholder="Placeholder" />
      <SelectButton value="Value" isDisabled />
      <SelectButton placeholder="Placeholder" isDisabled />
    </View>
  )
}

export default SelectButtonShowcase
