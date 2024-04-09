import { Link, router, useLocalSearchParams } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'

import TextInput from '@/components/inputs/TextInput'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import AccessibilityField from '@/components/shared/AccessibilityField'
import Button from '@/components/shared/Button'
import DismissKeyboard from '@/components/shared/DismissKeyboard'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { useVehiclesStoreContext } from '@/state/VehiclesStoreProvider/useVehiclesStoreContext'

export type EditVehicleParams = {
  vehicleId: string
}

const AddVehicleScreen = () => {
  const t = useTranslation('VehiclesScreen')
  const { vehicleId } = useLocalSearchParams<EditVehicleParams>()

  const { editVehicle, isLoading, getVehicle } = useVehiclesStoreContext()

  const vehicle = getVehicle(vehicleId ? +vehicleId : null)

  const [vehicleName, setVehicleName] = useState(vehicle?.name ?? '')

  // If the page was reloaded or navigated to directly, then the modal should be presented as
  // a full screen page. You may need to change the UI to account for this.
  const isPresented = router.canGoBack()

  if (!vehicleId) return null

  const handleSaveVehicle = async () => {
    if (!vehicle) return

    await editVehicle({
      id: +vehicleId,
      licencePlate: vehicle.vehiclePlateNumber,
      vehicleName,
      isDefault: vehicle.isDefault,
    })
    router.back()
  }

  return (
    <DismissKeyboard>
      <ScreenView title={t('editVehicle')} options={{ presentation: 'modal' }}>
        {/* Native modals have dark backgrounds on iOS, set the status bar to light content. */}
        {/* eslint-disable-next-line react/style-prop-object */}
        <StatusBar style="light" />

        <ScreenContent>
          <AccessibilityField label={t('licencePlateFieldLabel')}>
            <TextInput
              autoCapitalize="characters"
              autoCorrect={false}
              isDisabled
              value={vehicle?.vehiclePlateNumber}
            />
          </AccessibilityField>

          <AccessibilityField
            label={t('vehicleNameFieldLabel')}
            labelInsertArea={<Typography>{t('optional')}</Typography>}
          >
            <TextInput autoCorrect={false} value={vehicleName} onChangeText={setVehicleName} />
          </AccessibilityField>

          <Button loading={isLoading} onPress={handleSaveVehicle}>
            {t('editVehicle')}
          </Button>

          {!isPresented && (
            <Link href="/" asChild>
              <Button variant="plain-dark">Dismiss</Button>
            </Link>
          )}
        </ScreenContent>
      </ScreenView>
    </DismissKeyboard>
  )
}

export default AddVehicleScreen
