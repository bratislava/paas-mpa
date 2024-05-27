import * as Linking from 'expo-linking'
import { router, useLocalSearchParams } from 'expo-router'
import { useRef, useState } from 'react'
import { Platform } from 'react-native'
import { WebView } from 'react-native-webview'

import { TicketPurchaseSearchParams } from '@/app/(app)/(purchase-and-payment)/ticket-purchase'
import LoadingScreen from '@/components/screen-layout/LoadingScreen'
import ScreenView from '@/components/screen-layout/ScreenView'
import { useSnackbar } from '@/components/screen-layout/Snackbar/useSnackbar'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/utils/cn'

export type PaymentSearchParams = {
  paymentUrl: string
  /**
   * `ticketId` is used to redirect to /ticket-purchase while the payment gateway is opened in browser on android
   */
  ticketId: string
}

// disabled links to prevent user from navigating away from payment gateway
const invalidPaymentGatewayLinks = ['globalpaymentsinc.com']

const PaymentScreen = () => {
  const { t } = useTranslation()
  const { show } = useSnackbar()

  const { paymentUrl, ticketId } = useLocalSearchParams<PaymentSearchParams>()
  const [isLoaded, setIsLoaded] = useState(false)

  const webviewRef = useRef<WebView>(null)

  if (!paymentUrl) {
    return (
      <ScreenView title={t('PurchaseScreen.titleInvalidPaymentLink')}>
        <Typography className="mt-5 text-center">
          {t('PurchaseScreen.noPaymentInitiated')}
        </Typography>
      </ScreenView>
    )
  }

  const paymentUrlDecoded = decodeURI(paymentUrl)

  if (!paymentUrlDecoded) {
    return (
      <ScreenView title={t('PurchaseScreen.titleInvalidPaymentLink')}>
        <Typography className="mt-5 text-center">
          {t('PurchaseScreen.invalidPaymentLink')}
        </Typography>
      </ScreenView>
    )
  }

  const redirectToPurchaseResult = () => {
    router.push({
      pathname: '/ticket-purchase',
      params: { ticketId: ticketId ?? '' } satisfies TicketPurchaseSearchParams,
    })
  }

  if (Platform.OS === 'android') {
    try {
      Linking.openURL(paymentUrlDecoded)
    } catch (error) {
      console.log(error)
      show('Unable to open payment URL.', { variant: 'danger' })
    }

    redirectToPurchaseResult()

    return null
  }

  return (
    // TODO investigate more (same issue is in about/webview.tsx)
    // WebView crashes on Android in some cases, disabling animation helps
    // https://github.com/react-native-webview/react-native-webview/issues/3052#issuecomment-1635698194
    <>
      <ScreenView
        title={t('PurchaseScreen.titlePayment')}
        // options={{ animation: Platform.OS === 'android' ? 'none' : undefined }}
      >
        <WebView
          ref={webviewRef}
          onError={redirectToPurchaseResult}
          source={{ uri: paymentUrlDecoded }}
          onLoad={() => setIsLoaded(true)}
          className={cn('flex-1', { hidden: !isLoaded })}
          onNavigationStateChange={(e) => {
            // if user navigates by clicking link to invalid link, stop loading and go back to previous page (gateway)
            if (invalidPaymentGatewayLinks.some((url) => e.url.includes(url))) {
              webviewRef.current?.stopLoading()
              webviewRef.current?.goBack()
            }
          }}
        />
      </ScreenView>

      {/* Display loading overlay until WebView is fully loaded */}
      {isLoaded ? null : <LoadingScreen className="absolute h-full w-full bg-white/50" />}
    </>
  )
}

export default PaymentScreen
