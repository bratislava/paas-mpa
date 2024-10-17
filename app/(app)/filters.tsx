import { Link, useLocalSearchParams } from 'expo-router'
import { FC, useState } from 'react'
import { SectionList, View } from 'react-native'
import { SvgProps } from 'react-native-svg'

import {
  ActiveZonesIcon,
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
import Divider from '@/components/shared/Divider'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { MapFilters, MapPointIconEnum, MapZoneStatusEnum } from '@/modules/map/constants'
import { cn } from '@/utils/cn'

type FiltersParams = MapFilters

const filteringOptions: {
  title: 'payment' | 'parkingType' | 'zones' // TODO more universal type
  data: { icon: FC<SvgProps>; optionKey: MapPointIconEnum | MapZoneStatusEnum }[]
}[] = [
  {
    title: 'payment',
    data: [
      { icon: ParkomatIcon, optionKey: MapPointIconEnum.parkomat },
      { icon: SellingPointIcon, optionKey: MapPointIconEnum.partner },
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
  const { t } = useTranslation()

  // TODO test translations
  const translationsMapSections = {
    payment: t('FiltersScreen.sectionHeaders.payment'),
    parkingType: t('FiltersScreen.sectionHeaders.parkingType'),
    zones: t('FiltersScreen.sectionHeaders.zones'),
  } satisfies Record<(typeof filteringOptions)[0]['title'], string>

  // TODO test translations
  const translationsMapItems = {
    active: t('FiltersScreen.filteringOptions.active'),
    inactive: t('FiltersScreen.filteringOptions.inactive'), // TODO translation - inactive zones are probably never used and shown, but we keep this translation
    planned: t('FiltersScreen.filteringOptions.planned'),
    branch: t('FiltersScreen.filteringOptions.branch'), // TODO translation - this type of map points is not shown in MPA, only on web
    garage: t('FiltersScreen.filteringOptions.garage'),
    'p-plus-r': t('FiltersScreen.filteringOptions.p-plus-r'),
    'parking-lot': t('FiltersScreen.filteringOptions.parking-lot'),
    parkomat: t('FiltersScreen.filteringOptions.parkomat'),
    partner: t('FiltersScreen.filteringOptions.partner'),
  } satisfies Record<MapPointIconEnum | MapZoneStatusEnum, string>

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
      title={t('FiltersScreen.title')}
      actionButton={
        <Link asChild href={{ pathname: '/', params: filters }}>
          <ContinueButton>{t('FiltersScreen.showResults')}</ContinueButton>
        </Link>
      }
    >
      <View className="flex-1">
        <SectionList
          sections={filteringOptions}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section: { title } }) => (
            // Add padding only if it's not the first section, TODO find cleaner solution
            <View className={cn({ 'mt-2': title !== filteringOptions[0].title })}>
              <Typography variant="default-bold">{translationsMapSections[title]}</Typography>
            </View>
          )}
          className="p-5"
          renderItem={({ item: { icon, optionKey } }) => (
            <SelectRow
              key={optionKey}
              IconComponent={icon}
              className="py-2"
              label={translationsMapItems[optionKey]}
              onValueChange={getValueChangeHandler(optionKey)}
              value={filters[optionKey] === 'true'}
            />
          )}
          // SectionSeparatorComponent is added above and below section header, so we add only h-1 height and use workaround with top margin in renderSectionHeader
          SectionSeparatorComponent={() => <Divider className="h-3 bg-transparent" />}
        />
      </View>
    </ScreenView>
  )
}

export default FiltersScreen
