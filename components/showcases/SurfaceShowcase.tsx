import React from 'react'
import { View } from 'react-native'

import Surface from '@/components/shared/Surface'
import Typography from '@/components/shared/Typography'

const SurfaceShowcase = () => {
  return (
    <View className="p-4 g-4">
      <Surface>
        <Typography>Plain</Typography>
      </Surface>
      <Surface touchable>
        <Typography>Touchable</Typography>
      </Surface>
      <Surface surfaceClassName="bg-warning-light">
        <Typography>Custom surfaceClassName</Typography>
      </Surface>
    </View>
  )
}

export default SurfaceShowcase
