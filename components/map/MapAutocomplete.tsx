import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { Portal } from '@gorhom/portal'
import { Feature, Polygon } from 'geojson'
import { forwardRef, useCallback } from 'react'
import { TextInput as RNTextInput, View } from 'react-native'

import ZoneBadge from '@/components/info/ZoneBadge'
import Autocomplete, { AutocompleteProps } from '@/components/inputs/Autocomplete'
import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import Typography from '@/components/shared/Typography'
import { useLocale, useTranslation } from '@/hooks/useTranslation'
import { GeocodingFeature, isGeocodingFeature, MapUdrZone } from '@/modules/map/types'
import { forwardGeocode } from '@/modules/map/utils/forwardGeocode'
import { normalizeZone } from '@/modules/map/utils/normalizeZone'
import { useMapZonesContext } from '@/state/MapZonesProvider/useMapZonesContext'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Unpromise<T extends Promise<any>> = T extends Promise<infer U> ? U : never

type Props = Partial<
  AutocompleteProps<
    [Feature<Polygon, MapUdrZone>[], Unpromise<ReturnType<typeof forwardGeocode>>],
    GeocodingFeature | Feature<Polygon, MapUdrZone>
  >
>

const normalizeString = (str: string) =>
  str
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036F]/g, '')
    .toLowerCase()

const MapAutocomplete = forwardRef<RNTextInput, Props>(
  ({ onValueChange, optionsPortalName, ...restProps }: Props, ref) => {
    const t = useTranslation('ZoneDetailsScreen')
    const handleValueChange = useCallback(
      (value: GeocodingFeature | Feature<Polygon, MapUdrZone>) => {
        onValueChange?.(value)
      },
      [onValueChange],
    )

    const { mapZones } = useMapZonesContext()
    const locale = useLocale()

    const getOptions = useCallback(
      async (
        input: string,
      ): Promise<
        [Feature<Polygon, MapUdrZone>[], Unpromise<ReturnType<typeof forwardGeocode>>]
      > => {
        const filteredMapZones: Feature<Polygon, MapUdrZone>[] = []
        if (mapZones && input) {
          const normalizedInput = normalizeString(input)
          mapZones.forEach((zone) => {
            if (
              normalizeString(zone.properties.Nazov).includes(normalizedInput) ||
              normalizeString(zone.properties.UDR_ID.toString()).includes(normalizedInput)
            ) {
              filteredMapZones.push(zone)
            }
          })
        }

        return [filteredMapZones, await forwardGeocode(input)]
      },
      [mapZones],
    )

    const renderItem: NonNullable<Props['renderItem']> = useCallback(
      ({ item }) => {
        if (isGeocodingFeature(item)) {
          return (
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
          )
        }

        const zone = normalizeZone(item.properties, locale)

        return (
          <View className="border-b border-divider py-4">
            <FlexRow className="items-center">
              <ZoneBadge label={zone.udrId.toString()} />
              <Typography className="flex-1" numberOfLines={1}>
                {zone.name}
              </Typography>
              <Icon name="chevron-right" />
            </FlexRow>
          </View>
        )
      },
      [locale],
    )

    const renderResults: NonNullable<Props['renderResults']> = useCallback(
      (options, optionsListProps) => {
        const [zones, geocodingFeatures] = options
        const shownOptions: (GeocodingFeature | Feature<Polygon, MapUdrZone>)[] = [
          ...zones.slice(0, 3),
          ...geocodingFeatures,
        ]

        return (
          <Portal hostName={optionsPortalName}>
            <View className="flex-1">
              {shownOptions.length > 0 && (
                <Typography variant="h2">{t('searchResults')}</Typography>
              )}
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
            isGeocodingFeature(option) ? option.place_name || option.text : option.properties.Nazov
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
