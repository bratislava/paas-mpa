import { Link } from 'expo-router'

import Button from '@/components/shared/Button'
import Screen from '@/components/shared/Screen'
import ScreenContent from '@/components/shared/ScreenContent'

const VehiclesScreen = () => {
  return (
    <Screen>
      <ScreenContent>
        <Link href="/vehicles/add-vehicle" asChild>
          <Button title="Add vehicle" />
        </Link>
      </ScreenContent>
    </Screen>
  )
}

export default VehiclesScreen
