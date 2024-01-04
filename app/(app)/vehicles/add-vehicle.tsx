import { Link, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'

import TextInput from '@/components/inputs/TextInput'
import Modal from '@/components/screen-layout/Modal/Modal'
import ModalContentWithActions from '@/components/screen-layout/Modal/ModalContentWithActions'
import { useModal } from '@/components/screen-layout/Modal/useModal'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Button from '@/components/shared/Button'
import DismissKeyboard from '@/components/shared/DissmissKeyboard'
import Field from '@/components/shared/Field'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { useVehiclesStoreContext } from '@/state/VehiclesStoreProvider/useVehiclesStoreContext'
import { AddVehicle } from '@/state/VehiclesStoreProvider/VehiclesStoreProvider'
import { isStandardFormat, sanitizeLicencePlate } from '@/utils/licencePlate'

const AddVehicleScreen = () => {
  const t = useTranslation('VehiclesScreen')
  const { isModalVisible, openModal, closeModal, toggleModal } = useModal()

  const { addVehicle, isVehiclePresent, isLoading } = useVehiclesStoreContext()

  const [licencePlateInput, setLicencePlateInput] = useState('')
  const [vehicleName, setVehicleName] = useState('')
  const [error, setError] = useState('')

  const sanitizedLicencePlate = sanitizeLicencePlate(licencePlateInput)

  const handleLicencePlateChange = (newLicencePlate: string) => {
    setLicencePlateInput(newLicencePlate)

    const newSanitizedLicencePlate = sanitizeLicencePlate(newLicencePlate)

    setError('')
    if (isVehiclePresent(newSanitizedLicencePlate)) {
      setError(t('licencePlateDuplicate'))
    }
  }

  // If the page was reloaded or navigated to directly, then the modal should be presented as
  // a full screen page. You may need to change the UI to account for this.
  const isPresented = router.canGoBack()

  const isValid = sanitizedLicencePlate.length > 0 && error.length === 0

  const handleSaveVehicle = async () => {
    const newVehicle: AddVehicle = {
      licencePlate: sanitizedLicencePlate,
      vehicleName,
    }
    await addVehicle(newVehicle)
    router.back()
  }

  return (
    <DismissKeyboard>
      <ScreenView title={t('addVehicleTitle')} options={{ presentation: 'modal' }}>
        {/* Native modals have dark backgrounds on iOS, set the status bar to light content. */}
        {/* eslint-disable-next-line react/style-prop-object */}
        <StatusBar style="light" />

        <ScreenContent>
          <Field label={t('licencePlateFieldLabel')} errorMessage={error}>
            <TextInput
              autoCapitalize="characters"
              autoCorrect={false}
              value={licencePlateInput}
              onChangeText={handleLicencePlateChange}
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
            title={t('addVehicleConfirmModal.title')}
            text={t('addVehicleConfirmModal.message', { licencePlate: sanitizedLicencePlate })}
            hideAvatar
            isLoading={isLoading}
            primaryActionLabel={t('addVehicleConfirmModal.actionConfirm')}
            primaryActionOnPress={handleSaveVehicle}
            secondaryActionLabel={t('addVehicleConfirmModal.actionReject')}
            secondaryActionOnPress={closeModal}
          >
            {isStandardFormat(sanitizedLicencePlate) ? null : (
              <Panel className="bg-warning-light">
                <Typography>{t('addVehicleConfirmModal.licencePlateFormatWarning')}</Typography>
              </Panel>
            )}
          </ModalContentWithActions>
        </Modal>
      </ScreenView>
    </DismissKeyboard>
  )
}

export default AddVehicleScreen
