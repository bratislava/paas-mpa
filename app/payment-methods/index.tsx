import React from 'react'

import BonusCardMethod from '@/components/controls/payment-methods/BonusCardMethod'
import PaymentGateMethod from '@/components/controls/payment-methods/PaymentGateMethod'
import VisitorCardMethod from '@/components/controls/payment-methods/VisitorCardMethod'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'

// TODO
const Page = () => {
  const t = useTranslation('PaymentMethods')

  return (
    <ScreenView title={t('title')}>
      <ScreenContent>
        <Typography variant="h1">TODO</Typography>
        <PaymentGateMethod />
        <VisitorCardMethod />
        <BonusCardMethod />
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
