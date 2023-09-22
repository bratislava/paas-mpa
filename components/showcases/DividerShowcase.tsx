import React from 'react'
import { View } from 'react-native'

import Divider from '@/components/shared/Divider'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'

const DividerShowcase = () => {
  return (
    <View className="px-4 g-4">
      <Divider />
      <Panel surfaceClassName="g-3">
        <Typography>See how divider is used in Surface component</Typography>
        <Divider />
        <Typography>It is neat!</Typography>
      </Panel>
    </View>
  )
}

export default DividerShowcase
