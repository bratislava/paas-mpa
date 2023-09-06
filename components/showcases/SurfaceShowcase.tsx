import React from 'react'
import { Text, View } from 'react-native'

import Surface from '@/components/shared/Surface'

const SurfaceShowcase = () => {
  return (
    <View className="p-4 g-4">
      <Surface>
        <Text>Plain</Text>
      </Surface>
      <Surface touchable>
        <Text>Touchable</Text>
      </Surface>
      <Surface surfaceClassName="bg-warning-100">
        <Text>Custom surfaceClassName</Text>
      </Surface>
    </View>
  )
}

export default SurfaceShowcase
