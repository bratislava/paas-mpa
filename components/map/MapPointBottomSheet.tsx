import BottomSheet, { BottomSheetFooterProps, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { forwardRef, Ref, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { LayoutAnimation, View } from 'react-native'

import NavigateBottomSheetFooter from '@/components/map/NavigateBottomSheetFooter'
import Divider from '@/components/shared/Divider'
import Field from '@/components/shared/Field'
import Icon from '@/components/shared/Icon'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { SelectedPoint } from '@/modules/map/types'
import { normalizePoint } from '@/modules/map/utils/normalizePoint'

type Props = {
  point: SelectedPoint
}

const EXCLUDED_ATTRIBUTES = new Set(['address', 'name', 'navigation', 'kind', 'id'])

const MapPointBottomSheet = forwardRef<BottomSheet, Props>(({ point }, ref) => {
  const t = useTranslation('MapScreen.PointBottomSheet')
  const [index, setIndex] = useState(-1)
  const [footerHeight, setFooterHeight] = useState(0)

  const np = useMemo(() => normalizePoint(point), [point])

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
      if (!np.navigation) return null

      return (
        <NavigateBottomSheetFooter
          onLayout={(event) => setFooterHeight(event.nativeEvent.layout.height)}
          navigationUrl={np.navigation}
          {...props}
        />
      )
    },
    [np.navigation],
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
        <BottomSheetScrollView
          className="bg-white"
          contentContainerStyle={{ paddingBottom: footerHeight }}
        >
          <View>
            <View className="px-5 pt-3">
              <Field label={np.name} variant="h1">
                <Typography>{t(`kinds.${np.kind}`)}</Typography>
              </Field>
            </View>
            <View className="px-5 pb-4 pt-5 g-4">
              <View>
                {np.address && (
                  <Field label={t('fields.address')}>
                    <Typography>{np.address}</Typography>
                  </Field>
                )}
              </View>
              {!expanded && (
                <>
                  {np.address && <Divider />}
                  <View>
                    {np.id && (
                      <Field label="ID">
                        <Typography>{np.id}</Typography>
                      </Field>
                    )}
                  </View>
                </>
              )}
              {expanded &&
                Object.keys(np)
                  .filter((k) => !EXCLUDED_ATTRIBUTES.has(k))
                  .map((k) => (
                    <View key={k} className="g-4">
                      <Divider />
                      <Field label={t(`fields.${k}`)}>
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
