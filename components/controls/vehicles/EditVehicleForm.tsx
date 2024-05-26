import { router } from 'expo-router'
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
import { VehicleDto } from '@/modules/backend/openapi-generated'
import { useVehiclesStoreContext } from '@/state/VehiclesStoreProvider/useVehiclesStoreContext'

type Props = {
  vehicle: VehicleDto
}

const EditVehicleForm = ({ vehicle }: Props) => {
  const { t } = useTranslation()
  const { editVehicle, isLoading } = useVehiclesStoreContext()

  const [vehicleName, setVehicleName] = useState(vehicle.name ?? '')

  const handleSaveVehicle = async () => {
    await editVehicle({
      id: vehicle.id,
      vehicleName,
    })
    router.back()
  }

  return (
    <DismissKeyboard>
      <ScreenView title={t('VehiclesScreen.editVehicle')} options={{ presentation: 'modal' }}>
        {/* Native modals have dark backgrounds on iOS, set the status bar to light content. */}
        {/* eslint-disable-next-line react/style-prop-object */}
        <StatusBar style="light" />

        <ScreenContent>
          <AccessibilityField label={t('VehiclesScreen.licencePlateFieldLabel')}>
            <TextInput
              autoCapitalize="characters"
              autoCorrect={false}
              isDisabled
              value={vehicle.vehiclePlateNumber}
            />
          </AccessibilityField>

          <AccessibilityField
            label={t('VehiclesScreen.vehicleNameFieldLabel')}
            labelInsertArea={<Typography>{t('VehiclesScreen.optional')}</Typography>}
          >
            <TextInput autoCorrect={false} value={vehicleName} onChangeText={setVehicleName} />
          </AccessibilityField>

          <Button loading={isLoading} onPress={handleSaveVehicle}>
            {t('VehiclesScreen.editVehicle')}
          </Button>
        </ScreenContent>
      </ScreenView>
    </DismissKeyboard>
  )
}

export default EditVehicleForm
