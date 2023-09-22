import React from 'react'

import VehicleRow from '@/components/controls/vehicles/VehicleRow'
import Field from '@/components/shared/Field'
import Panel from '@/components/shared/Panel'
import { useTranslation } from '@/hooks/useTranslation'
import { useVehicles } from '@/hooks/useVehicles'

const VehicleField = () => {
  const t = useTranslation('PurchaseScreen')
  const { defaultVehicle } = useVehicles()

  return (
    <Field label={t('vehicleFieldLabel')}>
      {defaultVehicle ? <VehicleRow vehicle={defaultVehicle} /> : <Panel />}
    </Field>
  )
}

export default VehicleField
