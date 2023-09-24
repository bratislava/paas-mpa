import { Link, Stack } from 'expo-router'
import React from 'react'
import { FlatList, Pressable } from 'react-native'

import NoVehicles from '@/components/controls/vehicles/NoVehicles'
import VehicleRow from '@/components/controls/vehicles/VehicleRow'
import Button from '@/components/shared/Button'
import Divider from '@/components/shared/Divider'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import { useTranslation } from '@/hooks/useTranslation'
import { useVehicles } from '@/hooks/useVehicles'

const ChooseVehicleScreen = () => {
  const t = useTranslation('VehiclesScreen')
  const { vehicles } = useVehicles()

  return (
    <ScreenView>
      <Stack.Screen options={{ title: 'Vehicles' }} />
      <ScreenContent>
        <FlatList
          data={vehicles}
          keyExtractor={(vehicle) => vehicle.licencePlate}
          ItemSeparatorComponent={() => <Divider dividerClassname="bg-transparent h-1" />}
          renderItem={({ item }) => (
            <Link asChild href={`/purchase?licencePlate=${item.licencePlate}`}>
              <Pressable className="active:opacity-50">
                <VehicleRow vehicle={item} />
              </Pressable>
            </Link>
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
