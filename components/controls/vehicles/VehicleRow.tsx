import React from 'react'
import { View } from 'react-native'

import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import IconButton from '@/components/shared/IconButton'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { VehicleDto } from '@/modules/backend/openapi-generated'
import { clsx } from '@/utils/clsx'
import { WithRequired } from '@/utils/types'

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
  vehicle: WithRequired<Partial<VehicleDto>, 'vehiclePlateNumber'>
} & AdditionalProps

const VehicleRow = ({ vehicle, onContextMenuPress, selected, showControlChevron }: Props) => {
  const t = useTranslation('VehiclesScreen')

  return (
    <Panel className={clsx(selected && 'border border-dark')}>
      <FlexRow className={clsx(!onContextMenuPress && 'items-center')}>
        <View>
          <Typography variant="default-bold">{vehicle.vehiclePlateNumber}</Typography>
          {vehicle.name ? <Typography>{vehicle.name}</Typography> : null}
        </View>
        {selected && <Icon name="check-circle" />}
        {showControlChevron && <Icon name="expand-more" />}
        {onContextMenuPress ? (
          <IconButton
            name="more-vert"
            accessibilityLabel={t('openVehicleContextMenu')}
            onPress={() => onContextMenuPress(vehicle.vehiclePlateNumber)}
          />
        ) : null}
      </FlexRow>
    </Panel>
  )
}

export default VehicleRow
