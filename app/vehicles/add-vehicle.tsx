import { Link, router, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'

import TextInput from '@/components/inputs/TextInput'
import Button from '@/components/shared/Button'
import Field from '@/components/shared/Field'
import Modal, { ModalContentWithActions } from '@/components/shared/Modal'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import Surface from '@/components/shared/Surface'
import Typography from '@/components/shared/Typography'
import { useModal } from '@/hooks/useModal'
import { useTranslation } from '@/hooks/useTranslation'
import { useVehicles } from '@/hooks/useVehicles'
import { Vehicle } from '@/hooks/useVehiclesStorage'
import { isStandardFormat, sanitizeLicencePlate } from '@/utils/licencePlate'

const AddVehicleScreen = () => {
  const t = useTranslation('VehiclesScreen')
  const tAddModal = useTranslation('VehiclesScreen.addVehicleConfirmModal')

  const { addVehicle, isVehiclePresent } = useVehicles()
  const { isModalVisible, openModal, closeModal, toggleModal } = useModal()

  const [licencePlateInput, setLicencePlateInput] = useState('')
  const [vehicleName, setVehicleName] = useState('')
  const [error, setError] = useState('')

  const sanitizedLicencePlate = sanitizeLicencePlate(licencePlateInput)

  useEffect(() => {
    setError('')
    if (isVehiclePresent(sanitizedLicencePlate)) {
      setError(t('licencePlateDuplicate'))
    }
  }, [isVehiclePresent, sanitizedLicencePlate, t])

  // If the page was reloaded or navigated to directly, then the modal should be presented as
  // a full screen page. You may need to change the UI to account for this.
  const isPresented = router.canGoBack()

  const isValid = sanitizedLicencePlate.length > 0 && error.length === 0

  const handleSaveVehicle = () => {
    const newVehicle: Vehicle = {
      licencePlate: sanitizedLicencePlate,
      vehicleName: vehicleName.length > 0 ? vehicleName : null,
    }
    addVehicle(newVehicle)
    router.back()
  }

  return (
    <ScreenView>
      <Stack.Screen options={{ title: t('addVehicleTitle') }} />

      {/* Native modals have dark backgrounds on iOS, set the status bar to light content. */}
      {/* eslint-disable-next-line react/style-prop-object */}
      <StatusBar style="light" />

      <ScreenContent>
        <Field label={t('licencePlateFieldLabel')} errorMessage={error}>
          <TextInput
            autoCapitalize="characters"
            autoCorrect={false}
            value={licencePlateInput}
            onChangeText={setLicencePlateInput}
            hasError={error.length > 0}
          />
        </Field>

        <Field
          label={t('vehicleNameFieldLabel')}
          labelInsertArea={<Typography>{t('optional')}</Typography>}
        >
          <TextInput autoCorrect={false} value={vehicleName} onChangeText={setVehicleName} />
        </Field>

        <Button disabled={!isValid} onPress={openModal}>
          {t('addVehicle')}
        </Button>

        {!isPresented && (
          <Link href="/" asChild>
            <Button variant="plain-dark">Dismiss</Button>
          </Link>
        )}
      </ScreenContent>

      <Modal visible={isModalVisible} onRequestClose={toggleModal}>
        <ModalContentWithActions
          variant="success"
          title={tAddModal('title')}
          text={tAddModal('message', { licencePlate: sanitizedLicencePlate })}
          hideAvatar
          primaryActionLabel={tAddModal('actionConfirm')}
          primaryActionOnPress={() => handleSaveVehicle()}
          secondaryActionLabel={tAddModal('actionReject')}
          secondaryActionOnPress={closeModal}
        >
          {isStandardFormat(sanitizedLicencePlate) ? null : (
            <Surface surfaceClassName="bg-warning-light">
              <Typography>{tAddModal('licencePlateFormatWarning')}</Typography>
            </Surface>
          )}
        </ModalContentWithActions>
      </Modal>
    </ScreenView>
  )
}

export default AddVehicleScreen
