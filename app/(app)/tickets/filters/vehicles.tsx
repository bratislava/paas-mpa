import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useCallback, useMemo, useState } from 'react'
import { FlatList, ListRenderItem, View } from 'react-native'

import SelectRow from '@/components/list-rows/SelectRow'
import ContinueButton from '@/components/navigation/ContinueButton'
import ScreenView from '@/components/screen-layout/ScreenView'
import Divider from '@/components/shared/Divider'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { VehicleDto } from '@/modules/backend/openapi-generated'
import { useTicketsFiltersStoreContext } from '@/state/TicketsFiltersStoreProvider/useTicketsFiltersStoreContext'
import { useTicketsFiltersStoreUpdateContext } from '@/state/TicketsFiltersStoreProvider/useTicketsFiltersStoreUpdateContext'
import { useVehiclesStoreContext } from '@/state/VehiclesStoreProvider/useVehiclesStoreContext'

const TicketsFiltersVehiclesScreen = () => {
  const { t } = useTranslation()

  const { vehicles } = useVehiclesStoreContext()

  const onPurchaseStoreUpdate = useTicketsFiltersStoreUpdateContext()
  const { ecvs } = useTicketsFiltersStoreContext()
  const [localEcvs, setLocalEcvs] = useState<string[] | 'all'>(ecvs)

  const handleSelectAll = useCallback(() => {
    setLocalEcvs('all')
  }, [])

  const handleValueChange = useCallback(
    (selectedEcv: string) => () => {
      if (localEcvs === 'all') {
        setLocalEcvs(
          vehicles
            .map(({ vehiclePlateNumber }) => vehiclePlateNumber)
            .filter((ecv) => ecv !== selectedEcv),
        )
      } else {
        const newLocalEcvs = localEcvs.includes(selectedEcv)
          ? localEcvs.filter((prevEcv) => prevEcv !== selectedEcv)
          : [...localEcvs, selectedEcv]

        setLocalEcvs(newLocalEcvs)
      }
    },
    [localEcvs, vehicles],
  )

  const renderItem: ListRenderItem<VehicleDto> = useCallback(
    ({ item: { vehiclePlateNumber } }) => (
      <SelectRow
        label={vehiclePlateNumber}
        value={localEcvs.includes(vehiclePlateNumber) || localEcvs === 'all'}
        onValueChange={handleValueChange(vehiclePlateNumber)}
      />
    ),
    [handleValueChange, localEcvs],
  )

  const actionButton = useMemo(
    () => (
      <ContinueButton
        disabled={localEcvs?.length === 0}
        onPress={() => {
          onPurchaseStoreUpdate({ ecvs: localEcvs?.length === vehicles.length ? 'all' : localEcvs })
          router.back()
        }}
      >
        {t('TicketsFilters.apply')}
      </ContinueButton>
    ),
    [localEcvs, t, vehicles.length, onPurchaseStoreUpdate],
  )

  return (
    <ScreenView
      title={t('TicketsFilters.vehicles')}
      options={{
        headerRight: () => (
          <PressableStyled onPress={handleSelectAll}>
            <Typography variant="default-bold">{t('TicketsFilters.selectAll')}</Typography>
          </PressableStyled>
        ),
        presentation: 'modal',
      }}
      actionButton={actionButton}
    >
      {/* Native modals have dark backgrounds on iOS, set the status bar to light content. */}
      {/* eslint-disable-next-line react/style-prop-object */}
      <StatusBar style="light" />

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
