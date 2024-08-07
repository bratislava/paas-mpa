import { router, useLocalSearchParams } from 'expo-router'

import EditVehicleForm from '@/components/controls/vehicles/EditVehicleForm'
import ErrorScreen from '@/components/screen-layout/ErrorScreen'
import Button from '@/components/shared/Button'
import { useTranslation } from '@/hooks/useTranslation'
import { useVehiclesStoreContext } from '@/state/VehiclesStoreProvider/useVehiclesStoreContext'

export type EditVehicleParams = {
  vehicleId: string
}

const EditVehicleScreen = () => {
  const { t } = useTranslation()
  const { vehicleId } = useLocalSearchParams<EditVehicleParams>()
  const { getVehicle } = useVehiclesStoreContext()

  const vehicle = getVehicle(Number(vehicleId))

  if (!(vehicleId && vehicle))
    return (
      <ErrorScreen
        options={{ presentation: 'modal' }}
        actionButton={
          <Button variant="negative" onPress={() => router.back()}>
            {t('VehiclesScreen.actions.back')}
          </Button>
        }
        title={t('VehiclesScreen.editVehicle.title')}
      />
    )

  return <EditVehicleForm vehicle={vehicle} />
}

export default EditVehicleScreen
