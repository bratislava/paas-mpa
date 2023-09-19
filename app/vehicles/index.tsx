import { Link } from 'expo-router'

import Button from '@/components/shared/Button'
import Screen from '@/components/shared/Screen'
import ScreenContent from '@/components/shared/ScreenContent'
import Typography from '@/components/shared/Typography'
import { storage } from '@/utils/mmkv'

const VehiclesScreen = () => {
  const jsonVehicles = storage.getString('vehicles')
  const vehicles = jsonVehicles ? JSON.parse(jsonVehicles) : []
  console.log(vehicles)

  return (
    <Screen>
      <ScreenContent>
        <Typography variant="default-bold">Vozidla</Typography>
        {/* {vehicles.map((vehicle) => ( */}
        {/*   <Surface> */}
        {/*     <Typography>{vehicle.licencePlate}</Typography> */}
        {/*   </Surface> */}
        {/* ))} */}

        <Link href="/vehicles/add-vehicle" asChild>
          <Button title="Add vehicle" />
        </Link>
      </ScreenContent>
    </Screen>
  )
}

export default VehiclesScreen
