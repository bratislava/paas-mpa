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
import { useVehicles } from '@/hooks/useVehicles'
import { VehicleDto } from '@/modules/backend/openapi-generated'
import { useTicketsFiltersStoreContext } from '@/state/TicketsFiltersStoreProvider/useTicketsFiltersStoreContext'
import { useTicketsFiltersStoreUpdateContext } from '@/state/TicketsFiltersStoreProvider/useTicketsFiltersStoreUpdateContext'

const TicketsFiltersVehiclesScreen = () => {
  const t = useTranslation('TicketsFilters')

  const { vehicles } = useVehicles()

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

  const renderItem: ListRenderItem<VehicleDto> = useCallback(
    ({ item: { vehiclePlateNumber } }) => (
      <SelectRow
        label={vehiclePlateNumber}
        value={localEcv ? localEcv === vehiclePlateNumber : true}
        onValueChange={handleValueChange(vehiclePlateNumber)}
      />
    ),
    [handleValueChange, localEcv],
  )

  const actionButton = useMemo(
    () => (
      <ContinueButton
        translationKey="apply"
        onPress={() => {
          onPurchaseStoreUpdate({ ecv: localEcv })
          router.back()
        }}
      />
    ),
    [localEcv, onPurchaseStoreUpdate],
  )

  return (
    <ScreenView title={t('vehicles')} actionButton={actionButton}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <PressableStyled onPress={handleSelectAll}>
              <Typography variant="default-bold">{t('selectAll')}</Typography>
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
