import { Link, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { FlatList, View } from 'react-native'

import { LICENCE_PLATE_MAX_LENGTH } from '@/app/(app)/vehicles/add-vehicle'
import VehicleRow from '@/components/controls/vehicles/VehicleRow'
import TextInput from '@/components/inputs/TextInput'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import AccessibilityField from '@/components/shared/AccessibilityField'
import Button from '@/components/shared/Button'
import Divider from '@/components/shared/Divider'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { usePurchaseStoreContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreContext'
import { usePurchaseStoreUpdateContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreUpdateContext'
import { useVehiclesStoreContext } from '@/state/VehiclesStoreProvider/useVehiclesStoreContext'
import { sanitizeLicencePlate } from '@/utils/licencePlate'

const ChooseVehicleScreen = () => {
  const { t } = useTranslation()
  const { vehicle } = usePurchaseStoreContext()
  const { vehicles, isVehiclePresent, getVehicle } = useVehiclesStoreContext()

  const [oneTimeLicencePlate, setOneTimeLicencePlate] = useState(
    vehicle?.isOneTimeUse ? vehicle.vehiclePlateNumber : '',
  )
  const [oneTimeLicencePlateError, setOneTimeLicencePlateError] = useState('')

  const onPurchaseStoreUpdate = usePurchaseStoreUpdateContext()

  const handleChoseVehicle = (id?: number) => {
    const apiVehicle = getVehicle(id)
    if (id && apiVehicle) {
      onPurchaseStoreUpdate({ vehicle: apiVehicle })
    } else if (oneTimeLicencePlate) {
      onPurchaseStoreUpdate({
        vehicle: { isOneTimeUse: true, vehiclePlateNumber: oneTimeLicencePlate },
      })
    }
    router.navigate('/purchase')
  }

  const handleLicencePlateChange = (newLicencePlate: string) => {
    setOneTimeLicencePlate(newLicencePlate)

    const newSanitizedLicencePlate = sanitizeLicencePlate(newLicencePlate)

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
            disabled={
              !!oneTimeLicencePlateError ||
              !((vehicle && !vehicle?.isOneTimeUse) || oneTimeLicencePlate)
            }
            onPress={() => handleChoseVehicle()}
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
            autoCapitalize="characters"
            autoCorrect={false}
            value={oneTimeLicencePlate}
            onChangeText={handleLicencePlateChange}
            hasError={!!oneTimeLicencePlateError}
            maxLength={LICENCE_PLATE_MAX_LENGTH}
          />
        </AccessibilityField>

        <View className="flex flex-row items-center">
          <Divider dividerClassname="grow" />
          <Typography className="px-4">{t('VehiclesScreen.chooseOtherOption')}</Typography>
          <Divider dividerClassname="grow" />
        </View>

        <View className="flex-1 g-2">
          <Typography variant="default-bold">{t('VehiclesScreen.savedVehicles')}</Typography>

          <FlatList
            data={vehicles}
            keyExtractor={({ id }) => id.toString()}
            ItemSeparatorComponent={() => <Divider dividerClassname="bg-transparent h-2" />}
            renderItem={({ item: vehicleItem }) => (
              <PressableStyled onPress={() => handleChoseVehicle(vehicleItem.id)}>
                <VehicleRow vehicle={vehicleItem} selected={vehicle?.id === vehicleItem.id} />
              </PressableStyled>
            )}
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
    </ScreenView>
  )
}

export default ChooseVehicleScreen
