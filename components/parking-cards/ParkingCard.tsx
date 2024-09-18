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
  zoneName: string | null | undefined
  licencePlate: string | null | undefined
  validUntil: string | null | undefined
  cardNumber: string | null | undefined
  balanceSeconds: number | null | undefined
  originalBalanceSeconds: number | null | undefined
}

// TODO change card.name to zone
const ParkingCard = ({ card }: Props) => {
  switch (card.type) {
    case ParkingCardType.Abonent:
      return (
        <SubscriberCard
          zoneName={card.name}
          licencePlate={card.vehiclePlateNumber}
          validUntil={card.validTo}
        />
      )
    case ParkingCardType.Bpk:
      return (
        <BonusCard
          zoneName={card.name}
          licencePlate={card.vehiclePlateNumber}
          balanceSeconds={card.balanceSeconds}
          originalBalanceSeconds={card.originalBalanceSeconds}
          validUntil={card.validTo}
        />
      )
    case ParkingCardType.Rezident:
      return (
        <ResidentCard
          zoneName={card.name}
          licencePlate={card.vehiclePlateNumber}
          validUntil={card.validTo}
        />
      )
    case ParkingCardType.Npk:
      return (
        <VisitorCard
          zoneName={card.name}
          balanceSeconds={card.balanceSeconds}
          originalBalanceSeconds={undefined} // TODO check with parkdots if original balance is safe to use {card.originalBalanceSeconds}
          validUntil={card.validTo}
        />
      )
    case ParkingCardType.Tzp:
      return (
        <TzpCard
          zoneName={card.name}
          licencePlate={card.vehiclePlateNumber}
          validUntil={card.validTo}
        />
      )
    case ParkingCardType.Elektromobil:
      return (
        <ElectricCarCard
          zoneName={card.name}
          licencePlate={card.vehiclePlateNumber}
          validUntil={card.validTo}
        />
      )
    case ParkingCardType.Social:
      return (
        <SocialServicesCard
          zoneName={card.name}
          licencePlate={card.vehiclePlateNumber}
          validUntil={card.validTo}
        />
      )
    // case ParkingCardType.Other:
    default:
      return (
        <OtherCard
          zoneName={card.name}
          licencePlate={card.vehiclePlateNumber}
          validUntil={card.validTo}
        />
      )
  }
}

export default ParkingCard
