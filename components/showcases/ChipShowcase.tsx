import React from 'react'
import { View } from 'react-native'

import Chip from '@/components/shared/Chip'

const ChipShowcase = () => {
  return (
    <View className="flex-row flex-wrap p-4 g-4">
      <Chip label="Chip" />
      <Chip label="Chip active" isActive />
    </View>
  )
}

export default ChipShowcase
