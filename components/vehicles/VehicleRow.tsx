import React from 'react'

import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import Surface from '@/components/shared/Surface'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { Vehicle } from '@/hooks/useVehiclesStorage'

type Props = {
  vehicle: Vehicle
  onContextMenuPress: (licencePlate: string) => void
  isDefault?: boolean
}

const VehicleRow = ({ vehicle, onContextMenuPress, isDefault }: Props) => {
  const t = useTranslation('VehiclesScreen')

  return (
    <Surface key={vehicle.licencePlate}>
      <FlexRow>
        <FlexRow>
          <Typography variant="default-bold">
            {vehicle.licencePlate}
            {/* TODO */}
          </Typography>
          {isDefault && (
            <Typography variant="default-bold" className="text-green">
              {t('default')}
            </Typography>
          )}
        </FlexRow>
        <Icon name="more-vert" onPress={() => onContextMenuPress(vehicle.licencePlate)} />
      </FlexRow>
      {vehicle.vehicleName ? <Typography>{vehicle.vehicleName}</Typography> : null}
    </Surface>
  )
}

export default VehicleRow
