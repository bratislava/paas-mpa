import BottomSheet, {
  BottomSheetFooter,
  BottomSheetFooterProps,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet'
import { forwardRef, Ref, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { LayoutAnimation, View } from 'react-native'

import { useTranslation } from '@/hooks/useTranslation'
import { SelectedPoint } from '@/modules/map/types'
import { normalizePoint } from '@/modules/map/utils/normalizePoint'

import Button from '../shared/Button'
import Divider from '../shared/Divider'
import Field from '../shared/Field'
import Icon from '../shared/Icon'
import PressableStyled from '../shared/PressableStyled'
import Typography from '../shared/Typography'

type Props = {
  point: SelectedPoint
}

const MapPointBottomSheet = forwardRef<BottomSheet, Props>(({ point }, ref) => {
  const t = useTranslation('MapScreen.PointBottomSheet')
  const [index, setIndex] = useState(-1)

  const snapPoints = useMemo(() => ['40%', '80%'], [])

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
    console.log(`change: ${newIndex}`)
    const animation = LayoutAnimation.create(200, 'easeInEaseOut', 'opacity')
    LayoutAnimation.configureNext(animation)
    setIndex(newIndex)
  }, [])

  const np = normalizePoint(point)

  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter {...props}>
        <View className="px-5 py-3">
          <Button startIcon="directions" variant="primary" className="">
            {t('getDirections')}
          </Button>
          <View className="h-[29px]" aria-hidden />
        </View>
      </BottomSheetFooter>
    ),
    [t],
  )

  const handleClose = useCallback(() => {
    localRef.current?.close()
  }, [])

  useEffect(() => {
    localRef.current?.collapse()
  }, [point])

  const expanded = index === 1

  return (
    <BottomSheet
      enablePanDownToClose
      onChange={handleChange}
      ref={setRefs}
      snapPoints={snapPoints}
      footerComponent={renderFooter}
    >
      <View className="flex-1">
        <View className="flex-row justify-center border-b border-b-divider pb-3">
          <View className="absolute bottom-4 left-0 ml-[10px]">
            <PressableStyled onPress={handleClose}>
              <Icon name="close" />
            </PressableStyled>
          </View>
          <Typography variant="h1">{t('title')}</Typography>
        </View>
        <BottomSheetScrollView className="bg-white" contentContainerStyle={{ paddingBottom: 80 }}>
          <View>
            <View className="px-5 pt-3">
              <Field label={np.name ?? 'N/A'}>
                <Typography>{np.kind}</Typography>
              </Field>
            </View>
            <View className="px-5 py-5 g-4">
              <View>
                {np.address && (
                  <Field label="Address">
                    <Typography>{np.address}</Typography>
                  </Field>
                )}
              </View>
              {expanded &&
                Object.keys(np)
                  .filter((k) => !['address', 'name', 'navigation', 'kind'].includes(k))
                  .map((k) => (
                    <View key={k} className="g-4">
                      <Divider />
                      <Field label={k}>
                        <Typography>{np[k as keyof typeof np]}</Typography>
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
