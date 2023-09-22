import React from 'react'
import { View } from 'react-native'

import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'

const SurfaceShowcase = () => {
  return (
    <View className="p-4 g-4">
      <Panel>
        <Typography>Plain</Typography>
      </Panel>
      <Panel isPressable>
        <Typography>Touchable</Typography>
      </Panel>
      <Panel surfaceClassName="bg-warning-light">
        <Typography>Custom surfaceClassName</Typography>
      </Panel>
    </View>
  )
}

export default SurfaceShowcase
