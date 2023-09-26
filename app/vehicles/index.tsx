import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import { Link } from 'expo-router'
import React, { useCallback, useRef, useState } from 'react'
import { FlatList } from 'react-native'

import ActionRow from '@/components/actions/ActionRow'
import NoVehicles from '@/components/controls/vehicles/NoVehicles'
import VehicleRow from '@/components/controls/vehicles/VehicleRow'
import BottomSheetContent from '@/components/shared/BottomSheetContent'
import Button from '@/components/shared/Button'
import Divider from '@/components/shared/Divider'
import Field from '@/components/shared/Field'
import Modal, { ModalContentWithActions } from '@/components/shared/Modal'
import PressableStyled from '@/components/shared/PressableStyled'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import { useModal } from '@/hooks/useModal'
import { useTranslation } from '@/hooks/useTranslation'
import { useVehicles } from '@/hooks/useVehicles'

// TODO consider moving whole Delete modal with actions to separate component
const VehiclesScreen = () => {
  const t = useTranslation('VehiclesScreen')
  const { isModalVisible, openModal, closeModal, toggleModal } = useModal()

  const { vehicles, deleteVehicle, setDefaultVehicle } = useVehicles()

  const [activeVehicle, setActiveVehicle] = useState<null | string>(null)

  const bottomSheetRef = useRef<BottomSheet>(null)

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    [],
  )

  const handleContextMenuPress = (licencePlate: string) => {
    setActiveVehicle(licencePlate)
    bottomSheetRef.current?.expand()
  }

  const handleActionDelete = () => {
    bottomSheetRef.current?.close()
    openModal()
  }

  const handleActionSetDefault = () => {
    if (activeVehicle) {
      setDefaultVehicle(activeVehicle)
    }
    bottomSheetRef.current?.close()
  }

  const handleConfirmDelete = () => {
    if (activeVehicle) {
      deleteVehicle(activeVehicle)
    }
    closeModal()
  }

  return (
    <ScreenView title={t('title')}>
      <ScreenContent>
        <Field label={t('myVehicles')}>
          <FlatList
            data={vehicles}
            keyExtractor={(vehicle) => vehicle.licencePlate}
            ItemSeparatorComponent={() => <Divider dividerClassname="bg-transparent h-1" />}
            renderItem={({ item, index }) => (
              <VehicleRow
                vehicle={item}
                onContextMenuPress={() => handleContextMenuPress(item.licencePlate)}
                isDefault={index === 0}
              />
            )}
            ListEmptyComponent={() => <NoVehicles />}
          />
        </Field>

        <Link href="/vehicles/add-vehicle" asChild>
          <Button>{t('addVehicle')}</Button>
        </Link>
      </ScreenContent>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        enableDynamicSizing
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <BottomSheetContent>
          <PressableStyled onPress={handleActionSetDefault}>
            <ActionRow startIcon="check-circle" label={t('actions.saveAsDefault')} />
          </PressableStyled>

          <Divider />

          <PressableStyled onPress={handleActionDelete}>
            <ActionRow startIcon="delete" label={t('actions.deleteVehicle')} variant="negative" />
          </PressableStyled>
        </BottomSheetContent>
      </BottomSheet>

      <Modal visible={isModalVisible} onRequestClose={toggleModal}>
        <ModalContentWithActions
          variant="error"
          title={t('deleteVehicleConfirmModal.title')}
          text={t('deleteVehicleConfirmModal.message', { licencePlate: activeVehicle })}
          primaryActionLabel={t('deleteVehicleConfirmModal.actionConfirm')}
          primaryActionOnPress={handleConfirmDelete}
          secondaryActionLabel={t('deleteVehicleConfirmModal.actionReject')}
          secondaryActionOnPress={closeModal}
        />
      </Modal>
    </ScreenView>
  )
}

export default VehiclesScreen
