import BonusCard from '@/components/parking-cards/cards/BonusCard'
import OtherCard from '@/components/parking-cards/cards/OtherCard'
import ResidentCard from '@/components/parking-cards/cards/ResidentCard'
import SubscriberCard from '@/components/parking-cards/cards/SubscriberCard'
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
  remainingCredit: string | null | undefined
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
          cardNumber={card.identificator}
          remainingCredit={card.balance}
          validUntil={card.validTo}
        />
      )
    // TODO style for these cards
    // case ParkingCardType.Tzp:
    // case ParkingCardType.Elektromobil:
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
