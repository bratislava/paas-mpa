import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import { router } from 'expo-router'
import { useCallback } from 'react'
import { View } from 'react-native'

import ActionRow from '@/components/list-rows/ActionRow'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import PressableStyled from '@/components/shared/PressableStyled'
import { useTranslation } from '@/hooks/useTranslation'
import { FilteringTimeframesEnum } from '@/state/TicketsFiltersStoreProvider/TicketsFiltersStoreProvider'
import { useTicketsFiltersStoreContext } from '@/state/TicketsFiltersStoreProvider/usePurchaseStoreContext'
import { useTicketsFiltersStoreUpdateContext } from '@/state/TicketsFiltersStoreProvider/usePurchaseStoreUpdateContext'

const TicketsFiltersTimeframesScreen = () => {
  const t = useTranslation('TicketsFilters')
  const snapPoints = [350]
  const { timeframe: selectedTimeframe } = useTicketsFiltersStoreContext()
  const onPurchaseStoreUpdate = useTicketsFiltersStoreUpdateContext()
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    [],
  )

  const handleOptionPress = useCallback(
    (timeframe: FilteringTimeframesEnum) => () => {
      onPurchaseStoreUpdate({ timeframe })
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
      backdropComponent={renderBackdrop}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
    >
      <BottomSheetContent>
        <View className="h-[350px]">
          {Object.values(FilteringTimeframesEnum).map((timeframe) => (
            <PressableStyled key={timeframe} onPress={handleOptionPress(timeframe)}>
              <ActionRow
                label={t(`timeframes.${timeframe}`)}
                endIcon={timeframe === selectedTimeframe ? 'check-circle' : undefined}
              />
            </PressableStyled>
          ))}
        </View>
      </BottomSheetContent>
    </BottomSheet>
  )
}

export default TicketsFiltersTimeframesScreen
