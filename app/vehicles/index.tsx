import { Link } from 'expo-router'

import Button from '@/components/shared/Button'
import Field from '@/components/shared/Field'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import Surface from '@/components/shared/Surface'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { useVehiclesStorage } from '@/hooks/useVehiclesStorage'

const VehiclesScreen = () => {
  const t = useTranslation('VehiclesScreen')

  const [vehicles] = useVehiclesStorage()

  return (
    <ScreenView>
      <ScreenContent>
        <Field label={t('otherVehicles')}>
          {vehicles?.map((vehicle) => (
            <Surface key={vehicle.licencePlate}>
              <Typography variant="default-bold">{vehicle.licencePlate}</Typography>
              {vehicle.vehicleName ? <Typography>{vehicle.vehicleName}</Typography> : null}
            </Surface>
          ))}
        </Field>

        <Link href="/vehicles/add-vehicle" asChild>
          <Button title="Add vehicle" />
        </Link>
      </ScreenContent>
    </ScreenView>
  )
}

export default VehiclesScreen
