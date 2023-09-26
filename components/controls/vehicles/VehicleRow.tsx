import React from 'react'

import FlexRow from '@/components/shared/FlexRow'
import IconButton from '@/components/shared/IconButton'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { Vehicle } from '@/hooks/useVehiclesStorage'

type Props = {
  vehicle: Vehicle
  onContextMenuPress?: (licencePlate: string) => void
  isDefault?: boolean
}

const VehicleRow = ({ vehicle, onContextMenuPress, isDefault }: Props) => {
  const t = useTranslation('VehiclesScreen')

  return (
    <Panel key={vehicle.licencePlate}>
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
        {onContextMenuPress ? (
          <IconButton
            name="more-vert"
            accessibilityLabel="Edit vehicle"
            onPress={() => onContextMenuPress(vehicle.licencePlate)}
          />
        ) : null}
      </FlexRow>
      {vehicle.vehicleName ? <Typography>{vehicle.vehicleName}</Typography> : null}
    </Panel>
  )
}

export default VehicleRow
