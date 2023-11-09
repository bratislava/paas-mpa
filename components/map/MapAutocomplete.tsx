import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { Portal } from '@gorhom/portal'
import { forwardRef, useCallback } from 'react'
import { TextInput as RNTextInput, View } from 'react-native'

import ZoneBadge from '@/components/info/ZoneBadge'
import Autocomplete, { AutocompleteProps } from '@/components/inputs/Autocomplete'
import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import Typography from '@/components/shared/Typography'
import { useLocale, useTranslation } from '@/hooks/useTranslation'
import { GeocodingFeature, NormalizedUdrZone } from '@/modules/map/types'
import { forwardGeocode } from '@/modules/map/utils/forwardGeocode'
import { normalizeZone } from '@/modules/map/utils/normalizeZone'
import { useMapZonesContext } from '@/state/MapZonesProvider/useMapZonesContext'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Unpromise<T extends Promise<any>> = T extends Promise<infer U> ? U : never

type Props = Partial<
  AutocompleteProps<
    [NormalizedUdrZone[], Unpromise<ReturnType<typeof forwardGeocode>>],
    GeocodingFeature | NormalizedUdrZone
  >
>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGeocodingFeature = (value: any): value is GeocodingFeature => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return value?.place_name !== undefined
}

const normalizeString = (str: string) =>
  str
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036F]/g, '')
    .toLowerCase()

const MapAutocomplete = forwardRef<RNTextInput, Props>(
  ({ onValueChange, optionsPortalName, ...restProps }: Props, ref) => {
    const t = useTranslation('ZoneDetailsScreen')
    const handleValueChange = useCallback(
      (value: GeocodingFeature | NormalizedUdrZone) => {
        onValueChange?.(value)
      },
      [onValueChange],
    )

    const { mapZones } = useMapZonesContext()
    const locale = useLocale()

    const getOptions = useCallback(
      async (
        input: string,
      ): Promise<[NormalizedUdrZone[], Unpromise<ReturnType<typeof forwardGeocode>>]> => {
        const filteredMapZones: NormalizedUdrZone[] = []
        if (mapZones) {
          // eslint-disable-next-line no-restricted-syntax
          for (const [, zone] of mapZones) {
            if (normalizeString(zone.properties.Nazov).includes(normalizeString(input))) {
              const nomralizedZone = normalizeZone(zone.properties, locale)
              filteredMapZones.push(nomralizedZone)
            }
          }
        }

        return [filteredMapZones, await forwardGeocode(input)]
      },
      [mapZones, locale],
    )

    const renderItem: NonNullable<Props['renderItem']> = useCallback(
      ({ item }) =>
        isGeocodingFeature(item) ? (
          <View className="border-b border-divider py-4">
            <FlexRow className="items-center g-4">
              <Icon name="location-pin" />
              <View className="flex-1">
                <Typography numberOfLines={1}>{item.text}</Typography>
                <Typography numberOfLines={1}>{item.place_name}</Typography>
              </View>
              <Icon name="chevron-right" />
            </FlexRow>
          </View>
        ) : (
          <View className="border-b border-divider py-4">
            <FlexRow className="items-center">
              <ZoneBadge label={item.udrId.toString()} />
              <Typography className="flex-1" numberOfLines={1}>
                {item.name}
              </Typography>
              <Icon name="chevron-right" />
            </FlexRow>
          </View>
        ),
      [],
    )

    const renderResults: NonNullable<Props['renderResults']> = useCallback(
      (options, optionsListProps) => {
        const [zones, geocodingFeatures] = options
        const shownOptions: (GeocodingFeature | NormalizedUdrZone)[] = [
          ...zones.slice(0, 3),
          ...geocodingFeatures,
        ]

        return (
          <Portal hostName={optionsPortalName}>
            <View className="flex-1">
              <Typography variant="h2">{t('searchResults')}</Typography>
              <BottomSheetFlatList className="flex-1" data={shownOptions} {...optionsListProps} />
            </View>
          </Portal>
        )
      },
      [optionsPortalName, t],
    )

    return (
      <View>
        <Autocomplete
          ref={ref}
          getOptions={getOptions}
          getOptionLabel={(option) =>
            isGeocodingFeature(option) ? option.place_name || option.text : option.name
          }
          onValueChange={handleValueChange}
          leftIcon={<Icon name="search" />}
          renderItem={renderItem}
          ListComponent={BottomSheetFlatList}
          renderResults={renderResults}
          multiSourceMode
          // disabledIndication={false}
          {...restProps}
        />
      </View>
    )
  },
)

export default MapAutocomplete
