import BottomSheet from '@gorhom/bottom-sheet'
import { useMutation } from '@tanstack/react-query'
import { router } from 'expo-router'
import { forwardRef, useMemo } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import Button from '@/components/shared/Button'
import Divider from '@/components/shared/Divider'
import FlexRow from '@/components/shared/FlexRow'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { getDurationFromPriceData } from '@/components/tickets/getDurationFromPriceData'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import {
  GetTicketPriceRequestDto,
  GetTicketPriceResponseDto,
  InitiatePaymentRequestDto,
} from '@/modules/backend/openapi-generated'
import { usePurchaseStoreContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreContext'
import { formatDuration } from '@/utils/formatDuration'
import { formatPrice } from '@/utils/formatPrice'

type Props = {
  priceData: GetTicketPriceResponseDto | undefined
  isLoading?: boolean
  priceRequestBody: GetTicketPriceRequestDto
}

const PurchaseBottomSheet = forwardRef<BottomSheet, Props>(
  ({ priceData, isLoading, priceRequestBody }, ref) => {
    const t = useTranslation('PurchaseBottomSheet')
    const { udr } = usePurchaseStoreContext()
    const insets = useSafeAreaInsets()
    // TODO tmp for now - fixed height from figma
    const purchaseButtonContainerHeight = 24 + 12 + 48 + insets.bottom
    // 24 is handle height
    const snapPoints = useMemo(() => [24], [])

    const durationFromPriceDate = getDurationFromPriceData(priceData)

    const mutation = useMutation({
      mutationFn: (bodyInner: InitiatePaymentRequestDto) =>
        clientApi.ticketsControllerInitiateTicketPayment(bodyInner),
    })

    const handlePressPay = () => {
      mutation.mutate(priceRequestBody, {
        onSuccess: (data) => {
          console.log('onSuccess', JSON.stringify(data.data, undefined, 2))
          router.push({
            pathname: '/purchase/payment',
            params: { paymentUrl: encodeURI(data.data.paymentUrl ?? '') },
          })
        },
      })
    }

    // const renderFooter = useCallback(
    //   (footerProps: BottomSheetFooterProps) => {
    //     return (
    //       // eslint-disable-next-line react-native/no-inline-styles
    //       <BottomSheetFooter style={{ backgroundColor: 'white' }} {...footerProps}>
    //         <View className="px-5">
    //           <Link href="/" asChild>
    //             <Button>{t('pay')}</Button>
    //           </Link>
    //         </View>
    //       </BottomSheetFooter>
    //     )
    //   },
    //   [t],
    // )

    return (
      <>
        <BottomSheet
          ref={ref}
          enableDynamicSizing
          // footerComponent={renderFooter}
          bottomInset={purchaseButtonContainerHeight}
          snapPoints={snapPoints}
        >
          {priceData ? (
            <BottomSheetContent cn="g-3" hideSpacer>
              <FlexRow>
                <Typography variant="default">
                  {t('parkingTime', { time: formatDuration(durationFromPriceDate ?? 0) })}
                </Typography>
                <Typography variant="default-bold">
                  {formatPrice(priceData.priceWithoutDiscount)}
                </Typography>
              </FlexRow>

              {/* Is this ever used? */}
              {udr?.rpkInformation ? (
                <Panel className="bg-warning-light">
                  <Typography>{udr.rpkInformation}</Typography>
                </Panel>
              ) : null}

              {udr?.npkInformation ? (
                <Panel className="bg-warning-light">
                  <Typography>{udr.npkInformation}</Typography>
                </Panel>
              ) : null}

              {/* This usually says you cannot use BPK (in 2e zones) */}
              {udr?.additionalInformation ? (
                <Panel className="bg-warning-light">
                  <Typography>{udr.additionalInformation}</Typography>
                </Panel>
              ) : null}

              {priceData.creditNpkUsedSeconds ? (
                <FlexRow>
                  <Typography variant="default">{t('creditNpkUsed')}</Typography>
                  <Typography variant="default-bold">
                    {formatDuration(priceData.creditNpkUsedSeconds)}
                  </Typography>
                </FlexRow>
              ) : null}

              {priceData.creditBpkUsedSeconds ? (
                <FlexRow>
                  <Typography variant="default">{t('creditBpkUsed')}</Typography>
                  <Typography variant="default-bold">
                    {formatDuration(priceData.creditBpkUsedSeconds)}
                  </Typography>
                </FlexRow>
              ) : null}

              {/* Check if it is present (null/undefined, but show if it is 0) */}
              {priceData.tax == null ? null : (
                <FlexRow>
                  <Typography variant="default">{t('tax')}</Typography>
                  <Typography variant="default-bold">{formatPrice(priceData.tax)}</Typography>
                </FlexRow>
              )}

              <Divider />
            </BottomSheetContent>
          ) : null}
        </BottomSheet>

        <View style={{ height: purchaseButtonContainerHeight }} className="bg-white px-5 g-3">
          {/* Toggling visibility instead hiding by "display: none" prevents layout shifts */}
          <FlexRow className={priceData ? 'visible' : 'invisible'}>
            <Typography variant="default-bold">{t('summary')}</Typography>
            {priceData ? (
              <Typography variant="default-bold">{formatPrice(priceData.priceTotal)}</Typography>
            ) : null}
          </FlexRow>

          <Button onPress={handlePressPay} disabled={!priceData} loading={isLoading}>
            {t('pay')}
          </Button>
        </View>
      </>
    )
  },
)

export default PurchaseBottomSheet
