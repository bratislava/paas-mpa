import React from 'react'

import BonusCardMethod from '@/components/controls/payment-methods/BonusCardMethod'
import PaymentGate from '@/components/controls/payment-methods/PaymentGate'
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
        <PaymentGate />
        <VisitorCardMethod />
        <BonusCardMethod />
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
