import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { WebView } from 'react-native-webview'

import ScreenView from '@/components/screen-layout/ScreenView'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'

type PaymentSearchParams = {
  paymentUrl: string
}

// TODO wrap also invalid states into ScreenView (this adds title)
const PaymentScreen = () => {
  const t = useTranslation('PurchaseScreen')
  const { paymentUrl } = useLocalSearchParams<PaymentSearchParams>()

  if (!paymentUrl) {
    return <Typography>No payment initiated.</Typography>
  }

  const paymentUrlDecoded = decodeURI(paymentUrl)

  if (!paymentUrlDecoded) {
    return <Typography>Invalid payment url.</Typography>
  }

  return (
    <ScreenView title={t('titlePayment')}>
      <WebView source={{ uri: paymentUrlDecoded }} className="flex-1" />
    </ScreenView>
  )
}

export default PaymentScreen
