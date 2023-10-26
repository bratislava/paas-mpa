import { Link, router } from 'expo-router'
import React from 'react'
import { FlatList } from 'react-native'

import NoVehicles from '@/components/controls/vehicles/NoVehicles'
import VehicleRow from '@/components/controls/vehicles/VehicleRow'
import Button from '@/components/shared/Button'
import Divider from '@/components/shared/Divider'
import PressableStyled from '@/components/shared/PressableStyled'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import { useTranslation } from '@/hooks/useTranslation'
import { useVehicles } from '@/hooks/useVehicles'
import { useGlobalStoreContext } from '@/state/GlobalStoreProvider/useGlobalStoreContext'

const ChooseVehicleScreen = () => {
  const t = useTranslation('VehiclesScreen')

  const { ticketPriceRequest, setTicketPriceRequest } = useGlobalStoreContext()
  const { vehicles } = useVehicles()

  const handleChoseVehicle = (ecv: string) => {
    setTicketPriceRequest({
      ...ticketPriceRequest,
      ecv,
    })
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
                selected={ticketPriceRequest?.ecv === vehicleItem.licencePlate}
              />
            </PressableStyled>
          )}
          ListEmptyComponent={() => <NoVehicles />}
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
