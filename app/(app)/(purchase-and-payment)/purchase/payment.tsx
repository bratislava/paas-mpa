import { useLocalSearchParams } from 'expo-router'
import React, { useRef } from 'react'
import { WebView } from 'react-native-webview'

import ScreenView from '@/components/screen-layout/ScreenView'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'

export type PaymentSearchParams = {
  paymentUrl: string
}

// disabled links to prevent user from navigating away from payment gateway
const invalidPaymentGatewayLinks = ['globalpaymentsinc.com']

// TODO wrap also invalid states into ScreenView (this adds title)
const PaymentScreen = () => {
  const t = useTranslation('PurchaseScreen')
  const { paymentUrl } = useLocalSearchParams<PaymentSearchParams>()

  const webviewRef = useRef<WebView>(null)

  if (!paymentUrl) {
    return (
      <ScreenView title={t('titleInvalidPaymentLink')}>
        <Typography className="mt-5 text-center">{t('noPaymentInitiated')}</Typography>
      </ScreenView>
    )
  }

  const paymentUrlDecoded = decodeURI(paymentUrl)

  if (!paymentUrlDecoded) {
    return (
      <ScreenView title={t('titleInvalidPaymentLink')}>
        <Typography className="mt-5 text-center">{t('invalidPaymentLink')}</Typography>
      </ScreenView>
    )
  }

  return (
    <ScreenView title={t('titlePayment')}>
      <WebView
        ref={webviewRef}
        source={{ uri: paymentUrlDecoded }}
        className="flex-1"
        onNavigationStateChange={(e) => {
          if (invalidPaymentGatewayLinks.some((url) => e.url.includes(url))) {
            webviewRef.current?.stopLoading()
            webviewRef.current?.goBack()
          }
        }}
      />
    </ScreenView>
  )
}

export default PaymentScreen
