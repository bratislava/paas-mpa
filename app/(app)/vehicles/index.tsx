import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
} from '@gorhom/bottom-sheet'
import { Link, router } from 'expo-router'
import { useCallback, useRef, useState } from 'react'
import { SectionList, View } from 'react-native'
import { useReducedMotion } from 'react-native-reanimated'

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
import IconButton from '@/components/shared/IconButton'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { usePurchaseStoreContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreContext'
import { usePurchaseStoreUpdateContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreUpdateContext'
import { useVehiclesStoreContext } from '@/state/VehiclesStoreProvider/useVehiclesStoreContext'
import { cn } from '@/utils/cn'
import { isDefined } from '@/utils/isDefined'

// TODO consider moving whole Delete modal with actions to separate component
const VehiclesScreen = () => {
  const { t } = useTranslation()
  const { isModalVisible, openModal, closeModal, toggleModal } = useModal()
  const reducedMotion = useReducedMotion()

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

  const sections = [
    {
      title: t('VehiclesScreen.myDefaultVehicle'),
      data: [defaultVehicle].filter(isDefined),
    },
    {
      title: t('VehiclesScreen.myOtherVehicles'),
      data: vehicles.filter(({ id }) => id !== defaultVehicle?.id),
    },
  ]

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
      <View className="flex-1">
        <SectionList
          sections={sections}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section }) =>
            section.data.length > 0 ? (
              // Add padding only if it's not the first section, TODO find cleaner solution
              <View className={cn({ 'mt-5': section.title !== sections[0].title })}>
                <Typography variant="default-bold">{section.title}</Typography>
              </View>
            ) : null
          }
          className="p-5"
          renderItem={({ item }) => (
            <VehicleRow vehicle={item} onContextMenuPress={() => handleContextMenuPress(item.id)} />
          )}
          ItemSeparatorComponent={() => <Divider className="h-1 bg-transparent" />}
          // SectionSeparatorComponent is added above and below section header, so we add only h-1 height and use workaround with top margin in renderSectionHeader
          SectionSeparatorComponent={() => <Divider className="h-1 bg-transparent" />}
        />
      </View>

      <BottomSheetModal
        ref={bottomSheetRef}
        enableDynamicSizing
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        animateOnMount={!reducedMotion}
      >
        <BottomSheetContent>
          {activeVehicleId === defaultVehicle?.id ? null : (
            <>
              <PressableStyled onPress={handleActionSetDefault}>
                <ActionRow
                  startIcon="check-circle"
                  label={t('VehiclesScreen.actions.saveAsDefault')}
                />
              </PressableStyled>

              <Divider />
            </>
          )}

          <PressableStyled onPress={handleActionEdit}>
            <ActionRow startIcon="edit" label={t('VehiclesScreen.actions.editVehicle')} />
          </PressableStyled>

          <Divider />

          <PressableStyled onPress={handleActionDelete}>
            <ActionRow
              startIcon="delete"
              label={t('VehiclesScreen.actions.deleteVehicle')}
              variant="negative"
            />
          </PressableStyled>
        </BottomSheetContent>
      </BottomSheetModal>

      <Modal visible={isModalVisible} onRequestClose={toggleModal}>
        <ModalContentWithActions
          variant="error"
          title={t('VehiclesScreen.deleteVehicleConfirmModal.title')}
          text={t('VehiclesScreen.deleteVehicleConfirmModal.message', {
            licencePlate: activeVehicleLicencePlate,
          })}
          primaryActionLabel={t('VehiclesScreen.deleteVehicleConfirmModal.actionConfirm')}
          primaryActionOnPress={handleConfirmDelete}
          secondaryActionLabel={t('VehiclesScreen.deleteVehicleConfirmModal.actionReject')}
          secondaryActionOnPress={closeModal}
        />
      </Modal>
    </ScreenView>
  )
}

export default VehiclesScreen
