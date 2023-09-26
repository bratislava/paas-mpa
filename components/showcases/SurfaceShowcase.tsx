import React from 'react'
import { View } from 'react-native'

import Panel from '@/components/shared/Panel'
import PanelPressable from '@/components/shared/PanelPressable'
import Typography from '@/components/shared/Typography'

const SurfaceShowcase = () => {
  return (
    <View className="p-4 g-4">
      <Panel>
        <Typography>Plain</Typography>
      </Panel>
      <PanelPressable>
        <Typography>Pressable</Typography>
      </PanelPressable>
      <Panel className="bg-warning-light">
        <Typography>Custom className</Typography>
      </Panel>
    </View>
  )
}

export default SurfaceShowcase
