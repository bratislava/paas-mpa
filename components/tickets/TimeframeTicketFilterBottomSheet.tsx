import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
} from '@gorhom/bottom-sheet'
import { forwardRef, Fragment, useCallback, useRef } from 'react'
import { View } from 'react-native'
import { useReducedMotion } from 'react-native-reanimated'

import ActionRow from '@/components/list-rows/ActionRow'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import Divider from '@/components/shared/Divider'
import PressableStyled from '@/components/shared/PressableStyled'
import { useMultipleRefsSetter } from '@/hooks/useMultipleRefsSetter'
import { useTimeframesTranslation } from '@/hooks/useTimeframesTranslation'
import { FilterTimeframesEnum } from '@/state/TicketsFiltersStoreProvider/TicketsFiltersStoreProvider'
import { useTicketsFiltersStoreContext } from '@/state/TicketsFiltersStoreProvider/useTicketsFiltersStoreContext'
import { useTicketsFiltersStoreUpdateContext } from '@/state/TicketsFiltersStoreProvider/useTicketsFiltersStoreUpdateContext'

const TimeframeTicketFilterBottomSheet = forwardRef<BottomSheetModal>((_, ref) => {
  const reducedMotion = useReducedMotion()

  const localRef = useRef<BottomSheetModal>(null)
  const refSetter = useMultipleRefsSetter<BottomSheetModal | null>(localRef, ref)

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
      localRef.current?.close()
    },
    [onPurchaseStoreUpdate],
  )

  return (
    <BottomSheetModal
      ref={refSetter}
      backdropComponent={renderBackdrop}
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
    </BottomSheetModal>
  )
})

export default TimeframeTicketFilterBottomSheet
