import React from 'react'
import { ScrollView } from 'react-native'

import MethodsField from '@/components/controls/payment-methods/MethodsField'
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
          <MethodsField />

          <Divider />

          <VisitorCardsField />
        </ScreenContent>
      </ScrollView>
    </ScreenView>
  )
}

export default Page
