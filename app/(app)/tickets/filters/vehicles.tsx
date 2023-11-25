import { router, Stack } from 'expo-router'
import { useCallback, useMemo, useState } from 'react'
import { FlatList, ListRenderItem, View } from 'react-native'

import SelectRow from '@/components/list-rows/SelectRow'
import ContinueButton from '@/components/navigation/ContinueButton'
import ScreenView from '@/components/screen-layout/ScreenView'
import Divider from '@/components/shared/Divider'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { useVehiclesStorage, Vehicle } from '@/hooks/useVehiclesStorage'
import { useTicketsFiltersStoreContext } from '@/state/TicketsFiltersStoreProvider/usePurchaseStoreContext'
import { useTicketsFiltersStoreUpdateContext } from '@/state/TicketsFiltersStoreProvider/usePurchaseStoreUpdateContext'

const TicketsFiltersVehiclesScreen = () => {
  const t = useTranslation('TicketsFilters')
  const tCommon = useTranslation('Common')

  const [vehicles] = useVehiclesStorage()

  const onPurchaseStoreUpdate = useTicketsFiltersStoreUpdateContext()
  const { ecv } = useTicketsFiltersStoreContext()
  const [localEcv, setLocalEcv] = useState(ecv)

  const handleSelectAll = useCallback(() => {
    setLocalEcv(null)
  }, [])

  const handleValueChange = useCallback(
    (selectedEcv: string) => () => {
      setLocalEcv(selectedEcv)
    },
    [],
  )

  const renderItem: ListRenderItem<Vehicle> = useCallback(
    ({ item: { licencePlate } }) => (
      <SelectRow
        label={licencePlate}
        value={localEcv ? localEcv === licencePlate : true}
        onValueChange={handleValueChange(licencePlate)}
      />
    ),
    [handleValueChange, localEcv],
  )

  const actionButton = useMemo(
    () => (
      <ContinueButton
        onPress={() => {
          onPurchaseStoreUpdate({ ecv: localEcv })
          router.back()
        }}
      >
        {tCommon('apply')}
      </ContinueButton>
    ),
    [tCommon, localEcv, onPurchaseStoreUpdate],
  )

  return (
    <ScreenView title={t('vehicles')} actionButton={actionButton}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <PressableStyled onPress={handleSelectAll}>
              <Typography>{t('selectAll')}</Typography>
            </PressableStyled>
          ),
        }}
      />
      <View className="py-5 pl-6 pr-4">
        <FlatList
          data={vehicles}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Divider />}
        />
      </View>
    </ScreenView>
  )
}

export default TicketsFiltersVehiclesScreen
