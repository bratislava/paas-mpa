import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import { Link } from 'expo-router'
import { useCallback, useRef, useState } from 'react'
import { FlatList } from 'react-native'

import NoVehicles from '@/components/controls/vehicles/NoVehicles'
import VehicleRow from '@/components/controls/vehicles/VehicleRow'
import ActionRow from '@/components/list-rows/ActionRow'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import Modal from '@/components/screen-layout/Modal/Modal'
import ModalContentWithActions from '@/components/screen-layout/Modal/ModalContentWithActions'
import { useModal } from '@/components/screen-layout/Modal/useModal'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Button from '@/components/shared/Button'
import Divider from '@/components/shared/Divider'
import Field from '@/components/shared/Field'
import PressableStyled from '@/components/shared/PressableStyled'
import { useTranslation } from '@/hooks/useTranslation'
import { useVehicles } from '@/hooks/useVehicles'
import { usePurchaseStoreContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreContext'
import { usePurchaseStoreUpdateContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreUpdateContext'

// TODO consider moving whole Delete modal with actions to separate component
const VehiclesScreen = () => {
  const t = useTranslation('VehiclesScreen')
  const { isModalVisible, openModal, closeModal, toggleModal } = useModal()

  const { vehicles, deleteVehicle, defaultVehicle, setDefaultVehicle } = useVehicles()
  const { vehicle } = usePurchaseStoreContext()
  const onPurchaseStoreUpdate = usePurchaseStoreUpdateContext()

  const [activeVehicleId, setActiveVehicleId] = useState<null | number>(null)

  const bottomSheetRef = useRef<BottomSheet>(null)

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    [],
  )

  const handleContextMenuPress = (id: number) => {
    setActiveVehicleId(id)
    bottomSheetRef.current?.expand()
  }

  const handleActionDelete = () => {
    bottomSheetRef.current?.close()
    openModal()
  }

  const handleActionSetDefault = async () => {
    if (activeVehicleId) {
      await setDefaultVehicle(activeVehicleId)
    }
    bottomSheetRef.current?.close()
  }

  const handleConfirmDelete = async () => {
    if (activeVehicleId) {
      await deleteVehicle(activeVehicleId)
      if (activeVehicleId === vehicle?.id) {
        onPurchaseStoreUpdate({ vehicle: null })
      }
    }
    closeModal()
  }

  if (vehicles.length === 0) {
    return (
      <ScreenView title={t('title')} backgroundVariant="dots">
        <NoVehicles />
      </ScreenView>
    )
  }

  return (
    <ScreenView title={t('title')}>
      <ScreenContent>
        {defaultVehicle ? (
          <Field label={t('myDefaultVehicle')}>
            <VehicleRow
              vehicle={defaultVehicle}
              onContextMenuPress={() => handleContextMenuPress(defaultVehicle.id)}
            />
          </Field>
        ) : null}

        {vehicles.length > (defaultVehicle ? 1 : 0) ? (
          <Field label={t('myOtherVehicles')}>
            <FlatList
              data={vehicles.filter(({ isDefault }) => !isDefault)}
              keyExtractor={({ id }) => id.toString()}
              ItemSeparatorComponent={() => <Divider dividerClassname="bg-transparent h-1" />}
              renderItem={({ item }) => (
                <VehicleRow
                  vehicle={item}
                  onContextMenuPress={() => handleContextMenuPress(item.id)}
                />
              )}
            />
          </Field>
        ) : null}

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
          {activeVehicleId === defaultVehicle?.id ? null : (
            <>
              <PressableStyled onPress={handleActionSetDefault}>
                <ActionRow startIcon="check-circle" label={t('actions.saveAsDefault')} />
              </PressableStyled>

              <Divider />
            </>
          )}

          <PressableStyled onPress={handleActionDelete}>
            <ActionRow startIcon="delete" label={t('actions.deleteVehicle')} variant="negative" />
          </PressableStyled>
        </BottomSheetContent>
      </BottomSheet>

      <Modal visible={isModalVisible} onRequestClose={toggleModal}>
        <ModalContentWithActions
          variant="error"
          title={t('deleteVehicleConfirmModal.title')}
          text={t('deleteVehicleConfirmModal.message', { licencePlate: activeVehicleId })}
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
