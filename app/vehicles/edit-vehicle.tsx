import { Link, router, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'

import TextInput from '@/components/inputs/TextInput'
import Button from '@/components/shared/Button'
import Field from '@/components/shared/Field'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { useVehiclesStorage, Vehicle } from '@/hooks/useVehiclesStorage'

// TODO make sure that modal is what we want and that it works correctly
const AddVehicleScreen = () => {
  const t = useTranslation('VehiclesScreen')

  const [licencePlate, setLicencePlate] = useState('')
  const [vehicleName, setVehicleName] = useState('')

  const [vehicles, setVehicles] = useVehiclesStorage()

  // If the page was reloaded or navigated to directly, then the modal should be presented as
  // a full screen page. You may need to change the UI to account for this.
  const isPresented = router.canGoBack()

  // TODO validation?
  const isValid = licencePlate.length > 0

  // TODO duplicates, sanitize inputs, trim, etc.
  const handleSaveVehicle = () => {
    const newVehicle: Vehicle = {
      licencePlate,
      vehicleName: vehicleName.length > 0 ? vehicleName : null,
    }
    setVehicles([...(vehicles ?? []), newVehicle])
    router.back()
  }

  return (
    <ScreenView>
      <Stack.Screen options={{ title: t('addVehicleTitle') }} />

      {/* Native modals have dark backgrounds on iOS, set the status bar to light content. */}
      {/* eslint-disable-next-line react/style-prop-object */}
      <StatusBar style="light" />

      <ScreenContent>
        <Field label={t('licencePlateFieldLabel')}>
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

        <Button disabled={!isValid} onPress={() => handleSaveVehicle()}>
          {t('addVehicle')}
        </Button>

        {!isPresented && (
          <Link href="/">
            <Typography variant="default-bold">Dismiss</Typography>
          </Link>
        )}
      </ScreenContent>
    </ScreenView>
  )
}

export default AddVehicleScreen
