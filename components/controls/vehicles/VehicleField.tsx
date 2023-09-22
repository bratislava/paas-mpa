import { Link } from 'expo-router'
import React from 'react'
import { Pressable } from 'react-native'

import VehicleFieldControl from '@/components/controls/vehicles/VehicleFieldControl'
import Field from '@/components/shared/Field'
import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { Vehicle } from '@/hooks/useVehiclesStorage'

type Props = {
  vehicle: Vehicle | null | undefined
}

const VehicleField = ({ vehicle }: Props) => {
  const t = useTranslation('VehiclesScreen')

  return (
    <Field label={t('vehicleFieldLabel')}>
      <Link asChild href="/purchase/choose-vehicle">
        <Pressable className="active:opacity-50">
          {vehicle ? (
            <VehicleFieldControl vehicle={vehicle} />
          ) : (
            <Panel>
              <FlexRow>
                <Typography variant="default-bold">{t('addVehicle')}</Typography>
                <Icon name="add" />
              </FlexRow>
            </Panel>
          )}
        </Pressable>
      </Link>
    </Field>
  )
}

export default VehicleField
