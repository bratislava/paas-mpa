import React from 'react'
import { View } from 'react-native'

import { SearchIcon } from '@/assets/ui-icons'
import TextInput from '@/components/inputs/TextInput'
import Typography from '@/components/shared/Typography'

const TextInputShowcase = () => {
  return (
    <View className="p-4 g-4">
      <TextInput />
      <TextInput placeholder="With placeholder" />
      <TextInput hasError placeholder="With errorMessage" />
      <TextInput isDisabled placeholder="Disabled" />
      <TextInput isDisabled hasError placeholder="Disabled with error (shouldn't be red)" />
      <TextInput secureTextEntry />
      <TextInput multiline numberOfLines={4} placeholder="Multiline" />
      <TextInput leftIcon={<SearchIcon />} placeholder="Search" />
      <TextInput leftIcon={<Typography>+421</Typography>} placeholder="Prefix" />
    </View>
  )
}

export default TextInputShowcase
