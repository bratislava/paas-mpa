import BottomSheet from '@gorhom/bottom-sheet'
import { Link } from 'expo-router'
import { forwardRef, useCallback, useMemo } from 'react'
import { View } from 'react-native'

import SegmentBadge from '@/components/info/SegmentBadge'
import Autocomplete from '@/components/inputs/Autocomplete'
import { MapRef } from '@/components/map/Map'
import BottomSheetContent from '@/components/shared/BottomSheetContent'
import Button from '@/components/shared/Button'
import Divider from '@/components/shared/Divider'
import Field from '@/components/shared/Field'
import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import Panel from '@/components/shared/Panel'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { GeocodingFeature, MapUdrZone } from '@/modules/map/types'
import { forwardGeocode } from '@/modules/map/utils/forwardGeocode'

type Props = {
  zone: MapUdrZone | null
  setFlyToCenter?: MapRef['setFlyToCenter']
}

const MapZoneBottomSheet = forwardRef<BottomSheet, Props>(({ zone, setFlyToCenter }, ref) => {
  const t = useTranslation()

  const snapPoints = useMemo(() => [220, 320], [])

  const handleValueChange = useCallback(
    (value: GeocodingFeature) => {
      setFlyToCenter?.(value.center)
    },
    [setFlyToCenter],
  )

  return (
    <BottomSheet ref={ref} snapPoints={snapPoints}>
      <BottomSheetContent cn="bg-white">
        <View className="bg-white g-3">
          <View className="g-2">
            <Field label={t('MapScreen.ZoneBottomSheet.title')}>
              <Autocomplete
                getOptions={forwardGeocode}
                getOptionLabel={(option) => option.text}
                onValueChange={handleValueChange}
              />
            </Field>
            {zone ? (
              <Panel className="g-4">
                <FlexRow>
                  <Typography>{zone.Nazov}</Typography>
                  <SegmentBadge label={zone.UDR_ID.toString()} />
                </FlexRow>
                <Divider />
                <FlexRow>
                  <Typography variant="default-bold">{zone.Zakladna_cena}€ / h</Typography>
                  <Link
                    asChild
                    href={{
                      pathname: '/zone-details',
                      params: { id: zone.OBJECTID.toString() },
                    }}
                  >
                    <PressableStyled>
                      <View className="flex-row">
                        <Typography variant="default-bold">
                          {t('MapScreen.ZoneBottomSheet.showDetails')}
                        </Typography>
                        <Icon name="expand-more" />
                      </View>
                    </PressableStyled>
                  </Link>
                </FlexRow>
              </Panel>
            ) : null}
          </View>
          {zone ? (
            <Button variant="primary">{t('Navigation.continue')}</Button>
          ) : (
            <Panel className="bg-warning-light g-2">
              <Typography>{t('MapScreen.ZoneBottomSheet.noZoneSelected')}</Typography>
            </Panel>
          )}
        </View>
      </BottomSheetContent>
    </BottomSheet>
  )
})

export default MapZoneBottomSheet
