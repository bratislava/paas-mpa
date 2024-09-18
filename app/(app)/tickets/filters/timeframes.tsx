import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import { router } from 'expo-router'
import { Fragment, useCallback, useRef } from 'react'
import { View } from 'react-native'
import { useReducedMotion } from 'react-native-reanimated'

import ActionRow from '@/components/list-rows/ActionRow'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import Divider from '@/components/shared/Divider'
import PressableStyled from '@/components/shared/PressableStyled'
import { useTimeframesTranslation } from '@/hooks/useTimeframesTranslation'
import { FilterTimeframesEnum } from '@/state/TicketsFiltersStoreProvider/TicketsFiltersStoreProvider'
import { useTicketsFiltersStoreContext } from '@/state/TicketsFiltersStoreProvider/useTicketsFiltersStoreContext'
import { useTicketsFiltersStoreUpdateContext } from '@/state/TicketsFiltersStoreProvider/useTicketsFiltersStoreUpdateContext'

// TODO refactor from screen to component, because it return only BottomSheet
const TicketsFiltersTimeframesScreen = () => {
  const reducedMotion = useReducedMotion()

  const ref = useRef<BottomSheet>(null)
  const { timeframe: selectedTimeframe } = useTicketsFiltersStoreContext()
  const onPurchaseStoreUpdate = useTicketsFiltersStoreUpdateContext()
  const translationMap = useTimeframesTranslation()

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    [],
  )

  const handleOptionPress = useCallback(
    (timeframe: FilterTimeframesEnum) => () => {
      onPurchaseStoreUpdate({ timeframe })
      ref.current?.close()
    },
    [onPurchaseStoreUpdate],
  )

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      router.back()
    }
  }, [])

  return (
    <BottomSheet
      ref={ref}
      backdropComponent={renderBackdrop}
      onChange={handleSheetChanges}
      enableDynamicSizing
      enablePanDownToClose
      animateOnMount={!reducedMotion}
    >
      <BottomSheetContent>
        <View>
          {Object.values(FilterTimeframesEnum).map((timeframe, index) => (
            <Fragment key={timeframe}>
              {index > 0 && <Divider />}

              <PressableStyled onPress={handleOptionPress(timeframe)}>
                <ActionRow
                  label={translationMap[timeframe]}
                  endIcon={timeframe === selectedTimeframe ? 'check-circle' : undefined}
                />
              </PressableStyled>
            </Fragment>
          ))}
        </View>
      </BottomSheetContent>
    </BottomSheet>
  )
}

export default TicketsFiltersTimeframesScreen
