import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { SectionList, View } from 'react-native'

import {
  AssistantImage,
  GarageImage,
  ParkingImage,
  ParkomatImage,
  PPLusRImage,
  SellingPointImage,
} from '@/assets/map/images'
import SelectRow from '@/components/actions/SelectRow'
import ScreenView from '@/components/shared/ScreenView'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { MapFilters, MapPointIconEnum, MapZoneStatusEnum } from '@/modules/map/constants'

type FiltersParams = MapFilters

const filteringOptions = [
  {
    title: 'payment',
    data: [
      { iconSource: ParkomatImage, optionKey: MapPointIconEnum.parkomat },
      { iconSource: SellingPointImage, optionKey: MapPointIconEnum.sellingPoint },
      { iconSource: AssistantImage, optionKey: MapPointIconEnum.assistant },
    ],
  },
  {
    title: 'parkingType',
    data: [
      { iconSource: ParkingImage, optionKey: MapPointIconEnum.parkingLot },
      { iconSource: GarageImage, optionKey: MapPointIconEnum.garage },
      { iconSource: PPLusRImage, optionKey: MapPointIconEnum.pPlusR },
    ],
  },
  {
    title: 'zones',
    data: [
      { iconSource: ParkingImage, optionKey: MapZoneStatusEnum.active },
      { iconSource: GarageImage, optionKey: MapZoneStatusEnum.planned },
    ],
  },
]

const FiltersScreen = () => {
  // reason for not passing the whole object: https://reactnavigation.org/docs/params/#what-should-be-in-params
  const filtersParams = useLocalSearchParams<FiltersParams>()
  const [filters, setFilters] = useState<Partial<MapFilters>>(filtersParams)
  const t = useTranslation()

  const getValueChangeHandler =
    (filterKey: MapZoneStatusEnum | MapPointIconEnum) => (value: boolean) => {
      setFilters((oldFilters) => {
        const newFilters = oldFilters
        newFilters[filterKey] = value ? 'true' : 'false'

        return newFilters
      })
    }

  return (
    <ScreenView
      title={t('FiltersScreen.title')}
      continueProps={{ href: '/', label: t('FiltersScreen.showResults') }}
    >
      <View>
        <SectionList
          sections={filteringOptions}
          renderSectionHeader={({ section: { title } }) => (
            <View>
              <Typography variant="default-bold">
                {t(`FiltersScreen.sectionHeaders.${title}`)}
              </Typography>
            </View>
          )}
          className="p-5"
          renderItem={({ item: { iconSource, optionKey } }) => (
            <SelectRow
              key={optionKey}
              iconSource={iconSource}
              label={t(`FiltersScreen.filteringOptions.${optionKey}`)}
              onValueChange={getValueChangeHandler(optionKey)}
              value={filters[optionKey] === 'true'}
            />
          )}
        />
      </View>
    </ScreenView>
  )
}

export default FiltersScreen
