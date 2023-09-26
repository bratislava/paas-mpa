import React from 'react'
import { View } from 'react-native'

import ResidentCard from '@/components/parking-cards/ResidentCard'
import VisitorCard from '@/components/parking-cards/VisitorCard'

const ParkingCardsShowcase = () => {
  return (
    <View className="p-4 g-4">
      <VisitorCard />
      <ResidentCard />
    </View>
  )
}

export default ParkingCardsShowcase
