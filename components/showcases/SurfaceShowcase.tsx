import React from 'react'
import { View } from 'react-native'

import Panel from '@/components/shared/Panel'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'

const SurfaceShowcase = () => {
  return (
    <View className="p-4 g-4">
      <Panel>
        <Typography>Plain</Typography>
      </Panel>
      <PressableStyled>
        <Panel>
          <Typography>Pressable</Typography>
        </Panel>
      </PressableStyled>
      <Panel className="bg-warning-light">
        <Typography>Custom className</Typography>
      </Panel>
    </View>
  )
}

export default SurfaceShowcase
