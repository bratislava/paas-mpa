import BottomSheet from '@gorhom/bottom-sheet'
import { PortalHost } from '@gorhom/portal'
import clsx from 'clsx'
import { Link } from 'expo-router'
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Keyboard, LayoutAnimation, Pressable, TextInput, View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ZoneDetailsParamas } from '@/app/zone-details'
import SegmentBadge from '@/components/info/SegmentBadge'
import { MapRef } from '@/components/map/Map'
import MapAutocomplete from '@/components/map/MapAutocomplete'
import MapZoneBottomSheetAttachment from '@/components/map/MapZoneBottomSheetAttachment'
import BottomSheetContent from '@/components/shared/BottomSheetContent'
import Button from '@/components/shared/Button'
import Divider from '@/components/shared/Divider'
import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import Panel from '@/components/shared/Panel'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useMultipleRefsSetter } from '@/hooks/useMultipleRefsSetter'
import { useTranslation } from '@/hooks/useTranslation'
import { GeocodingFeature, NormalizedUdrZone } from '@/modules/map/types'
import { formatPricePerHour } from '@/utils/formatPricePerHour'

const SNAP_POINTS = {
  noZone: 220,
  zone: 320,
  searchExpanded: '100%',
}

type Props = {
  zone: NormalizedUdrZone | null
  setFlyToCenter?: MapRef['setFlyToCenter']
}

const checkIfFullyExtended = (index: number, snapPoints: (number | string)[]) =>
  snapPoints.at(-1) === '100%' && (snapPoints.length === 3 ? index === 2 : index === 1)

const MapZoneBottomSheet = forwardRef<BottomSheet, Props>((props, ref) => {
  const { zone: selectedZone, setFlyToCenter } = props

  const t = useTranslation()
  const localRef = useRef<BottomSheet>(null)
  const { top } = useSafeAreaInsets()
  const refSetter = useMultipleRefsSetter(ref, localRef)
  const isZoneSelected = Boolean(selectedZone)
  const [isFullHeightEnabled, setIsFullHeightEnabled] = useState(false)
  const inputRef = useRef<TextInput>(null)

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
    localRef.current?.collapse()
  }, [selectedZone])

  const handleChange = useCallback(
    (newIndex: number) => {
      const animation = LayoutAnimation.create(200, 'easeInEaseOut', 'opacity')
      LayoutAnimation.configureNext(animation)
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

  const animatedPosition = useSharedValue(0)

  return (
    <>
      {!isFullHeightEnabled && (
        <MapZoneBottomSheetAttachment {...{ animatedPosition, setFlyToCenter }} />
      )}
      <BottomSheet
        ref={refSetter}
        snapPoints={snapPoints}
        topInset={top}
        keyboardBehavior="interactive"
        onChange={handleChange}
        // eslint-disable-next-line react-native/no-inline-styles
        handleIndicatorStyle={isFullHeightEnabled && { opacity: 0 }}
        animatedPosition={animatedPosition}
      >
        <BottomSheetContent cn={clsx('h-full bg-white', selectedZone ? 'g-2' : 'g-3')}>
          <View className={clsx(isFullHeightEnabled && 'flex-1')}>
            <View>
              <FlexRow>
                <View className="flex-1">
                  <Pressable onPress={handleInputFocus}>
                    <View pointerEvents={isFullHeightEnabled ? 'auto' : 'none'}>
                      {!isFullHeightEnabled && (
                        <Typography variant="default-bold" className="pb-1">
                          {t('ZoneBottomSheet.title')}
                        </Typography>
                      )}
                      <MapAutocomplete
                        ref={inputRef}
                        optionsPortalName="mapAutocompleteOptions"
                        onValueChange={handleChoice}
                      />
                    </View>
                  </Pressable>
                </View>
                {isFullHeightEnabled && (
                  <Button variant="plain-dark" onPress={handleCancel}>
                    {t('Common.cancel')}
                  </Button>
                )}
              </FlexRow>
            </View>
            <View className="flex-1">
              {isFullHeightEnabled && (
                <Pressable onTouchStart={handleInputBlur}>
                  <View className="h-full">
                    <View className="flex-1 pt-5">
                      <PortalHost name="mapAutocompleteOptions" />
                    </View>
                  </View>
                </Pressable>
              )}
            </View>
          </View>
          {!isFullHeightEnabled &&
            (selectedZone ? (
              <>
                <Panel className="g-4">
                  <FlexRow>
                    <Typography>{selectedZone.name}</Typography>
                    <SegmentBadge label={selectedZone.udrId.toString()} />
                  </FlexRow>
                  <Divider />
                  <FlexRow>
                    <Typography variant="default-bold">
                      {formatPricePerHour(selectedZone.price)}
                    </Typography>
                    <Link
                      asChild
                      href={{
                        pathname: '/zone-details',
                        params: {
                          udrId: selectedZone.udrId.toString(),
                        } satisfies ZoneDetailsParamas,
                      }}
                    >
                      <PressableStyled>
                        <View className="flex-row">
                          <Typography variant="default-bold">
                            {t('ZoneBottomSheet.showDetails')}
                          </Typography>
                          <Icon name="expand-more" />
                        </View>
                      </PressableStyled>
                    </Link>
                  </FlexRow>
                </Panel>

                <Link
                  asChild
                  href={{
                    pathname: '/purchase',
                    params: { udrId: selectedZone.udrId.toString() },
                  }}
                >
                  <Button variant="primary">{t('Navigation.continue')}</Button>
                </Link>
              </>
            ) : (
              <Panel className="bg-warning-light g-2">
                <Typography>{t('ZoneBottomSheet.noZoneSelected')}</Typography>
              </Panel>
            ))}
        </BottomSheetContent>
      </BottomSheet>
    </>
  )
})

export default MapZoneBottomSheet
