import { useMutation } from '@tanstack/react-query'
import { Link } from 'expo-router'
import { useState } from 'react'
import { ScrollView } from 'react-native'

import TimeSelector from '@/components/controls/date-time/TimeSelector'
import PaymentMethodsFieldControl from '@/components/controls/payment-methods/PaymentMethodsFieldControl'
import BonusCardRow from '@/components/controls/payment-methods/rows/BonusCardRow'
import VehicleRow from '@/components/controls/vehicles/VehicleRow'
import SkeletonPurchaseFields from '@/components/purchase/SkeletonPurchaseFields'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Field from '@/components/shared/Field'
import PressableStyled from '@/components/shared/PressableStyled'
import PurchaseBottomContent from '@/components/tickets/PurchaseBottomContent'
import { useDefaultPaymentOption } from '@/hooks/useDefaultPaymentOption'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import { ticketProlongationPriceOptions } from '@/modules/backend/constants/queryOptions'
import { InitiateProlongationRequestDto } from '@/modules/backend/openapi-generated'
import { usePurchaseStoreContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreContext'
import { usePurchaseStoreUpdateContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreUpdateContext'
import { useTicketContext } from '@/state/TicketProvider/useTicketContext'
import { paymentRedirect } from '@/utils/paymentRedirect'

const ProlongTicketScreen = () => {
  const ticket = useTicketContext()
  const t = useTranslation('PurchaseScreen')
  // TODO: find solution for height of bottom content with drawing
  const [purchaseButtonContainerHeight, setPurchaseButtonContainerHeight] = useState(0)

  const { vehicle, npk, paymentOption, duration } = usePurchaseStoreContext()
  const onPurchaseStoreUpdate = usePurchaseStoreUpdateContext()

  const [defaultPaymentOption] = useDefaultPaymentOption()

  const dateNow = new Date(ticket?.parkingEnd ?? Date.now()).getTime()
  const parkingEnd = new Date(dateNow + duration * 1000).toISOString()

  const initPaymentMutation = useMutation({
    mutationFn: (bodyInner: InitiateProlongationRequestDto) =>
      clientApi.ticketsControllerInitiateTicketProlongationPayment(bodyInner),
  })

  const handlePressPay = () => {
    initPaymentMutation.mutate(priceRequestBody, {
      onSuccess: ({ data: ticketInit }) => {
        paymentRedirect(ticketInit, paymentOption ?? defaultPaymentOption)
      },
    })
  }

  const priceRequestBody: InitiateProlongationRequestDto = {
    ticketId: ticket?.id || 0,
    newParkingEnd: parkingEnd,
  }

  const priceQuery = useQueryWithFocusRefetch(ticketProlongationPriceOptions(priceRequestBody))

  if (!ticket) {
    return (
      <ScreenView title={t('prolongate')}>
        <ScrollView>
          <SkeletonPurchaseFields />
        </ScrollView>
      </ScreenView>
    )
  }

  const handleSelectTime = (value: number) => {
    onPurchaseStoreUpdate({ duration: value })
  }

  return (
    <>
      <ScreenView title={t('prolongate')}>
        <ScrollView>
          {/* TODO better approach - this padding is here to be able to scroll up above bottom sheet */}
          <ScreenContent style={{ paddingBottom: purchaseButtonContainerHeight }}>
            {vehicle ? (
              <Field label={t('vehicle')}>
                <VehicleRow vehicle={vehicle} />
              </Field>
            ) : null}

            <Field label={t('parkingTimeFieldLabel')}>
              <TimeSelector value={duration} onValueChange={handleSelectTime} />
            </Field>

            {priceQuery.data ? (
              <Field label={t('paymentMethodsFieldLabel')}>
                {priceQuery.data?.creditBpkUsedSeconds ? (
                  // TODO props
                  <BonusCardRow balance="balance" validUntil="validUntil" />
                ) : null}

                {/* Allow to open select only if npk is not used (price is not free) */}
                {priceQuery.data?.priceTotal === 0 ? (
                  <PaymentMethodsFieldControl
                    visitorCard={npk}
                    paymentOption={paymentOption ?? defaultPaymentOption}
                    showControlChevron={false}
                  />
                ) : (
                  <Link
                    asChild
                    href={{ pathname: `prolongate/${ticket.id}/choose-payment-method` }}
                  >
                    <PressableStyled>
                      <PaymentMethodsFieldControl
                        visitorCard={npk}
                        paymentOption={paymentOption ?? defaultPaymentOption}
                      />
                    </PressableStyled>
                  </Link>
                )}
              </Field>
            ) : null}
          </ScreenContent>
        </ScrollView>
      </ScreenView>

      <PurchaseBottomContent
        priceQuery={priceQuery}
        handlePressPay={handlePressPay}
        purchaseButtonContainerHeight={purchaseButtonContainerHeight}
        setPurchaseButtonContainerHeight={setPurchaseButtonContainerHeight}
        isLoading={initPaymentMutation.isPending}
      />
    </>
  )
}

export default ProlongTicketScreen
