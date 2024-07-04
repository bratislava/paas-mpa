import { Portal } from '@gorhom/portal'
import { forwardRef, useCallback, useEffect, useState } from 'react'
import {
  FlatList,
  InteractionManager,
  SectionList,
  TextInput as RNTextInput,
  View,
} from 'react-native'

import ZoneBadge from '@/components/info/ZoneBadge'
import Autocomplete, { AutocompleteProps } from '@/components/inputs/Autocomplete'
import EmptyStateScreen from '@/components/screen-layout/EmptyStateScreen'
import LoadingScreen from '@/components/screen-layout/LoadingScreen'
import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import Typography from '@/components/shared/Typography'
import { useLocale, useTranslation } from '@/hooks/useTranslation'
import { GeocodingFeature } from '@/modules/arcgis/types'
import { useLocation } from '@/modules/map/hooks/useLocation'
import { useMapAutocompleteGetOptions } from '@/modules/map/hooks/useMapAutocompleteGetOptions'
import { isGeocodingFeature, UdrZoneFeature } from '@/modules/map/types'
import { findShapesInRadius } from '@/modules/map/utils/findShapesInRadius'
import { forwardGeocode } from '@/modules/map/utils/forwardGeocode'
import { translateMapObject } from '@/modules/map/utils/translateMapObject'
import { useMapZonesContext } from '@/state/MapZonesProvider/useMapZonesContext'
import { Unpromise } from '@/utils/types'

const ZONES_LIMIT = 10
const NEARBY_ZONE_RADIUS = 0.2 // km

type Props = Partial<
  AutocompleteProps<
    [UdrZoneFeature[], Unpromise<ReturnType<typeof forwardGeocode>>],
    GeocodingFeature | UdrZoneFeature
  >
>

const MapAutocomplete = forwardRef<RNTextInput, Props>(
  ({ onValueChange, optionsPortalName, ...restProps }: Props, ref) => {
    const { t } = useTranslation()
    const mapZones = useMapZonesContext()
    const [nearByZones, setNearbyZones] = useState<UdrZoneFeature[]>([])
    const [loadingNearbyZones, setLoadingNearbyZones] = useState(false)
    const [location] = useLocation()
    const locale = useLocale()
    const getOptions = useMapAutocompleteGetOptions()

    useEffect(() => {
      setLoadingNearbyZones(true)
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      InteractionManager.runAfterInteractions(() => {
        if (mapZones && location) {
          setNearbyZones(
            findShapesInRadius(
              [...mapZones.values()],
              [location.coords.longitude, location.coords.latitude],
              NEARBY_ZONE_RADIUS,
            ),
          )
          setLoadingNearbyZones(false)
        }
      })
    }, [mapZones, location])

    const handleValueChange = useCallback(
      (value: GeocodingFeature | UdrZoneFeature) => {
        onValueChange?.(value)
      },
      [onValueChange],
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
                  <Typography numberOfLines={1}>
                    {/* item.address, item.properties.address is not set for all entries */}
                    {item.place_name?.replace(`${item.text}, `, '')}
                  </Typography>
                </View>
                <Icon name="chevron-right" />
              </FlexRow>
            </View>
          )
        }

        const zone = translateMapObject(item.properties, locale)

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
      ({ options, optionsListProps, isFetching, input }) => {
        const [zones, geocodingFeatures] = options
        const sections: {
          title: string
          data: (GeocodingFeature | UdrZoneFeature)[]
        }[] = []

        if (zones.length > 0) {
          sections.push({ title: t('ZoneDetailsScreen.zones'), data: zones.slice(0, ZONES_LIMIT) })
        }
        if (geocodingFeatures.length > 0) {
          sections.push({ title: t('ZoneDetailsScreen.addresses'), data: geocodingFeatures })
        }
        if (sections.length === 0 && nearByZones.length > 0) {
          sections.push({ title: t('ZoneDetailsScreen.nearByZones'), data: nearByZones })
        }

        return (
          <Portal hostName={optionsPortalName}>
            <View className="flex-1">
              {sections.length === 0 ? (
                isFetching || loadingNearbyZones ? (
                  <LoadingScreen />
                ) : input ? (
                  <EmptyStateScreen
                    options={{ headerShown: false }}
                    contentTitle={t('ZoneDetailsScreen.noResults')}
                  />
                ) : null
              ) : (
                <>
                  <Typography variant="h2">{t('ZoneDetailsScreen.searchResults')}</Typography>
                  <SectionList
                    className="flex-1"
                    sections={sections}
                    keyboardShouldPersistTaps="always"
                    stickySectionHeadersEnabled={false}
                    renderItem={optionsListProps.renderItem!}
                    renderSectionHeader={({ section: { title } }) => (
                      <Typography
                        variant="h3"
                        className="border-b-2 border-divider bg-white pb-2 pt-4"
                      >
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
      [optionsPortalName, t, nearByZones, loadingNearbyZones],
    )

    return (
      <View>
        <Autocomplete
          ref={ref}
          getOptions={getOptions}
          getOptionLabel={(option) =>
            isGeocodingFeature(option) ? option.place_name || option.text : option.properties.name
          }
          onValueChange={handleValueChange}
          leftIcon={<Icon name="search" />}
          renderItem={renderItem}
          ListComponent={FlatList}
          renderResults={renderResults}
          multiSourceMode
          autoFocus
          {...restProps}
        />
      </View>
    )
  },
)

export default MapAutocomplete
