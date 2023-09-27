import { Link } from 'expo-router'
import React from 'react'

import PaymentGate from '@/components/controls/payment-methods/PaymentGate'
import PressableStyled from '@/components/shared/PressableStyled'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import { useTranslation } from '@/hooks/useTranslation'

const Page = () => {
  const t = useTranslation('PaymentMethods')

  return (
    <ScreenView title={t('title')}>
      <ScreenContent>
        <Link asChild href="/purchase">
          <PressableStyled>
            <PaymentGate selected />
          </PressableStyled>
        </Link>
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
