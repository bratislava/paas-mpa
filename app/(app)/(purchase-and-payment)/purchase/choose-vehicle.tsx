import { Link, router } from 'expo-router'
import { useState } from 'react'
import { FlatList, View } from 'react-native'

import VehicleRow from '@/components/controls/vehicles/VehicleRow'
import TextInput from '@/components/inputs/TextInput'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Button from '@/components/shared/Button'
import Divider from '@/components/shared/Divider'
import Field from '@/components/shared/Field'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { usePurchaseStoreContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreContext'
import { usePurchaseStoreUpdateContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreUpdateContext'
import { useVehiclesStoreContext } from '@/state/VehiclesStoreProvider/useVehiclesStoreContext'
import { sanitizeLicencePlate } from '@/utils/licencePlate'

const ChooseVehicleScreen = () => {
  const t = useTranslation('VehiclesScreen')
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
    router.push('/purchase')
  }

  const handleLicencePlateChange = (newLicencePlate: string) => {
    setOneTimeLicencePlate(newLicencePlate)

    const newSanitizedLicencePlate = sanitizeLicencePlate(newLicencePlate)

    setOneTimeLicencePlateError('')
    if (isVehiclePresent(newSanitizedLicencePlate)) {
      setOneTimeLicencePlateError(t('licencePlateDuplicate'))
    }
  }

  return (
    <ScreenView
      title={t('title')}
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
            {t('oneTimeAction')}
          </Button>
        ),
      }}
    >
      <ScreenContent>
        <Field label={t('oneTimeUse')} errorMessage={oneTimeLicencePlateError}>
          <TextInput
            autoCapitalize="characters"
            autoCorrect={false}
            value={oneTimeLicencePlate}
            onChangeText={handleLicencePlateChange}
            hasError={!!oneTimeLicencePlateError}
          />
        </Field>

        <View className="flex flex-row items-center">
          <Divider dividerClassname="grow" />
          <Typography className="px-4">{t('chooseOtherOption')}</Typography>
          <Divider dividerClassname="grow" />
        </View>

        <View className="flex-col g-2">
          <Typography variant="default-bold" className="grow">
            {t('savedVehicles')}
          </Typography>

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

          <View className="flex items-start">
            <Link asChild href="/vehicles/add-vehicle">
              <Button variant="plain-dark" startIcon="add-circle-outline">
                {t('addNewVehicle')}
              </Button>
            </Link>
          </View>
        </View>
      </ScreenContent>
    </ScreenView>
  )
}

export default ChooseVehicleScreen
