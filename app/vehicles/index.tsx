import { Link } from 'expo-router'

import Button from '@/components/shared/Button'
import Screen from '@/components/shared/Screen'
import ScreenContent from '@/components/shared/ScreenContent'
import Surface from '@/components/shared/Surface'
import Typography from '@/components/shared/Typography'
import { useStorageVehicles } from '@/hooks/useStorageVehicles'

const VehiclesScreen = () => {
  const [vehicles] = useStorageVehicles()

  return (
    <Screen>
      <ScreenContent>
        <Typography variant="default-bold">Vozidla</Typography>
        {vehicles?.map((vehicle) => (
          <Surface>
            <Typography variant="default-bold">{vehicle.licencePlate}</Typography>
            <Typography>{vehicle.vehicleName}</Typography>
          </Surface>
        ))}

        <Link href="/vehicles/add-vehicle" asChild>
          <Button title="Add vehicle" />
        </Link>
      </ScreenContent>
    </Screen>
  )
}

export default VehiclesScreen
