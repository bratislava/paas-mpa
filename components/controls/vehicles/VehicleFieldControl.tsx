import VehicleRow from '@/components/controls/vehicles/VehicleRow'
import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { VehicleDto } from '@/modules/backend/openapi-generated'
import { PurchaseContextVehicle } from '@/state/PurchaseStoreProvider/PurchaseStoreProvider'

type Props = {
  vehicle: VehicleDto | PurchaseContextVehicle | null | undefined
  hasError?: boolean
}

const VehicleFieldControl = ({ vehicle, hasError }: Props) => {
  const t = useTranslation('VehiclesScreen')

  return vehicle ? (
    <VehicleRow vehicle={vehicle} showControlChevron />
  ) : (
    <Panel className={hasError ? 'border border-negative bg-negative-light' : undefined}>
      <FlexRow>
        <Typography variant="default-bold">{t('addVehicle')}</Typography>
        <Icon name="add" />
      </FlexRow>
    </Panel>
  )
}

export default VehicleFieldControl
