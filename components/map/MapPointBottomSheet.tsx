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
import { useTranslation } from '@/hooks/useTranslation'
import { MapPointKindEnum } from '@/modules/map/constants'
import { useNormalizedPoint } from '@/modules/map/hooks/useNormalizedPoint'
import { MapInterestPoint, NormalizedPoint } from '@/modules/map/types'

type Props = {
  point: MapInterestPoint
}

const ATTRIBUTES_MAP: Record<MapPointKindEnum, (keyof NormalizedPoint)[]> = {
  [MapPointKindEnum.parkomat]: ['location', 'parkomatId'],
  [MapPointKindEnum.assistant]: ['udrId'],
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
  const [index, setIndex] = useState(-1)
  const [footerHeight, setFooterHeight] = useState(0)

  const formattedMapPoint = useNormalizedPoint(point)

  const snapPoints = useMemo(() => [375, '80%'], [])

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

  const handleChange = useCallback((newIndex: number) => {
    const animation = LayoutAnimation.create(200, 'easeInEaseOut', 'opacity')
    LayoutAnimation.configureNext(animation)
    setIndex(newIndex)
  }, [])

  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => {
      if (!formattedMapPoint.navigation) return null

      return (
        <NavigateBottomSheetFooter
          onLayout={(event) => setFooterHeight(event.nativeEvent.layout.height)}
          navigationUrl={formattedMapPoint.navigation}
          {...props}
        />
      )
    },
    [formattedMapPoint.navigation],
  )

  const handleClose = useCallback(() => {
    localRef.current?.close()
  }, [])

  useEffect(() => {
    localRef.current?.collapse()
  }, [point])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isExpanded = index === 1

  const attributes = ATTRIBUTES_MAP[formattedMapPoint.kind]

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
          <Typography variant="h1">{t(`kinds.${formattedMapPoint.kind}`)}</Typography>
        </View>
        <BottomSheetScrollView
          className="bg-white"
          contentContainerStyle={{ paddingBottom: footerHeight }}
        >
          <View>
            <View className="px-5 pb-4 pt-5 g-4">
              <View>
                {attributes.includes('name') && formattedMapPoint.name ? (
                  <Typography variant="h2">{formattedMapPoint.name}</Typography>
                ) : null}
              </View>
              {attributes
                .filter((att) => att !== 'name' && formattedMapPoint[att])
                .map((att, ix) => (
                  <View key={att} className="g-4">
                    {!!ix && <Divider />}
                    <Field label={t(`fields.${att}`)}>
                      <Typography>{formattedMapPoint[att]}</Typography>
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
