import { useMemo } from 'react'

import MapPointBottomSheet from '@/components/map/MapPointBottomSheet'
import { MapPointIconEnum, MapPointKindEnum } from '@/modules/map/constants'
import { MapPointWithTranslationProps } from '@/modules/map/types'

const BRANCH_EXAMPLE = {
  address: 'Primaciálne nám. 1, 811 01 Bratislava',
  place: 'Magistrát hl. mesta SR Bratislavy',
  navigation:
    'https://www.google.com/maps/place/Magistr%C3%A1t+hlavn%C3%A9ho+mesta+SR+Bratislavy/@48.1439423,17.1091824,234m/data=!3m3!1e3!4b1!5s0x476c89431d7c7795:0x4caf7acfb0ed99d7!4m5!3m4!1s0x476c89433d1bc761:0x6ad8016ef317f8f0!8m2!3d48.1439414!4d17.1097296',
  name: 'PAAS Centrum',
  id: 4,
  openingHours: {
    en: 'Mo 8:30-17:00, Tu-Th 8:30-16:00, Fr 8:30-15:00',
    sk: 'Po 8:30-17:00, Ut-Št 8:30-16:00, Pi 8:30-15:00',
  },
  icon: MapPointIconEnum.branch,
  kind: MapPointKindEnum.branch,
} satisfies MapPointWithTranslationProps

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PARKING_LOT_EXAMPLE = {
  publicTransportTravelTime: '4 min',
  navigation:
    'https://www.google.com/maps/place/Parkovisko+%C4%8Cerny%C5%A1evsk%C3%A9ho/@48.1301808,17.1171949,220m/data=!3m1!1e3!4m14!1m8!3m7!1s0x0:0x73e7a623fba85a53!2zNDjCsDA3JzQ4LjkiTiAxN8KwMDcnMDEuNiJF!3b1!7e2!8m2!3d48.1302537!4d17.1171213!3m4!1s0x476c89d84e48ef8b',
  name: { en: 'Parking lot Černyševského', sk: 'Záchytné parkovisko Černyševského' },
  id: 7,
  parkingSpotCount: 59,
  surface: { en: 'parking lot', sk: 'parkovisko' },
  openingHours:
    'V pracovné dni: Od 05:00-24:00 pre návštevníkov zadarmo. Od 00:00-05:00 len pre držiteľov rezidentskej karty.\nVíkendy: zadarmo.',
  publicTransportLines: '3, 84, 95, 99',
  distanceToCenter: '>500 m',
  icon: MapPointIconEnum.parkingLot,
  kind: MapPointKindEnum.parkingLot,
} satisfies MapPointWithTranslationProps

const Page = () => {
  const point = useMemo(() => BRANCH_EXAMPLE, [])

  return <MapPointBottomSheet point={point} />
}

export default Page
