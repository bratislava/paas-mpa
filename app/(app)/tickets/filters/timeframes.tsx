import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import { router } from 'expo-router'
import { useCallback, useRef } from 'react'
import { View } from 'react-native'

import ActionRow from '@/components/list-rows/ActionRow'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import Divider from '@/components/shared/Divider'
import PressableStyled from '@/components/shared/PressableStyled'
import { useTranslation } from '@/hooks/useTranslation'
import { FilterTimeframesEnum } from '@/state/TicketsFiltersStoreProvider/TicketsFiltersStoreProvider'
import { useTicketsFiltersStoreContext } from '@/state/TicketsFiltersStoreProvider/useTicketsFiltersStoreContext'
import { useTicketsFiltersStoreUpdateContext } from '@/state/TicketsFiltersStoreProvider/useTicketsFiltersStoreUpdateContext'

const TicketsFiltersTimeframesScreen = () => {
  const t = useTranslation('TicketsFilters')
  const snapPoints = [300]
  const ref = useRef<BottomSheet>(null)
  const { timeframe: selectedTimeframe } = useTicketsFiltersStoreContext()
  const onPurchaseStoreUpdate = useTicketsFiltersStoreUpdateContext()

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
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
    >
      <BottomSheetContent>
        <View>
          {Object.values(FilterTimeframesEnum).map((timeframe, index) => (
            <>
              {index > 0 && <Divider key={`divider-${timeframe}`} />}

              <PressableStyled key={timeframe} onPress={handleOptionPress(timeframe)}>
                <ActionRow
                  label={t(`timeframes.${timeframe}`)}
                  endIcon={timeframe === selectedTimeframe ? 'check-circle' : undefined}
                />
              </PressableStyled>
            </>
          ))}
        </View>
      </BottomSheetContent>
    </BottomSheet>
  )
}

export default TicketsFiltersTimeframesScreen
