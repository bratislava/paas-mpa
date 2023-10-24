import React from 'react'
import { View } from 'react-native'

import BonusCard from '@/components/parking-cards/cards/BonusCard'
import OtherCard from '@/components/parking-cards/cards/OtherCard'
import ResidentCard from '@/components/parking-cards/cards/ResidentCard'
import SubscriberCard from '@/components/parking-cards/cards/SubscriberCard'
import VisitorCard from '@/components/parking-cards/cards/VisitorCard'

const ParkingCardsShowcase = () => {
  return (
    <View className="p-4 g-4">
      <VisitorCard cardNumber="car number" remainingCredit="credit" validUntil="date" />
      <ResidentCard licencePlate="AA111AA" validUntil="date" zoneName="zoneName" />
      <SubscriberCard licencePlate="AA111AA" validUntil="date" zoneName="zoneName" />
      <BonusCard licencePlate="AA111AA" validUntil="date" zoneName="zoneName" />
      <OtherCard licencePlate="AA111AA" validUntil="date" zoneName="fallback style card" />
    </View>
  )
}

export default ParkingCardsShowcase
