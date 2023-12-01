import { Link, router, Stack } from 'expo-router'
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
import { useVehicles } from '@/hooks/useVehicles'
import { usePurchaseStoreContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreContext'
import { usePurchaseStoreUpdateContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreUpdateContext'
import { sanitizeLicencePlate } from '@/utils/licencePlate'

const ChooseVehicleScreen = () => {
  const t = useTranslation('VehiclesScreen')
  const { licencePlate } = usePurchaseStoreContext()
  const { vehicles, isVehiclePresent, getVehicle } = useVehicles()

  const [oneTimeLicencePlate, setOneTimeLicencePlate] = useState(
    getVehicle(licencePlate)?.oneTimeUse ? licencePlate : '',
  )
  const [oneTimeLicencePlateError, setOneTimeLicencePlateError] = useState('')

  const onPurchaseStoreUpdate = usePurchaseStoreUpdateContext()

  const handleChoseVehicle = (newLicencePlate: string) => {
    onPurchaseStoreUpdate({ licencePlate: newLicencePlate })
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
    <ScreenView>
      <Stack.Screen
        options={{
          title: t('title'),
          headerRight: () => (
            <Button
              variant="plain"
              disabled={!oneTimeLicencePlate || !!oneTimeLicencePlateError}
              onPress={() => handleChoseVehicle(oneTimeLicencePlate)}
            >
              Done
            </Button>
          ),
        }}
      />
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
          <Divider dividerClassname="flex-grow" />
          <Typography className="px-4">{t('chooseOtherOption')}</Typography>
          <Divider dividerClassname="flex-grow" />
        </View>

        <View>
          <Typography variant="default-bold" className="mb-2 grow">
            {t('savedVehicles')}
          </Typography>

          <FlatList
            data={vehicles}
            keyExtractor={(vehicle) => vehicle.licencePlate}
            ItemSeparatorComponent={() => <Divider dividerClassname="bg-transparent h-2" />}
            renderItem={({ item: vehicleItem }) => (
              <PressableStyled onPress={() => handleChoseVehicle(vehicleItem.licencePlate)}>
                <VehicleRow
                  vehicle={vehicleItem}
                  selected={licencePlate === vehicleItem.licencePlate}
                />
              </PressableStyled>
            )}
          />
          <View className="mt-2 flex items-start">
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
