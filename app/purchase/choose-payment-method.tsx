import { Link, useLocalSearchParams } from 'expo-router'
import React from 'react'

import { PurchaseSearchParams } from '@/app/purchase/index'
import PaymentGateMethod from '@/components/controls/payment-methods/PaymentGateMethod'
import PressableStyled from '@/components/shared/PressableStyled'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import { useTranslation } from '@/hooks/useTranslation'

const Page = () => {
  const t = useTranslation('PaymentMethods')
  const searchParams = useLocalSearchParams<PurchaseSearchParams>()

  return (
    <ScreenView title={t('title')}>
      <ScreenContent>
        <Link asChild href={{ pathname: '/purchase', params: searchParams }}>
          <PressableStyled>
            <PaymentGateMethod selected />
          </PressableStyled>
        </Link>
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
