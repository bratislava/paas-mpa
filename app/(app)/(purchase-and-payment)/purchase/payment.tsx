import { useQuery } from '@tanstack/react-query'
import { router, useLocalSearchParams } from 'expo-router'
import { useRef, useState } from 'react'
import { WebView } from 'react-native-webview'

import { TicketPurchaseSearchParams } from '@/app/(app)/(purchase-and-payment)/ticket-purchase'
import LoadingScreen from '@/components/screen-layout/LoadingScreen'
import ScreenView from '@/components/screen-layout/ScreenView'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { paymentPageOptions } from '@/modules/backend/constants/queryOptions'
import { cn } from '@/utils/cn'

export type PaymentSearchParams = {
  paymentUrl: string
  params: string
  /**
   * `ticketId` is used to redirect to /ticket-purchase while the payment gateway is opened in browser on android
   */
  ticketId: string
}

// disabled links to prevent user from navigating away from payment gateway
// TODO change after PROD testing
const invalidPaymentGatewayLinks = ['globalpaymentsinc.com']

const PaymentScreen = () => {
  const { t } = useTranslation()

  const { paymentUrl, ticketId, params } = useLocalSearchParams<PaymentSearchParams>()
  const { data, isError, isLoading } = useQuery(paymentPageOptions(paymentUrl, JSON.parse(params)))

  const [isWebViewLoaded, setIsWebViewLoaded] = useState(false)

  const webviewRef = useRef<WebView>(null)

  if (!paymentUrl || isError) {
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

  return (
    <>
      <ScreenView
        title={t('PurchaseScreen.titlePayment')}
        // options={{ animation: Platform.OS === 'android' ? 'none' : undefined }}
      >
        <WebView
          ref={webviewRef}
          // https://github.com/react-native-webview/react-native-webview/issues/3052#issuecomment-1635698194
          androidLayerType="software"
          onError={redirectToPurchaseResult}
          // eslint-disable-next-line xss/no-mixed-html
          source={{ html: data }}
          onLoad={() => setIsWebViewLoaded(true)}
          className={cn('flex-1', { hidden: !isWebViewLoaded })}
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
      {isWebViewLoaded || isLoading ? null : (
        <LoadingScreen className="absolute h-full w-full bg-white/50" />
      )}
    </>
  )
}

export default PaymentScreen
