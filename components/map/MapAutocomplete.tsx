import { Portal } from '@gorhom/portal'
import { Feature, MultiPolygon, Polygon } from 'geojson'
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
import { useLocation } from '@/modules/map/hooks/useLocation'
import { useMapAutocompleteGetOptions } from '@/modules/map/hooks/useMapAutocompleteGetOptions'
import {
  GeocodingFeature,
  isGeocodingFeature,
  MapUdrZone,
  UdrZoneFeature,
} from '@/modules/map/types'
import { findShapesInRadius } from '@/modules/map/utils/findShapesInRadius'
import { forwardGeocode } from '@/modules/map/utils/forwardGeocode'
import { normalizeZone } from '@/modules/map/utils/normalizeZone'
import { useMapZonesContext } from '@/state/MapZonesProvider/useMapZonesContext'
import { Unpromise } from '@/utils/types'

const ZONES_LIMIT = 10
const NEARBY_ZONE_RADIUS = 0.2 // km

type Props = Partial<
  AutocompleteProps<
    [Feature<Polygon | MultiPolygon, MapUdrZone>[], Unpromise<ReturnType<typeof forwardGeocode>>],
    GeocodingFeature | Feature<Polygon | MultiPolygon, MapUdrZone>
  >
>

const MapAutocomplete = forwardRef<RNTextInput, Props>(
  ({ onValueChange, optionsPortalName, ...restProps }: Props, ref) => {
    const t = useTranslation('ZoneDetailsScreen')
    const mapZones = useMapZonesContext()
    const [nearByZones, setNearbyZones] = useState<UdrZoneFeature[]>([])
    const [loadingNearyByZones, setLoadingNearyByZones] = useState(false)
    const [location] = useLocation()
    const locale = useLocale()
    const getOptions = useMapAutocompleteGetOptions()

    useEffect(() => {
      setLoadingNearyByZones(true)
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
          setLoadingNearyByZones(false)
        }
      })
    }, [mapZones, location])

    const handleValueChange = useCallback(
      (value: GeocodingFeature | Feature<Polygon | MultiPolygon, MapUdrZone>) => {
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
      ({ options, optionsListProps, isFetching, input }) => {
        const [zones, geocodingFeatures] = options
        const sections: {
          title: string
          data: (GeocodingFeature | UdrZoneFeature)[]
        }[] = []

        if (zones.length > 0) {
          sections.push({ title: t('zones'), data: zones.slice(0, ZONES_LIMIT) })
        }
        if (geocodingFeatures.length > 0) {
          sections.push({ title: t('addresses'), data: geocodingFeatures })
        }
        if (sections.length === 0 && nearByZones.length > 0) {
          sections.push({ title: t('nearByZones'), data: nearByZones })
        }

        return (
          <Portal hostName={optionsPortalName}>
            <View className="flex-1">
              {sections.length === 0 ? (
                isFetching || loadingNearyByZones ? (
                  <LoadingScreen />
                ) : input ? (
                  <EmptyStateScreen contentTitle={t('noResults')} />
                ) : null
              ) : (
                <>
                  <Typography variant="h2">{t('searchResults')}</Typography>
                  <SectionList
                    className="flex-1"
                    sections={sections}
                    keyboardShouldPersistTaps="always"
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
      [optionsPortalName, t, nearByZones, loadingNearyByZones],
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
