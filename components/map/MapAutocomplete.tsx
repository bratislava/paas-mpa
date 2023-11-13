import { BottomSheetFlatList, BottomSheetSectionList } from '@gorhom/bottom-sheet'
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
import { useMapAutocompleteGetOptions } from '@/modules/map/hooks/useMapAutocompleteGetOptions'
import { GeocodingFeature, isGeocodingFeature, MapUdrZone } from '@/modules/map/types'
import { forwardGeocode } from '@/modules/map/utils/forwardGeocode'
import { normalizeZone } from '@/modules/map/utils/normalizeZone'
import { Unpromise } from '@/utils/types'

const ZONES_LIMIT = 10

type Props = Partial<
  AutocompleteProps<
    [Feature<Polygon, MapUdrZone>[], Unpromise<ReturnType<typeof forwardGeocode>>],
    GeocodingFeature | Feature<Polygon, MapUdrZone>
  >
>

const MapAutocomplete = forwardRef<RNTextInput, Props>(
  ({ onValueChange, optionsPortalName, ...restProps }: Props, ref) => {
    const t = useTranslation('ZoneDetailsScreen')
    const handleValueChange = useCallback(
      (value: GeocodingFeature | Feature<Polygon, MapUdrZone>) => {
        onValueChange?.(value)
      },
      [onValueChange],
    )

    const locale = useLocale()

    const getOptions = useMapAutocompleteGetOptions()

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
              <ZoneBadge label={zone.udrId} />
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
        const sections: {
          title: string
          data: (GeocodingFeature | Feature<Polygon, MapUdrZone>)[]
        }[] = []

        if (zones.length > 0) {
          sections.push({ title: t('zones'), data: zones.slice(0, ZONES_LIMIT) })
        }
        if (geocodingFeatures.length > 0) {
          sections.push({ title: t('addresses'), data: geocodingFeatures })
        }

        return (
          <Portal hostName={optionsPortalName}>
            <View className="flex-1">
              {(zones.length > 0 || geocodingFeatures.length > 0) && (
                <>
                  <Typography variant="h2">{t('searchResults')}</Typography>
                  <BottomSheetSectionList
                    className="flex-1"
                    sections={sections}
                    keyboardShouldPersistTaps="always"
                    renderItem={optionsListProps.renderItem!}
                    renderSectionHeader={({ section: { title } }) => (
                      <Typography variant="h3" className="border-b-2 border-divider pb-2 pt-6">
                        {title}
                      </Typography>
                    )}
                  />
                </>
              )}
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
          {...restProps}
        />
      </View>
    )
  },
)

export default MapAutocomplete
