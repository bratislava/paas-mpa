import BottomSheet, { TouchableWithoutFeedback } from '@gorhom/bottom-sheet'
import { Link } from 'expo-router'
import { forwardRef, useMemo } from 'react'
import { Keyboard, View } from 'react-native'

import SegmentBadge from '@/components/info/SegmentBadge'
import { MapRef } from '@/components/map/Map'
import MapAutocomplete from '@/components/map/MapAutocomplete'
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
import { MapUdrZone } from '@/modules/map/types'

type Props = {
  zone: MapUdrZone | null
  setFlyToCenter?: MapRef['setFlyToCenter']
}

const MapZoneBottomSheet = forwardRef<BottomSheet, Props>(({ zone, setFlyToCenter }, ref) => {
  const t = useTranslation()

  const isZoneSelected = Boolean(zone)
  const snapPoints = useMemo(() => (isZoneSelected ? [220, 320] : [220]), [isZoneSelected])

  return (
    <BottomSheet ref={ref} snapPoints={snapPoints}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BottomSheetContent cn="bg-white">
          <View className="bg-white g-3">
            <View className="g-2">
              <Field label={t('MapScreen.ZoneBottomSheet.title')}>
                <MapAutocomplete setFlyToCenter={setFlyToCenter} />
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
      </TouchableWithoutFeedback>
    </BottomSheet>
  )
})

export default MapZoneBottomSheet
