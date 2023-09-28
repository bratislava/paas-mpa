import {
  AssistantIcon,
  BranchIcon,
  GarageIcon,
  ParkingLotIcon,
  ParkomatIcon,
  PartnerIcon,
  PPlusRIcon,
} from '@/assets/map'

import { IconsEnum } from '../constants'

export const getMapIcon = (iconName: IconsEnum) => {
  switch (iconName) {
    case IconsEnum.branch:
      return BranchIcon
    case IconsEnum.assistant:
      return AssistantIcon
    case IconsEnum.garage:
      return GarageIcon
    case IconsEnum.pPlusR:
      return PPlusRIcon
    case IconsEnum.parkingLot:
      return ParkingLotIcon
    case IconsEnum.parkomat:
      return ParkomatIcon
    case IconsEnum.partner:
      return PartnerIcon
    default:
      return null
  }
}
