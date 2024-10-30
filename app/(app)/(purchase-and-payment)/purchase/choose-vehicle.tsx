import { Link, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { View } from 'react-native'

import { LICENCE_PLATE_MAX_LENGTH } from '@/app/(app)/vehicles/add-vehicle'
import SkeletonVehicleRow from '@/components/controls/vehicles/SkeletonVehicleRow'
import VehicleRow from '@/components/controls/vehicles/VehicleRow'
import { LicencePlateFormatWarningPanel } from '@/components/info/LicencePlateFormatWarningPanel'
import TextInput from '@/components/inputs/TextInput'
import Modal from '@/components/screen-layout/Modal/Modal'
import ModalContentWithActions from '@/components/screen-layout/Modal/ModalContentWithActions'
import { useModal } from '@/components/screen-layout/Modal/useModal'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import AccessibilityField from '@/components/shared/AccessibilityField'
import Button from '@/components/shared/Button'
import Divider from '@/components/shared/Divider'
import { List } from '@/components/shared/List/List'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { usePurchaseStoreContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreContext'
import { usePurchaseStoreUpdateContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreUpdateContext'
import { useVehiclesStoreContext } from '@/state/VehiclesStoreProvider/useVehiclesStoreContext'
import { isStandardFormat, sanitizeLicencePlate } from '@/utils/licencePlate'

const ChooseVehicleScreen = () => {
  const { t } = useTranslation()
  const { vehicle } = usePurchaseStoreContext()
  const { vehicles, isVehiclePresent, getVehicle, vehiclesQuery } = useVehiclesStoreContext()
  const { isModalVisible, openModal, closeModal } = useModal()

  const [oneTimeLicencePlate, setOneTimeLicencePlate] = useState(
    vehicle?.isOneTimeUse ? vehicle.vehiclePlateNumber : '',
  )
  const [oneTimeLicencePlateError, setOneTimeLicencePlateError] = useState('')

  const onPurchaseStoreUpdate = usePurchaseStoreUpdateContext()

  const handleContinueWithOneTimeVehicle = () => {
    onPurchaseStoreUpdate({
      vehicle: { isOneTimeUse: true, vehiclePlateNumber: oneTimeLicencePlate },
    })
    router.navigate('/purchase')
  }

  const loadMore = () => {
    if (vehiclesQuery.hasNextPage) {
      vehiclesQuery.fetchNextPage()
    }
  }

  const handleChooseOneTimeVehicle = () => {
    if (isStandardFormat(oneTimeLicencePlate)) {
      handleContinueWithOneTimeVehicle()
    } else {
      openModal()
    }
  }

  const handleChooseVehicle = (id?: number) => {
    const apiVehicle = getVehicle(id)
    if (id && apiVehicle) {
      onPurchaseStoreUpdate({ vehicle: apiVehicle })
      router.navigate('/purchase')
    } else if (oneTimeLicencePlate) {
      handleChooseOneTimeVehicle()
    }
  }

  const handleLicencePlateChange = (newLicencePlate: string) => {
    const newSanitizedLicencePlate = sanitizeLicencePlate(newLicencePlate)
    setOneTimeLicencePlate(newSanitizedLicencePlate)
    setOneTimeLicencePlateError('')

    if (isVehiclePresent(newSanitizedLicencePlate)) {
      setOneTimeLicencePlateError(t('VehiclesScreen.licencePlateDuplicate'))
    }
  }

  return (
    <ScreenView
      title={t('VehiclesScreen.title')}
      options={{
        presentation: 'modal',
        headerRight: () => (
          <Button
            variant="plain"
            testID="chooseVehicle"
            disabled={
              !!oneTimeLicencePlateError ||
              !((vehicle && !vehicle?.isOneTimeUse) || oneTimeLicencePlate)
            }
            onPress={() => handleChooseVehicle()}
          >
            {t('VehiclesScreen.oneTimeAction')}
          </Button>
        ),
      }}
    >
      {/* Native modals have dark backgrounds on iOS, set the status bar to light content. */}
      {/* eslint-disable-next-line react/style-prop-object */}
      <StatusBar style="light" />

      <ScreenContent>
        <AccessibilityField
          label={t('VehiclesScreen.oneTimeUse')}
          errorMessage={oneTimeLicencePlateError}
        >
          <TextInput
            testID="oneTimeVehiclePlate"
            autoCapitalize="characters"
            autoCorrect={false}
            value={oneTimeLicencePlate}
            onChangeText={handleLicencePlateChange}
            hasError={!!oneTimeLicencePlateError}
            maxLength={LICENCE_PLATE_MAX_LENGTH}
          />
        </AccessibilityField>

        <View className="flex flex-row items-center">
          <Divider className="grow" />
          <Typography className="px-4">{t('VehiclesScreen.chooseOtherOption')}</Typography>
          <Divider className="grow" />
        </View>

        <View className="flex-1 g-2">
          <Typography variant="default-bold">{t('VehiclesScreen.savedVehicles')}</Typography>

          <List
            estimatedItemSize={63}
            data={vehicles}
            keyExtractor={({ id }) => id.toString()}
            ItemSeparatorComponent={() => <Divider className="h-2 bg-transparent" />}
            renderItem={({ item: vehicleItem }) => (
              <PressableStyled onPress={() => handleChooseVehicle(vehicleItem.id)}>
                <VehicleRow vehicle={vehicleItem} selected={vehicle?.id === vehicleItem.id} />
              </PressableStyled>
            )}
            onEndReachedThreshold={0.2}
            ListFooterComponent={vehiclesQuery.isFetchingNextPage ? <SkeletonVehicleRow /> : null}
            onEndReached={loadMore}
          />

          <View className="items-start">
            <Link asChild href="/vehicles/add-vehicle">
              <Button variant="plain-dark" startIcon="add-circle-outline">
                {t('VehiclesScreen.addNewVehicle')}
              </Button>
            </Link>
          </View>
        </View>
      </ScreenContent>

      <Modal visible={isModalVisible} onRequestClose={closeModal}>
        <ModalContentWithActions
          variant="success"
          title={t('VehiclesScreen.useVehicleConfirmModal.title')}
          text={t('VehiclesScreen.useVehicleConfirmModal.message', {
            licencePlate: oneTimeLicencePlate,
          })}
          hideAvatar
          primaryActionLabel={t('VehiclesScreen.useVehicleConfirmModal.actionConfirm')}
          primaryActionOnPress={handleContinueWithOneTimeVehicle}
          secondaryActionLabel={t('Common.cancel')}
          secondaryActionOnPress={closeModal}
        >
          <LicencePlateFormatWarningPanel />
        </ModalContentWithActions>
      </Modal>
    </ScreenView>
  )
}

export default ChooseVehicleScreen
