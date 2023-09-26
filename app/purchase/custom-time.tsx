import React from 'react'

import TextInput from '@/components/inputs/TextInput'
import Field from '@/components/shared/Field'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'

const Page = () => {
  const t = useTranslation('PurchaseScreen')

  return (
    <ScreenView title={t('customParkingTimeTitle')}>
      <ScreenContent>
        <Typography>TODO set custom time after confirm</Typography>
        <Typography>TODO datetime picker</Typography>
        <Field label="Temporary field: custom time in minutes">
          <TextInput keyboardType="numeric" />
        </Field>
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
