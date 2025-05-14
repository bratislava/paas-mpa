import BonusCard from '@/components/parking-cards/cards/BonusCard'
import ElectricCarCard from '@/components/parking-cards/cards/ElectricCarCard'
import OtherCard from '@/components/parking-cards/cards/OtherCard'
import ResidentCard from '@/components/parking-cards/cards/ResidentCard'
import SocialServicesCard from '@/components/parking-cards/cards/SocialServicesCard'
import SubscriberCard from '@/components/parking-cards/cards/SubscriberCard'
import TzpCard from '@/components/parking-cards/cards/TzpCard'
import VisitorCard from '@/components/parking-cards/cards/VisitorCard'
import { ParkingCardDto, ParkingCardType } from '@/modules/backend/openapi-generated'

type Props = {
  card: ParkingCardDto
}

export type CommonParkingCardProps = {
  zoneName: string | undefined
  licencePlate: string | undefined
  validUntil: string | undefined
  validFrom: string | undefined
  cardNumber: string | undefined
  balanceSeconds: number | undefined
  originalBalanceSeconds: number | undefined
}

// TODO change card.name to zone
const ParkingCard = ({ card }: Props) => {
  const commonCardProps = {
    zoneName: card.name,
    validUntil: card.validTo,
    validFrom: card.validFrom,
  }

  switch (card.type) {
    case ParkingCardType.Abonent:
      return <SubscriberCard licencePlate={card.vehiclePlateNumber} {...commonCardProps} />
    case ParkingCardType.Bpk:
      return (
        <BonusCard
          licencePlate={card.vehiclePlateNumber}
          balanceSeconds={card.balanceSeconds}
          originalBalanceSeconds={card.originalBalanceSeconds}
          {...commonCardProps}
        />
      )
    case ParkingCardType.Rezident:
      return <ResidentCard licencePlate={card.vehiclePlateNumber} {...commonCardProps} />
    case ParkingCardType.Npk:
      return (
        <VisitorCard
          balanceSeconds={card.balanceSeconds}
          originalBalanceSeconds={undefined} // TODO check with parkdots if original balance is safe to use {card.originalBalanceSeconds}
          {...commonCardProps}
        />
      )
    case ParkingCardType.Tzp:
      return <TzpCard licencePlate={card.vehiclePlateNumber} {...commonCardProps} />
    case ParkingCardType.Elektromobil:
      return <ElectricCarCard licencePlate={card.vehiclePlateNumber} {...commonCardProps} />
    case ParkingCardType.Social:
      return <SocialServicesCard licencePlate={card.vehiclePlateNumber} {...commonCardProps} />
    // case ParkingCardType.Other:
    default:
      return <OtherCard licencePlate={card.vehiclePlateNumber} {...commonCardProps} />
  }
}

export default ParkingCard
