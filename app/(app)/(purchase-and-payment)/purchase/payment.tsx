import clsx from 'clsx'
import { useLocalSearchParams } from 'expo-router'
import { useRef, useState } from 'react'
import { WebView } from 'react-native-webview'

import LoadingScreen from '@/components/screen-layout/LoadingScreen'
import ScreenView from '@/components/screen-layout/ScreenView'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'

export type PaymentSearchParams = {
  paymentUrl: string
}

// disabled links to prevent user from navigating away from payment gateway
const invalidPaymentGatewayLinks = ['globalpaymentsinc.com']

const PaymentScreen = () => {
  const t = useTranslation('PurchaseScreen')
  const { paymentUrl } = useLocalSearchParams<PaymentSearchParams>()
  const [isLoaded, setIsLoaded] = useState(false)

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
      {isLoaded ? null : <LoadingScreen />}

      <WebView
        ref={webviewRef}
        source={{ uri: paymentUrlDecoded }}
        onLoad={() => setIsLoaded(true)}
        className={clsx('flex-1', { hidden: !isLoaded })}
        onNavigationStateChange={(e) => {
          // if user navigates by clicking link to invalid link, stop loading and go back to previous page (gateway)
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
