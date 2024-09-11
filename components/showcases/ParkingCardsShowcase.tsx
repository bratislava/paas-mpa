import React from 'react'
import { View } from 'react-native'

import BonusCard from '@/components/parking-cards/cards/BonusCard'
import ElectricCarCard from '@/components/parking-cards/cards/ElectricCarCard'
import OtherCard from '@/components/parking-cards/cards/OtherCard'
import ResidentCard from '@/components/parking-cards/cards/ResidentCard'
import SocialServicesCard from '@/components/parking-cards/cards/SocialServicesCard'
import SubscriberCard from '@/components/parking-cards/cards/SubscriberCard'
import TzpCard from '@/components/parking-cards/cards/TzpCard'
import VisitorCard from '@/components/parking-cards/cards/VisitorCard'

const ParkingCardsShowcase = () => {
  const date = '2024-08-27'

  return (
    <View className="p-4 g-4">
      <VisitorCard
        zoneName="zone Name"
        balanceSeconds={60 * 60 * 24}
        originalBalanceSeconds={60 * 60 * 24 * 2}
        validUntil={date}
      />
      <ResidentCard licencePlate="AA111AA" validUntil={date} zoneName="zoneName" />
      <SubscriberCard licencePlate="AA111AA" validUntil={date} zoneName="zoneName" />
      <BonusCard
        licencePlate="AA111AA"
        validUntil={date}
        zoneName="zoneName"
        balanceSeconds={60 * 60 * 24}
        originalBalanceSeconds={60 * 60 * 24 * 2}
      />
      <TzpCard licencePlate="AA111AA" validUntil={date} zoneName="zoneName" />
      <ElectricCarCard licencePlate="AA111AA" validUntil={date} zoneName="zoneName" />
      <SocialServicesCard licencePlate="AA111AA" validUntil={date} zoneName="zoneName" />
      <OtherCard licencePlate="AA111AA" validUntil={date} zoneName="fallback style card" />
    </View>
  )
}

export default ParkingCardsShowcase
