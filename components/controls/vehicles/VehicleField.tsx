import { Link } from 'expo-router'
import React from 'react'

import VehicleFieldControl from '@/components/controls/vehicles/VehicleFieldControl'
import Field from '@/components/shared/Field'
import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import Panel from '@/components/shared/Panel'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { Vehicle } from '@/hooks/useVehiclesStorage'

type Props = {
  vehicle: Vehicle | null | undefined
}

const VehicleField = ({ vehicle }: Props) => {
  const t = useTranslation('VehiclesScreen')

  return (
    <Field label={t('chooseVehicleFieldLabel')}>
      {/* TODO Link+Pressable */}
      <Link asChild href="/purchase/choose-vehicle">
        <PressableStyled>
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
        </PressableStyled>
      </Link>
    </Field>
  )
}

export default VehicleField
