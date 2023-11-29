import BottomSheet from '@gorhom/bottom-sheet'
import { useMutation } from '@tanstack/react-query'
import { Link, router } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { PaymentSearchParams } from '@/app/(app)/(purchase-and-payment)/purchase/payment'
import { TicketPurchaseSearchParams } from '@/app/(app)/(purchase-and-payment)/ticket-purchase'
import TimeSelector from '@/components/controls/date-time/TimeSelector'
import ParkingZoneField from '@/components/controls/ParkingZoneField'
import PaymentMethodsFieldControl from '@/components/controls/payment-methods/PaymentMethodsFieldControl'
import BonusCardRow from '@/components/controls/payment-methods/rows/BonusCardRow'
import VehicleFieldControl from '@/components/controls/vehicles/VehicleFieldControl'
import PurchaseErrorPanel from '@/components/purchase/PurchaseErrorPanel'
import PurchaseSummaryRow from '@/components/purchase/PurchaseSummaryRow'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Button from '@/components/shared/Button'
import Field from '@/components/shared/Field'
import PressableStyled from '@/components/shared/PressableStyled'
import PurchaseBottomSheet from '@/components/tickets/PurchaseBottomSheet'
import { useDefaultPaymentOption } from '@/hooks/useDefaultPaymentOption'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { useTranslation } from '@/hooks/useTranslation'
import { useVehicles } from '@/hooks/useVehicles'
import { clientApi } from '@/modules/backend/client-api'
import { ticketPriceOptions } from '@/modules/backend/constants/queryOptions'
import {
  GetTicketPriceRequestDto,
  InitiatePaymentRequestDto,
} from '@/modules/backend/openapi-generated'
import { usePurchaseStoreContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreContext'
import { usePurchaseStoreUpdateContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreUpdateContext'

const PurchaseScreen = () => {
  const t = useTranslation('PurchaseScreen')
  const insets = useSafeAreaInsets()
  const bottomSheetRef = useRef<BottomSheet>(null)
  // TODO: find solution for height of bottom content with drawing
  const [purchaseButtonContainerHeight, setPurchaseButtonContainerHeight] = useState(0)

  const { udr, licencePlate, duration, npk, paymentOption } = usePurchaseStoreContext()
  const onPurchaseStoreUpdate = usePurchaseStoreUpdateContext()

  const { getVehicle, defaultVehicle } = useVehicles()
  const [defaultPaymentOption] = useDefaultPaymentOption()

  const dateNow = Date.now()
  const parkingStart = new Date(dateNow).toISOString()
  const parkingEnd = new Date(dateNow + duration * 1000).toISOString()
  const priceRequestBody: GetTicketPriceRequestDto = {
    npkId: npk?.identificator || undefined,
    ticket: {
      udr: String(udr?.udrId) ?? '',
      udrUuid: udr?.udrUuid ?? '',
      ecv: licencePlate,
      parkingStart,
      parkingEnd,
    },
  }

  /** Set licencePlate to defaultVehicle if empty */
  useEffect(() => {
    if (!(licencePlate && getVehicle(licencePlate)) && defaultVehicle) {
      onPurchaseStoreUpdate({ licencePlate: defaultVehicle.licencePlate })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultVehicle])

  const priceQuery = useQueryWithFocusRefetch(
    ticketPriceOptions(priceRequestBody, { udr, npk, licencePlate, duration }),
  )

  const handleSelectTime = (value: number) => {
    onPurchaseStoreUpdate({ duration: value })
  }

  const initPaymentMutation = useMutation({
    mutationFn: (bodyInner: InitiatePaymentRequestDto) =>
      clientApi.ticketsControllerInitiateTicketPayment(bodyInner),
  })

  const handlePressPay = () => {
    initPaymentMutation.mutate(priceRequestBody, {
      onSuccess: ({ data: ticketInit }) => {
        /** Redirect to payment gate */
        if (ticketInit.paymentUrls) {
          const paymentUrl =
            paymentOption === 'apple-pay'
              ? ticketInit.paymentUrls.paymentUrlAPAY
              : paymentOption === 'google-pay'
              ? ticketInit.paymentUrls.paymentUrlGPAY
              : ticketInit.paymentUrls.paymentUrlCard

          router.push({
            pathname: '/purchase/payment',
            params: {
              paymentUrl,
            } satisfies PaymentSearchParams,
          })
          /** Handle payment without payment gate (NPK, BPK with 0€ ticket) */
        } else {
          router.push({
            pathname: '/ticket-purchase',
            params: { ticketId: ticketInit.id.toString() } satisfies TicketPurchaseSearchParams,
          })
        }
      },
    })
  }

  return (
    <>
      <ScreenView title={t('title')}>
        <ScrollView>
          {/* TODO better approach - this padding is here to be able to scroll up above bottom sheet */}
          <ScreenContent style={{ paddingBottom: purchaseButtonContainerHeight }}>
            <ParkingZoneField zone={udr} />

            <Field label={t('chooseVehicleFieldLabel')}>
              <Link asChild href={{ pathname: '/purchase/choose-vehicle' }}>
                <PressableStyled>
                  <VehicleFieldControl vehicle={getVehicle(licencePlate)} />
                </PressableStyled>
              </Link>
            </Field>

            <Field label={t('parkingTimeFieldLabel')}>
              <TimeSelector value={duration} onValueChange={handleSelectTime} />
            </Field>

            <Field label={t('paymentMethodsFieldLabel')}>
              {priceQuery.data?.creditBpkUsedSeconds ? (
                // TODO props
                <BonusCardRow balance="balance" validUntil="validUntil" />
              ) : null}

              <Link asChild href={{ pathname: '/purchase/choose-payment-method' }}>
                <PressableStyled>
                  <PaymentMethodsFieldControl
                    visitorCard={npk}
                    paymentOption={paymentOption ?? defaultPaymentOption}
                  />
                </PressableStyled>
              </Link>
            </Field>
          </ScreenContent>
        </ScrollView>
      </ScreenView>

      <PurchaseBottomSheet
        ref={bottomSheetRef}
        priceData={priceQuery.data}
        purchaseButtonContainerHeight={purchaseButtonContainerHeight}
      />

      <View
        style={{ paddingBottom: insets.bottom }}
        className="bg-white px-5 g-3"
        onLayout={(event) => {
          setPurchaseButtonContainerHeight(event.nativeEvent.layout.height)
        }}
      >
        <PurchaseSummaryRow priceData={priceQuery.data} />

        <PurchaseErrorPanel priceQuery={priceQuery} />

        <Button
          onPress={handlePressPay}
          disabled={!priceQuery.data}
          loading={priceQuery.isFetching}
        >
          {t('pay')}
        </Button>
      </View>
    </>
  )
}

export default PurchaseScreen
