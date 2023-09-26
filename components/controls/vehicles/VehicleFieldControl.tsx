import React from 'react'
import { View } from 'react-native'

import FlexRow from '@/components/shared/FlexRow'
import IconButton from '@/components/shared/IconButton'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { Vehicle } from '@/hooks/useVehiclesStorage'

type Props = {
  vehicle: Vehicle
}

const VehicleFieldControl = ({ vehicle }: Props) => {
  return (
    <Panel>
      <FlexRow cn="items-center">
        <View>
          <Typography variant="default-bold">
            {vehicle.licencePlate}
            {/* TODO */}
          </Typography>
          {vehicle.vehicleName ? <Typography>{vehicle.vehicleName}</Typography> : null}
        </View>
        <IconButton name="expand-more" accessibilityLabel="Expand more" />
      </FlexRow>
    </Panel>
  )
}

export default VehicleFieldControl
