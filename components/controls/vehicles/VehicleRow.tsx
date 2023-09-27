import clsx from 'clsx'
import React from 'react'
import { View } from 'react-native'

import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import IconButton from '@/components/shared/IconButton'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { Vehicle } from '@/hooks/useVehiclesStorage'

// Ensure that only one of these props is set at a time
type AdditionalProps =
  | {
      onContextMenuPress?: (licencePlate: string) => void
      selected?: never
      showControlChevron?: never
    }
  | {
      onContextMenuPress?: never
      selected?: boolean
      showControlChevron?: never
    }
  | {
      onContextMenuPress?: never
      selected?: never
      showControlChevron?: boolean
    }

type Props = {
  vehicle: Vehicle
} & AdditionalProps

const VehicleRow = ({ vehicle, onContextMenuPress, selected, showControlChevron }: Props) => {
  const t = useTranslation('VehiclesScreen')

  return (
    <Panel className={clsx(selected && 'border border-dark')}>
      <FlexRow cn={clsx(!onContextMenuPress && 'items-center')}>
        <View>
          <Typography variant="default-bold">{vehicle.licencePlate}</Typography>
          {vehicle.vehicleName ? <Typography>{vehicle.vehicleName}</Typography> : null}
        </View>
        {selected && <Icon name="check-circle" />}
        {showControlChevron && <Icon name="expand-more" />}
        {onContextMenuPress ? (
          <IconButton
            name="more-vert"
            accessibilityLabel={t('openVehicleContextMenu')}
            onPress={() => onContextMenuPress(vehicle.licencePlate)}
          />
        ) : null}
      </FlexRow>
    </Panel>
  )
}

export default VehicleRow
