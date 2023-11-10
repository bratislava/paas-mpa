import React from 'react'
import { ScrollView } from 'react-native'

import PaymentOptionsField from '@/components/controls/payment-methods/PaymentOptionsField'
import VisitorCardsField from '@/components/controls/payment-methods/VisitorCardsField'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Divider from '@/components/shared/Divider'
import { useTranslation } from '@/hooks/useTranslation'

const Page = () => {
  const t = useTranslation('PaymentMethods')

  return (
    <ScreenView title={t('title')}>
      <ScrollView>
        <ScreenContent>
          <PaymentOptionsField />

          <Divider />

          <VisitorCardsField />
        </ScreenContent>
      </ScrollView>
    </ScreenView>
  )
}

export default Page
