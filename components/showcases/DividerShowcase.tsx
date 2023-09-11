import React from 'react'
import { View } from 'react-native'

import Divider from '@/components/shared/Divider'
import Surface from '@/components/shared/Surface'
import Typography from '@/components/shared/Typography'

const DividerShowcase = () => {
  return (
    <View className="px-4 g-4">
      <Divider />
      <Surface surfaceClassName="g-3">
        <Typography>See how divider is used in Surface component</Typography>
        <Divider />
        <Typography>It is neat!</Typography>
      </Surface>
    </View>
  )
}

export default DividerShowcase
