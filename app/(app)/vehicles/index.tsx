import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
} from '@gorhom/bottom-sheet'
import { Link, router } from 'expo-router'
import { useCallback, useRef, useState } from 'react'
import { FlatList } from 'react-native'

import NoVehicles from '@/components/controls/vehicles/NoVehicles'
import SkeletonVehicleRow from '@/components/controls/vehicles/SkeletonVehicleRow'
import VehicleRow from '@/components/controls/vehicles/VehicleRow'
import ActionRow from '@/components/list-rows/ActionRow'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import Modal from '@/components/screen-layout/Modal/Modal'
import ModalContentWithActions from '@/components/screen-layout/Modal/ModalContentWithActions'
import { useModal } from '@/components/screen-layout/Modal/useModal'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Divider from '@/components/shared/Divider'
import Field from '@/components/shared/Field'
import IconButton from '@/components/shared/IconButton'
import PressableStyled from '@/components/shared/PressableStyled'
import { useTranslation } from '@/hooks/useTranslation'
import { usePurchaseStoreContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreContext'
import { usePurchaseStoreUpdateContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreUpdateContext'
import { useVehiclesStoreContext } from '@/state/VehiclesStoreProvider/useVehiclesStoreContext'

// TODO consider moving whole Delete modal with actions to separate component
const VehiclesScreen = () => {
  const { t } = useTranslation()
  const { isModalVisible, openModal, closeModal, toggleModal } = useModal()

  const { vehicles, deleteVehicle, defaultVehicle, setDefaultVehicle, isInitialLoading } =
    useVehiclesStoreContext()
  const { vehicle } = usePurchaseStoreContext()
  const onPurchaseStoreUpdate = usePurchaseStoreUpdateContext()

  const [activeVehicleId, setActiveVehicleId] = useState<null | number>(null)
  const activeVehicleLicencePlate = vehicles.find(
    ({ id }) => id === activeVehicleId,
  )?.vehiclePlateNumber

  const bottomSheetRef = useRef<BottomSheetModal>(null)

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    [],
  )

  const handleContextMenuPress = (id: number) => {
    setActiveVehicleId(id)
    bottomSheetRef.current?.present()
  }

  const handleActionDelete = () => {
    bottomSheetRef.current?.close()
    openModal()
  }

  const handleActionEdit = () => {
    if (activeVehicleId) {
      router.push({ pathname: `/vehicles/edit-vehicle`, params: { vehicleId: activeVehicleId } })
    }
    bottomSheetRef.current?.close()
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

  if (isInitialLoading) {
    return (
      <ScreenView title={t('VehiclesScreen.title')}>
        <ScreenContent>
          <SkeletonVehicleRow />
        </ScreenContent>
      </ScreenView>
    )
  }

  if (vehicles.length === 0) {
    return <NoVehicles />
  }

  return (
    <ScreenView
      title={t('VehiclesScreen.title')}
      options={{
        headerTransparent: false,
        headerRight: () => (
          <Link asChild href="/vehicles/add-vehicle">
            <IconButton name="add" accessibilityLabel={t('VehiclesScreen.addVehicle')} />
          </Link>
        ),
      }}
    >
      <ScreenContent>
        {defaultVehicle ? (
          <Field label={t('VehiclesScreen.myDefaultVehicle')}>
            <VehicleRow
              vehicle={defaultVehicle}
              onContextMenuPress={() => handleContextMenuPress(defaultVehicle.id)}
            />
          </Field>
        ) : null}

        {vehicles.length > (defaultVehicle ? 1 : 0) ? (
          <Field className="flex-1" label={t('VehiclesScreen.myOtherVehicles')}>
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
      </ScreenContent>

      <BottomSheetModal
        ref={bottomSheetRef}
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

          <PressableStyled onPress={handleActionEdit}>
            <ActionRow startIcon="edit" label={t('VehiclesScreen.editVehicle')} />
          </PressableStyled>

          <Divider />

          <PressableStyled onPress={handleActionDelete}>
            <ActionRow startIcon="delete" label={t('actions.deleteVehicle')} variant="negative" />
          </PressableStyled>
        </BottomSheetContent>
      </BottomSheetModal>

      <Modal visible={isModalVisible} onRequestClose={toggleModal}>
        <ModalContentWithActions
          variant="error"
          title={t('deleteVehicleConfirmModal.title')}
          text={t('deleteVehicleConfirmModal.message', { licencePlate: activeVehicleLicencePlate })}
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
