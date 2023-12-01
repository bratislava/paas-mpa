import React from 'react'

import VehicleRow from '@/components/controls/vehicles/VehicleRow'
import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { VehicleDto } from '@/modules/backend/openapi-generated'

type Props = {
  vehicle: VehicleDto | null | undefined
}

const VehicleFieldControl = ({ vehicle }: Props) => {
  const t = useTranslation('VehiclesScreen')

  return vehicle ? (
    <VehicleRow vehicle={vehicle} showControlChevron />
  ) : (
    <Panel>
      <FlexRow>
        <Typography variant="default-bold">{t('addVehicle')}</Typography>
        <Icon name="add" />
      </FlexRow>
    </Panel>
  )
}

export default VehicleFieldControl
