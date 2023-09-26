import React from 'react'
import { View } from 'react-native'

import Typography from '@/components/shared/Typography'

// TODO nicer design
const NoVehicles = () => {
  return (
    <View className="py-3 g-3">
      <Typography variant="h1">No vehicles</Typography>
      <Typography>Tap on “Add new” to add your first vehicle.</Typography>
    </View>
  )
}

export default NoVehicles
