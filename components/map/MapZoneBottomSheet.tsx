import BottomSheet, { TouchableWithoutFeedback } from '@gorhom/bottom-sheet'
import { Link } from 'expo-router'
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Keyboard, LayoutAnimation, View } from 'react-native'

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
import { getMultipleRefsSetter } from '@/utils/getMultipleRefsSetter'

type Props = {
  zone: MapUdrZone | null
  setFlyToCenter?: MapRef['setFlyToCenter']
}

const MapZoneBottomSheet = forwardRef<BottomSheet, Props>(({ zone, setFlyToCenter }, ref) => {
  const t = useTranslation()
  const localRef = useRef<BottomSheet>(null)

  const isZoneSelected = Boolean(zone)
  const [snapPoints, setSnapPoints] = useState<(number | string)[]>([220])
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [index, setIndex] = useState(0)

  const refSetter = useMemo(() => getMultipleRefsSetter(ref, localRef), [ref])

  const handleChange = useCallback((newIndex: number) => {
    const animation = LayoutAnimation.create(200, 'easeInEaseOut', 'opacity')
    LayoutAnimation.configureNext(animation)
    setIndex(newIndex)
  }, [])

  const handleInputFocus = useCallback(() => {
    setIsInputFocused(true)
    localRef.current?.expand()
  }, [])

  const handleInputBlur = useCallback(() => {
    setIsInputFocused(false)
  }, [])

  useEffect(() => {
    const newSnapPoints: (string | number)[] = [220]
    if (isZoneSelected) newSnapPoints.push(320)
    newSnapPoints.push('100%')
    setSnapPoints(newSnapPoints)
  }, [isZoneSelected, isInputFocused])

  const isFullHeightIndex = snapPoints.length === 3 ? index === 2 : index === 1

  return (
    <BottomSheet
      ref={refSetter}
      snapPoints={snapPoints}
      keyboardBehavior="interactive"
      onChange={handleChange}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BottomSheetContent cn="bg-white">
          <View className="bg-white g-3">
            <View className="g-2">
              <Field label={t('MapScreen.ZoneBottomSheet.title')}>
                <MapAutocomplete
                  setFlyToCenter={setFlyToCenter}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </Field>
              {!isFullHeightIndex && zone ? (
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
            {!isFullHeightIndex && (
              // eslint-disable-next-line react/jsx-no-useless-fragment
              <>
                {zone ? (
                  <Button variant="primary">{t('Navigation.continue')}</Button>
                ) : (
                  <Panel className="bg-warning-light g-2">
                    <Typography>{t('MapScreen.ZoneBottomSheet.noZoneSelected')}</Typography>
                  </Panel>
                )}
              </>
            )}
          </View>
        </BottomSheetContent>
      </TouchableWithoutFeedback>
    </BottomSheet>
  )
})

export default MapZoneBottomSheet
