import BottomSheet, { BottomSheetFooterProps, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { forwardRef, Ref, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { LayoutAnimation, View } from 'react-native'

import NavigateBottomSheetFooter from '@/components/map/NavigateBottomSheetFooter'
import BottomSheetHandleWithShadow from '@/components/screen-layout/BottomSheet/BottomSheetHandleWithShadow'
import Divider from '@/components/shared/Divider'
import Field from '@/components/shared/Field'
import Icon from '@/components/shared/Icon'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useLocale, useTranslation } from '@/hooks/useTranslation'
import { MapPointKindEnum } from '@/modules/map/constants'
import { MapPoint, MapPointWithTranslationProps } from '@/modules/map/types'
import { translateMapObject } from '@/modules/map/utils/translateMapObject'

type Props = {
  point: MapPointWithTranslationProps
}

const ATTRIBUTES_MAP: Record<MapPointKindEnum, (keyof MapPoint)[]> = {
  [MapPointKindEnum.parkomat]: ['location', 'parkomatId'],
  [MapPointKindEnum.partner]: ['name', 'address', 'openingHours'],
  [MapPointKindEnum.garage]: ['name', 'address', 'openingHours'],
  [MapPointKindEnum.pPlusR]: [
    'name',
    'parkingSpotCount',
    'publicTransportLines',
    'distanceToPublicTransport',
    'publicTransportTravelTime',
  ],
  [MapPointKindEnum.parkingLot]: [
    'name',
    'parkingSpotCount',
    'publicTransportLines',
    'distanceToPublicTransport',
    'publicTransportTravelTime',
  ],
  [MapPointKindEnum.branch]: ['name', 'address', 'place', 'openingHours', 'addressDetail'],
}

const MapPointBottomSheet = forwardRef<BottomSheet, Props>(({ point }, ref) => {
  const t = useTranslation('PointBottomSheet')
  const locale = useLocale()
  const [footerHeight, setFooterHeight] = useState(0)

  const snapPoints = useMemo(() => [375, '80%'], [])
  const translatedPoint = useMemo(() => translateMapObject(point, locale), [point, locale])

  const localRef = useRef<BottomSheet>()

  const setRefs: Ref<BottomSheet> = useCallback(
    (passedRef: BottomSheet) => {
      if (ref) {
        if (ref instanceof Function) ref(passedRef)
        // eslint-disable-next-line no-param-reassign
        else ref.current = passedRef
      }
      localRef.current = passedRef
    },
    [ref],
  )

  const handleChange = useCallback(() => {
    const animation = LayoutAnimation.create(200, 'easeInEaseOut', 'opacity')
    LayoutAnimation.configureNext(animation)
  }, [])

  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => {
      if (!point.navigation) return null

      return (
        <NavigateBottomSheetFooter
          onLayout={(event) => setFooterHeight(event.nativeEvent.layout.height)}
          navigationUrl={point.navigation}
          {...props}
        />
      )
    },
    [point.navigation],
  )

  const handleClose = useCallback(() => {
    localRef.current?.close()
  }, [])

  useEffect(() => {
    localRef.current?.collapse()
  }, [translatedPoint])

  const attributes = ATTRIBUTES_MAP[translatedPoint.kind]

  return (
    <BottomSheet
      enablePanDownToClose
      onChange={handleChange}
      ref={setRefs}
      snapPoints={snapPoints}
      footerComponent={renderFooter}
      handleComponent={BottomSheetHandleWithShadow}
    >
      <View className="flex-1">
        <View className="flex-row justify-center border-b border-b-divider pb-3">
          <View className="absolute bottom-4 left-0 ml-[10px]">
            <PressableStyled onPress={handleClose}>
              <Icon name="close" />
            </PressableStyled>
          </View>
          <Typography variant="h1">{t(`kinds.${translatedPoint.kind}`)}</Typography>
        </View>
        <BottomSheetScrollView
          className="bg-white"
          contentContainerStyle={{ paddingBottom: footerHeight }}
        >
          <View>
            <View className="px-5 pb-4 pt-5 g-4">
              <View>
                {attributes.includes('name') && translatedPoint.name ? (
                  <Typography variant="h2">{translatedPoint.name}</Typography>
                ) : null}
              </View>
              {attributes
                .filter((att) => att !== 'name' && translatedPoint[att])
                .map((att, ix) => (
                  <View key={att} className="g-4">
                    {!!ix && <Divider />}
                    <Field label={t(`fields.${att}`)}>
                      <Typography>{translatedPoint[att]}</Typography>
                    </Field>
                  </View>
                ))}
            </View>
          </View>
        </BottomSheetScrollView>
      </View>
    </BottomSheet>
  )
})

export default MapPointBottomSheet
