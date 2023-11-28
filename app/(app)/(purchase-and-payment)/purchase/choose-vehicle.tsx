import { Link, router } from 'expo-router'
import { FlatList } from 'react-native'

import VehicleRow from '@/components/controls/vehicles/VehicleRow'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Button from '@/components/shared/Button'
import Divider from '@/components/shared/Divider'
import PressableStyled from '@/components/shared/PressableStyled'
import { useTranslation } from '@/hooks/useTranslation'
import { useVehicles } from '@/hooks/useVehicles'
import { usePurchaseStoreContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreContext'
import { usePurchaseStoreUpdateContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreUpdateContext'

const ChooseVehicleScreen = () => {
  const t = useTranslation('VehiclesScreen')

  const { licencePlate } = usePurchaseStoreContext()
  const onPurchaseStoreUpdate = usePurchaseStoreUpdateContext()

  const { vehicles } = useVehicles()

  const handleChoseVehicle = (newLicencePlate: string) => {
    onPurchaseStoreUpdate({ licencePlate: newLicencePlate })
    router.push('/purchase')
  }

  return (
    <ScreenView title={t('title')}>
      <ScreenContent>
        <FlatList
          data={vehicles}
          keyExtractor={(vehicle) => vehicle.licencePlate}
          ItemSeparatorComponent={() => <Divider dividerClassname="bg-transparent h-1" />}
          renderItem={({ item: vehicleItem }) => (
            <PressableStyled onPress={() => handleChoseVehicle(vehicleItem.licencePlate)}>
              <VehicleRow
                vehicle={vehicleItem}
                selected={licencePlate === vehicleItem.licencePlate}
              />
            </PressableStyled>
          )}
        />
        <Link asChild href="/vehicles/add-vehicle">
          <Button variant="plain-dark" startIcon="add-circle-outline">
            {t('addVehicle')}
          </Button>
        </Link>
      </ScreenContent>
    </ScreenView>
  )
}

export default ChooseVehicleScreen
