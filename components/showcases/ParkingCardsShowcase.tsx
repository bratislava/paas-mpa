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

  const commonCardProps = {
    zoneName: 'zoneName',
    validUntil: date,
    validFrom: date,
  }

  return (
    <View className="p-4 g-4">
      <VisitorCard
        balanceSeconds={60 * 60 * 24}
        originalBalanceSeconds={60 * 60 * 24 * 2}
        {...commonCardProps}
      />
      <ResidentCard licencePlate="AA111AA" {...commonCardProps} />
      <SubscriberCard licencePlate="AA111AA" {...commonCardProps} />
      <BonusCard
        licencePlate="AA111AA"
        {...commonCardProps}
        balanceSeconds={60 * 60 * 24}
        originalBalanceSeconds={60 * 60 * 24 * 2}
      />
      <TzpCard licencePlate="AA111AA" {...commonCardProps} />
      <ElectricCarCard licencePlate="AA111AA" {...commonCardProps} />
      <SocialServicesCard licencePlate="AA111AA" {...commonCardProps} />
      <OtherCard licencePlate="AA111AA" {...commonCardProps} zoneName="fallback style card" />
    </View>
  )
}

export default ParkingCardsShowcase
