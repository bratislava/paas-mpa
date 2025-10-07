import { Link, useLocalSearchParams } from 'expo-router'
import { FC, useState } from 'react'
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
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Divider from '@/components/shared/Divider'
import { SectionList } from '@/components/shared/List/SectionList'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { MapFilters, MapPointIconEnum, MapZoneStatusEnum } from '@/modules/map/constants'

type FiltersParams = MapFilters

type FilteringOptionsData = {
  icon: FC<SvgProps>
  optionKey: MapPointIconEnum | MapZoneStatusEnum
}

type FilteringOptionsTitle = 'payment' | 'parkingType' | 'zones'

const filteringOptions: {
  title: FilteringOptionsTitle
  data: FilteringOptionsData[]
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
    'christmas-tree': t('FiltersScreen.filteringOptions.christmas-tree'),
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
        <Link asChild dismissTo href={{ pathname: '/', params: filters }}>
          <ContinueButton>{t('FiltersScreen.showResults')}</ContinueButton>
        </Link>
      }
    >
      <ScreenContent>
        <SectionList
          sections={filteringOptions}
          extraData={filters}
          renderSectionHeader={({ title }) => (
            <Typography variant="default-bold">{translationsMapSections[title]}</Typography>
          )}
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
          SectionSeparatorComponent={() => <Divider className="h-3 bg-transparent" />}
        />
      </ScreenContent>
    </ScreenView>
  )
}

export default FiltersScreen
