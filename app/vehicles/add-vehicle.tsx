import { Link, router, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'

import TextInput from '@/components/inputs/TextInput'
import Button from '@/components/shared/Button'
import Field from '@/components/shared/Field'
import Screen from '@/components/shared/Screen'
import ScreenContent from '@/components/shared/ScreenContent'
import Typography from '@/components/shared/Typography'
import { useStorageVehicles, Vehicle } from '@/hooks/useStorageVehicles'
import { useTranslation } from '@/hooks/useTranslation'

// TODO make sure that modal is what we want and that it works correctly
const AddVehicleScreen = () => {
  const t = useTranslation('VehiclesScreen')

  const [licencePlate, setLicencePlate] = useState('')
  const [vehicleName, setVehicleName] = useState('')

  const [vehicles, setVehicles] = useStorageVehicles()

  // If the page was reloaded or navigated to directly, then the modal should be presented as
  // a full screen page. You may need to change the UI to account for this.
  const isPresented = router.canGoBack()

  // TODO validation?
  const isValid = licencePlate.length > 0

  // TODO duplicates
  const handleSaveVehicle = () => {
    const newVehicle: Vehicle = {
      licencePlate,
      vehicleName: vehicleName.length > 0 ? vehicleName : null,
    }
    setVehicles([...(vehicles ?? []), newVehicle])
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: t('addVehicleTitle') }} />

      {/* Use `../` as a simple way to navigate to the root. This is not analogous to "goBack". */}
      {!isPresented && (
        <Link href="../">
          <Typography variant="default-bold">Dismiss</Typography>
        </Link>
      )}

      {/* Native modals have dark backgrounds on iOS, set the status bar to light content. */}
      {/* eslint-disable-next-line react/style-prop-object */}
      <StatusBar style="light" />

      <ScreenContent>
        <Field label={t('licensePlateFieldLabel')}>
          <TextInput
            autoCapitalize="characters"
            autoCorrect={false}
            value={licencePlate}
            onChangeText={setLicencePlate}
          />
        </Field>

        <Field
          label={t('vehicleNameFieldLabel')}
          labelInsertArea={<Typography>{t('optional')}</Typography>}
        >
          <TextInput autoCorrect={false} value={vehicleName} onChangeText={setVehicleName} />
        </Field>

        <Button title={t('addVehicle')} disabled={!isValid} onPress={() => handleSaveVehicle()} />
      </ScreenContent>
    </Screen>
  )
}

export default AddVehicleScreen
