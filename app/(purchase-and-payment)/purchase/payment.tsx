import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { WebView } from 'react-native-webview'

import Typography from '@/components/shared/Typography'

type PaymentSearchParams = {
  paymentUrl: string
}

const Payment = () => {
  const { paymentUrl } = useLocalSearchParams<PaymentSearchParams>()

  if (!paymentUrl) {
    return <Typography>No payment initiated.</Typography>
  }

  const paymentUrlDecoded = decodeURI(paymentUrl)

  if (!paymentUrlDecoded) {
    return <Typography>Invalid payment url.</Typography>
  }

  return <WebView source={{ uri: paymentUrlDecoded }} className="flex-1" />
}

export default Payment
