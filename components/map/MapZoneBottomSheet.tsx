import BottomSheet, { TouchableWithoutFeedback } from '@gorhom/bottom-sheet'
import { PortalHost } from '@gorhom/portal'
import { Link } from 'expo-router'
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { LayoutAnimation, TextInput, View } from 'react-native'

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

const SNAP_POINTS = {
  noZone: 220,
  zone: 320,
  searchExpanded: '100%',
}

type Props = {
  zone: MapUdrZone | null
  setFlyToCenter?: MapRef['setFlyToCenter']
  setBlockZoneMapUpdate?: (isBlocked: boolean) => void
}

const checkIfFullyExtended = (index: number, snapPoints: (number | string)[]) =>
  snapPoints.at(-1) === '100%' && (snapPoints.length === 3 ? index === 2 : index === 1)

const MapZoneBottomSheet = forwardRef<BottomSheet, Props>((props, ref) => {
  const { zone, setFlyToCenter, setBlockZoneMapUpdate } = props

  const t = useTranslation()
  const localRef = useRef<BottomSheet>(null)

  const isZoneSelected = Boolean(zone)
  const [isFullHeightEnabled, setIsFullHeightEnabled] = useState(false)
  const [index, setIndex] = useState(0)
  const inputRef = useRef<TextInput>(null)

  const refSetter = useMemo(() => getMultipleRefsSetter(ref, localRef), [ref])

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

  const isFullHeightIndex = checkIfFullyExtended(index, snapPoints)

  const handleInputBlur = useCallback(() => {
    inputRef.current?.blur()
    setTimeout(() => setBlockZoneMapUpdate?.(false), 100)
  }, [setBlockZoneMapUpdate])

  const handleChange = useCallback(
    (newIndex: number) => {
      const animation = LayoutAnimation.create(200, 'easeInEaseOut', 'opacity')
      LayoutAnimation.configureNext(animation)
      setIndex(newIndex)
      if (!checkIfFullyExtended(newIndex, snapPoints)) {
        handleInputBlur()
        setIsFullHeightEnabled(false)
      }
    },
    [snapPoints, handleInputBlur],
  )

  const handleInputFocus = useCallback(() => {
    console.log('focus')
    setBlockZoneMapUpdate?.(true)
    setIsFullHeightEnabled(true)
    inputRef.current?.focus()
  }, [setBlockZoneMapUpdate])

  const handleCancel = useCallback(() => {
    handleInputBlur()
    localRef.current?.collapse()
  }, [handleInputBlur])

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (snapPoints.at(-1) === SNAP_POINTS.searchExpanded) {
      // not the cleanest approach but I have found no other alternative, executing expand() on even the next render does not do anything
      timeout = setTimeout(() => localRef.current?.expand(), 1)
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [snapPoints])

  console.log({ snapPoints, index })

  return (
    <BottomSheet
      ref={refSetter}
      snapPoints={snapPoints}
      keyboardBehavior="interactive"
      onChange={handleChange}
      // eslint-disable-next-line react-native/no-inline-styles
      handleIndicatorStyle={isFullHeightIndex && { opacity: 0 }}
    >
      <TouchableWithoutFeedback onPressIn={handleInputBlur}>
        <BottomSheetContent cn="bg-white h-full g-3">
          <View className="flex-1 g-2">
            <View>
              <FlexRow>
                <View className="flex-1">
                  <TouchableWithoutFeedback onPress={handleInputFocus}>
                    <View pointerEvents={isFullHeightIndex ? 'auto' : 'none'}>
                      {!isFullHeightIndex && (
                        <Field label={t('MapScreen.ZoneBottomSheet.title')}>{null}</Field>
                      )}
                      <MapAutocomplete
                        key="mapAutocomplete"
                        ref={inputRef}
                        setFlyToCenter={setFlyToCenter}
                        optionsPortalName="mapAutocompleteOptions"
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
                {isFullHeightIndex && (
                  <Button variant="plain-dark" onPress={handleCancel}>
                    {t('Common.cancel')}
                  </Button>
                )}
              </FlexRow>
            </View>
            {isFullHeightIndex && (
              <View className="flex-1 pt-3">
                <PortalHost name="mapAutocompleteOptions" />
              </View>
            )}
            {!isFullHeightIndex &&
              (zone ? (
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
              ) : (
                <Panel className="bg-warning-light g-2">
                  <Typography>{t('MapScreen.ZoneBottomSheet.noZoneSelected')}</Typography>
                </Panel>
              ))}
          </View>
          {!isFullHeightIndex && (
            // eslint-disable-next-line react/jsx-no-useless-fragment
            <>{zone ? <Button variant="primary">{t('Navigation.continue')}</Button> : null}</>
          )}
        </BottomSheetContent>
      </TouchableWithoutFeedback>
    </BottomSheet>
  )
})

export default MapZoneBottomSheet
