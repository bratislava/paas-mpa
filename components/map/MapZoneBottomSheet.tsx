import BottomSheet, { TouchableWithoutFeedback } from '@gorhom/bottom-sheet'
import { PortalHost } from '@gorhom/portal'
import { Link } from 'expo-router'
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Keyboard, TextInput, View } from 'react-native'

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
import { useMultipleRefsSetter } from '@/hooks/useMultipleRefsSetter'
import { useTranslation } from '@/hooks/useTranslation'
import { GeocodingFeature, MapUdrZone } from '@/modules/map/types'

const SNAP_POINTS = {
  noZone: 220,
  zone: 320,
  searchExpanded: '100%',
}

type Props = {
  zone: MapUdrZone | null
  setFlyToCenter?: MapRef['setFlyToCenter']
}

const checkIfFullyExtended = (index: number, snapPoints: (number | string)[]) =>
  snapPoints.at(-1) === '100%' && (snapPoints.length === 3 ? index === 2 : index === 1)

const MapZoneBottomSheet = forwardRef<BottomSheet, Props>((props, ref) => {
  const { zone, setFlyToCenter } = props

  const t = useTranslation()
  const localRef = useRef<BottomSheet>(null)
  const refSetter = useMultipleRefsSetter(ref, localRef)

  const [selectedZone, setSelectedZone] = useState<MapUdrZone | null>(zone)
  const isZoneSelected = Boolean(selectedZone)
  const [isFullHeightEnabled, setIsFullHeightEnabled] = useState(false)
  const inputRef = useRef<TextInput>(null)
  const [nextZoneUpdate, setNextZoneUpdate] = useState<MapUdrZone | null | undefined>()

  const snapPoints = useMemo(() => {
    const newSnapPoints: (string | number)[] = [SNAP_POINTS.noZone]
    if (isZoneSelected) {
      newSnapPoints.push(SNAP_POINTS.zone)
    }
    if (isFullHeightEnabled) {
      newSnapPoints.push(SNAP_POINTS.searchExpanded)
    }

    return newSnapPoints
  }, [isZoneSelected, isFullHeightEnabled])

  useEffect(() => {
    if (snapPoints.at(-1) === SNAP_POINTS.searchExpanded) {
      localRef.current?.snapToPosition(SNAP_POINTS.searchExpanded)
    }
  }, [snapPoints])

  const handleInputBlur = useCallback(() => {
    if (inputRef.current?.isFocused()) {
      inputRef.current?.blur()
    } else {
      Keyboard.dismiss()
    }
  }, [])

  useEffect(() => {
    setNextZoneUpdate(zone)
  }, [zone])

  useEffect(() => {
    if (!isFullHeightEnabled && nextZoneUpdate !== undefined) {
      setSelectedZone(nextZoneUpdate)
      // eslint-disable-next-line unicorn/no-useless-undefined
      setNextZoneUpdate(undefined)
    }
  }, [isFullHeightEnabled, nextZoneUpdate])

  const handleChange = useCallback(
    (newIndex: number) => {
      // const animation = LayoutAnimation.create(200, 'easeInEaseOut', 'opacity')
      // LayoutAnimation.configureNext(animation)
      if (checkIfFullyExtended(newIndex, snapPoints)) {
        inputRef.current?.focus()
      } else {
        handleInputBlur()
        setIsFullHeightEnabled(false)
      }
    },
    [snapPoints, handleInputBlur],
  )

  const handleInputFocus = useCallback(() => {
    setIsFullHeightEnabled(true)
  }, [])

  const handleCancel = useCallback(() => {
    handleInputBlur()
    localRef.current?.collapse()
  }, [handleInputBlur])

  const handleChoice = useCallback(
    (newValue: GeocodingFeature) => {
      handleInputBlur()
      localRef.current?.collapse()
      setFlyToCenter?.(newValue.center)
    },
    [handleInputBlur, setFlyToCenter],
  )

  return (
    <BottomSheet
      ref={refSetter}
      snapPoints={snapPoints}
      keyboardBehavior="interactive"
      onChange={handleChange}
      // eslint-disable-next-line react-native/no-inline-styles
      handleIndicatorStyle={isFullHeightEnabled && { opacity: 0 }}
    >
      <BottomSheetContent cn="bg-white h-full g-3">
        <View className="flex-1 g-2">
          <View>
            <FlexRow>
              <View className="flex-1">
                <TouchableWithoutFeedback onPress={handleInputFocus}>
                  <View pointerEvents={isFullHeightEnabled ? 'auto' : 'none'}>
                    {!isFullHeightEnabled && (
                      <Field label={t('MapScreen.ZoneBottomSheet.title')}>{null}</Field>
                    )}
                    <MapAutocomplete
                      ref={inputRef}
                      optionsPortalName="mapAutocompleteOptions"
                      onValueChange={handleChoice}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
              {isFullHeightEnabled && (
                <Button variant="plain-dark" onPress={handleCancel}>
                  {t('Common.cancel')}
                </Button>
              )}
            </FlexRow>
          </View>
          <View className="flex-1">
            <TouchableWithoutFeedback onPressIn={handleInputBlur}>
              <View className="h-full">
                {isFullHeightEnabled && (
                  <View className="flex-1 pt-3">
                    <PortalHost name="mapAutocompleteOptions" />
                  </View>
                )}
                {!isFullHeightEnabled &&
                  (selectedZone ? (
                    <Panel className="g-4">
                      <FlexRow>
                        <Typography>{selectedZone.Nazov}</Typography>
                        <SegmentBadge label={selectedZone.UDR_ID.toString()} />
                      </FlexRow>
                      <Divider />
                      <FlexRow>
                        <Typography variant="default-bold">
                          {selectedZone.Zakladna_cena}€ / h
                        </Typography>
                        <Link
                          asChild
                          href={{
                            pathname: '/zone-details',
                            params: { id: selectedZone.OBJECTID.toString() },
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
                  ) : (
                    <Panel className="bg-warning-light g-2">
                      <Typography>{t('MapScreen.ZoneBottomSheet.noZoneSelected')}</Typography>
                    </Panel>
                  ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
        {!isFullHeightEnabled && selectedZone ? (
          <Button variant="primary">{t('Navigation.continue')}</Button>
        ) : null}
      </BottomSheetContent>
    </BottomSheet>
  )
})

export default MapZoneBottomSheet
