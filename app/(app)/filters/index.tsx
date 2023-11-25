import { Link, useLocalSearchParams } from 'expo-router'
import { FC, useState } from 'react'
import { SectionList, View } from 'react-native'
import { SvgProps } from 'react-native-svg'

import {
  ActiveZonesIcon,
  AssistantIcon,
  GarageIcon,
  ParkingIcon,
  ParkomatIcon,
  PlannedZonesIcon,
  PPLusRIcon,
  SellingPointIcon,
} from '@/assets/map'
import SelectRow from '@/components/list-rows/SelectRow'
import ContinueButton from '@/components/navigation/ContinueButton'
import ScreenView from '@/components/screen-layout/ScreenView'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { MapFilters, MapPointIconEnum, MapZoneStatusEnum } from '@/modules/map/constants'

type FiltersParams = MapFilters

const filteringOptions: {
  title: string
  data: { icon: FC<SvgProps>; optionKey: MapPointIconEnum | MapZoneStatusEnum }[]
}[] = [
  {
    title: 'payment',
    data: [
      { icon: ParkomatIcon, optionKey: MapPointIconEnum.parkomat },
      { icon: SellingPointIcon, optionKey: MapPointIconEnum.partner },
      { icon: AssistantIcon, optionKey: MapPointIconEnum.assistant },
    ],
  },
  {
    title: 'parkingType',
    data: [
      { icon: ParkingIcon, optionKey: MapPointIconEnum.parkingLot },
      { icon: GarageIcon, optionKey: MapPointIconEnum.garage },
      { icon: PPLusRIcon, optionKey: MapPointIconEnum.pPlusR },
    ],
  },
  {
    title: 'zones',
    data: [
      { icon: ActiveZonesIcon, optionKey: MapZoneStatusEnum.active },
      { icon: PlannedZonesIcon, optionKey: MapZoneStatusEnum.planned },
    ],
  },
]

const FiltersScreen = () => {
  const filtersParams = useLocalSearchParams<FiltersParams>()
  const [filters, setFilters] = useState<Partial<MapFilters>>(filtersParams)
  const t = useTranslation('FiltersScreen')
  const tCommon = useTranslation('Common')

  const getValueChangeHandler =
    (filterKey: MapZoneStatusEnum | MapPointIconEnum) => (value: boolean) => {
      setFilters((oldFilters) => {
        const newFilters = { ...oldFilters }
        newFilters[filterKey] = value ? 'true' : 'false'

        return newFilters
      })
    }

  return (
    <ScreenView
      title={t('title')}
      actionButton={
        <Link asChild href={{ pathname: '/', params: filters }}>
          <ContinueButton>{tCommon('showResults')}</ContinueButton>
        </Link>
      }
    >
      <View>
        <SectionList
          sections={filteringOptions}
          renderSectionHeader={({ section: { title } }) => (
            <View>
              <Typography variant="default-bold">{t(`sectionHeaders.${title}`)}</Typography>
            </View>
          )}
          className="p-5"
          renderItem={({ item: { icon, optionKey } }) => (
            <SelectRow
              key={optionKey}
              IconComponent={icon}
              label={t(`filteringOptions.${optionKey}`)}
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
