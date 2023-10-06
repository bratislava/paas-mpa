import { useLocalSearchParams } from 'expo-router'
import { ScrollView, View } from 'react-native'

import {
  AssistantImage,
  GarageImage,
  ParkingImage,
  ParkomatImage,
  PPLusRImage,
  SellingPointImage,
} from '@/assets/map/images'
import ScreenView from '@/components/shared/ScreenView'
import { useTranslation } from '@/hooks/useTranslation'
import { MapFilters, MapPointIconEnum, MapZoneStatusEnum } from '@/modules/map/constants'

type FiltersParams = MapFilters

const paymentFilteringOptions = [
  { iconSource: ParkomatImage, translationKey: MapPointIconEnum.parkomat },
  { iconSource: SellingPointImage, translationKey: MapPointIconEnum.sellingPoint },
  { iconSource: AssistantImage, translationKey: MapPointIconEnum.assistant },
]

const parkingTypeFilteringOptions = [
  { iconSource: ParkingImage, translationKey: MapPointIconEnum.parkingLot },
  { iconSource: GarageImage, translationKey: MapPointIconEnum.garage },
  { iconSource: PPLusRImage, translationKey: MapPointIconEnum.pPlusR },
]

const zoneFilteringOptions = [
  { iconSource: ParkingImage, translationKey: MapZoneStatusEnum.active },
  { iconSource: GarageImage, translationKey: MapZoneStatusEnum.planned },
]

const FiltersScreen = () => {
  // reason for not passing the whole object: https://reactnavigation.org/docs/params/#what-should-be-in-params
  const filtersParams = useLocalSearchParams<FiltersParams>()
  const t = useTranslation()

  return (
    <ScreenView
      title={t('FiltersScreen.title')}
      continueProps={{ href: '/', label: t('FiltersScreen.showResults') }}
    >
      <ScrollView className="p-5 g-4">
        <View />
      </ScrollView>
    </ScreenView>
  )
}

export default FiltersScreen
