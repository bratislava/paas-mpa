import React from 'react'
import { ScrollView } from 'react-native'

import MethodsField from '@/components/controls/payment-methods/MethodsField'
import VisitorCardsField from '@/components/controls/payment-methods/VisitorCardsField'
import Divider from '@/components/shared/Divider'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import { useTranslation } from '@/hooks/useTranslation'

// TODO discuss what should be displayed on this screen
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
