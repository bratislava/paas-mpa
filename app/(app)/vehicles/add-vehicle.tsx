import { Link, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'

import { LicencePlateFormatWarning } from '@/components/info/LicencePlateFormatWarning'
import TextInput from '@/components/inputs/TextInput'
import Modal from '@/components/screen-layout/Modal/Modal'
import ModalContentWithActions from '@/components/screen-layout/Modal/ModalContentWithActions'
import { useModal } from '@/components/screen-layout/Modal/useModal'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import AccessibilityField from '@/components/shared/AccessibilityField'
import Button from '@/components/shared/Button'
import DismissKeyboard from '@/components/shared/DismissKeyboard'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { useVehiclesStoreContext } from '@/state/VehiclesStoreProvider/useVehiclesStoreContext'
import { AddVehicle } from '@/state/VehiclesStoreProvider/VehiclesStoreProvider'
import { isStandardFormat, sanitizeLicencePlate } from '@/utils/licencePlate'

export const LICENCE_PLATE_MAX_LENGTH = 15

const AddVehicleScreen = () => {
  const { t } = useTranslation()
  const { isModalVisible, openModal, closeModal } = useModal()

  const { addVehicle, isVehiclePresent, isLoading } = useVehiclesStoreContext()

  const [licencePlateInput, setLicencePlateInput] = useState('')
  const [vehicleName, setVehicleName] = useState('')
  const [error, setError] = useState('')

  const sanitizedLicencePlate = sanitizeLicencePlate(licencePlateInput)

  const handleLicencePlateChange = (newLicencePlate: string) => {
    const newSanitizedLicencePlate = sanitizeLicencePlate(newLicencePlate)
    setLicencePlateInput(newSanitizedLicencePlate)
    setError('')

    if (isVehiclePresent(newSanitizedLicencePlate)) {
      setError(t('VehiclesScreen.licencePlateDuplicate'))
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

  const handleAddVehicle = () => {
    if (isStandardFormat(sanitizedLicencePlate)) {
      handleSaveVehicle()
    } else openModal()
  }

  return (
    <DismissKeyboard>
      <ScreenView title={t('VehiclesScreen.addVehicleTitle')} options={{ presentation: 'modal' }}>
        {/* Native modals have dark backgrounds on iOS, set the status bar to light content. */}
        {/* eslint-disable-next-line react/style-prop-object */}
        <StatusBar style="light" />

        <ScreenContent>
          <AccessibilityField
            label={t('VehiclesScreen.licencePlateFieldLabel')}
            errorMessage={error}
          >
            <TextInput
              autoCapitalize="characters"
              autoCorrect={false}
              value={licencePlateInput}
              onChangeText={handleLicencePlateChange}
              hasError={error.length > 0}
              maxLength={LICENCE_PLATE_MAX_LENGTH}
            />
          </AccessibilityField>

          <AccessibilityField
            label={t('VehiclesScreen.vehicleNameFieldLabel')}
            labelInsertArea={<Typography>{t('VehiclesScreen.optional')}</Typography>}
          >
            <TextInput autoCorrect={false} value={vehicleName} onChangeText={setVehicleName} />
          </AccessibilityField>

          <Button disabled={!isValid} onPress={handleAddVehicle}>
            {t('VehiclesScreen.addVehicle')}
          </Button>

          {!isPresented && (
            <Link href="/" asChild>
              <Button variant="plain-dark">Dismiss</Button>
            </Link>
          )}
        </ScreenContent>

        <Modal visible={isModalVisible} onRequestClose={closeModal}>
          <ModalContentWithActions
            variant="success"
            title={t('VehiclesScreen.addVehicleConfirmModal.title')}
            text={t('VehiclesScreen.addVehicleConfirmModal.message', {
              licencePlate: sanitizedLicencePlate,
            })}
            hideAvatar
            isLoading={isLoading}
            primaryActionLabel={t('VehiclesScreen.addVehicleConfirmModal.actionConfirm')}
            primaryActionOnPress={handleSaveVehicle}
            secondaryActionLabel={t('Common.cancel')}
            secondaryActionOnPress={closeModal}
          >
            <LicencePlateFormatWarning />
          </ModalContentWithActions>
        </Modal>
      </ScreenView>
    </DismissKeyboard>
  )
}

export default AddVehicleScreen
