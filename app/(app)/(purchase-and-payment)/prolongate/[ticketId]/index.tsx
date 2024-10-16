import { useMutation } from '@tanstack/react-query'
import { Link } from 'expo-router'
import { useState } from 'react'
import { ScrollView } from 'react-native'
import { useDebounce } from 'use-debounce'

import TimeSelector from '@/components/controls/date-time/TimeSelector'
import PaymentMethodsFieldControl from '@/components/controls/payment-methods/PaymentMethodsFieldControl'
import { RememberCardField } from '@/components/controls/payment-methods/RememberCardField'
import UsedBonusCard from '@/components/controls/payment-methods/UsedBonusCard'
import VehicleRow from '@/components/controls/vehicles/VehicleRow'
import SkeletonPurchaseFields from '@/components/purchase/SkeletonPurchaseFields'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Field from '@/components/shared/Field'
import PressableStyled from '@/components/shared/PressableStyled'
import PurchaseBottomContent from '@/components/tickets/PurchaseBottomContent'
import { useDefaultPaymentOption } from '@/hooks/useDefaultPaymentOption'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { useLocale, useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import { ticketProlongationPriceOptions } from '@/modules/backend/constants/queryOptions'
import { InitiateProlongationRequestDto } from '@/modules/backend/openapi-generated'
import { usePurchaseStoreContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreContext'
import { usePurchaseStoreUpdateContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreUpdateContext'
import { useTicketContext } from '@/state/TicketProvider/useTicketContext'
import { getPaygateLanguageFromLocale } from '@/utils/getPaygateLanguageFromLocale'
import { paymentRedirect } from '@/utils/paymentRedirect'

const ProlongTicketScreen = () => {
  const ticket = useTicketContext()
  const { t } = useTranslation()
  const locale = useLocale()

  // TODO: find solution for height of bottom content with drawing
  const [purchaseButtonContainerHeight, setPurchaseButtonContainerHeight] = useState(0)

  const { vehicle, npk, paymentOption, duration, rememberCard } = usePurchaseStoreContext()
  const onPurchaseStoreUpdate = usePurchaseStoreUpdateContext()

  const [defaultPaymentOption] = useDefaultPaymentOption()

  const [debouncedDuration] = useDebounce(duration, 400)
  const isDebouncingDuration = duration !== debouncedDuration

  const activeTicketEnd = new Date(ticket?.parkingEnd ?? Date.now()).getTime()
  const parkingEnd = new Date(activeTicketEnd + debouncedDuration * 1000).toISOString()

  const initPaymentMutation = useMutation({
    mutationFn: (bodyInner: InitiateProlongationRequestDto) =>
      clientApi.ticketsControllerInitiateTicketProlongationPayment24Pay(bodyInner),
  })

  const priceRequestBody: InitiateProlongationRequestDto = {
    ticketId: ticket?.id || 0,
    newParkingEnd: parkingEnd,
    paygateLanguage: getPaygateLanguageFromLocale(locale),
  }

  const handlePressPay = () => {
    initPaymentMutation.mutate(
      { ...priceRequestBody, rememberCard },
      {
        onSuccess: ({ data: ticketInit }) => {
          paymentRedirect(ticketInit, paymentOption ?? defaultPaymentOption)
        },
      },
    )
  }

  const priceQuery = useQueryWithFocusRefetch(ticketProlongationPriceOptions(priceRequestBody))

  if (!ticket) {
    return (
      <ScreenView title={t('PurchaseScreen.prolong')}>
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
      <ScreenView title={t('PurchaseScreen.prolong')}>
        <ScrollView>
          {/* TODO better approach - this padding is here to be able to scroll up above bottom sheet */}
          <ScreenContent style={{ paddingBottom: purchaseButtonContainerHeight }}>
            {vehicle ? (
              <Field label={t('PurchaseScreen.vehicle')}>
                <VehicleRow vehicle={vehicle} />
              </Field>
            ) : null}

            <Field label={t('PurchaseScreen.parkingTimeFieldLabel')}>
              <TimeSelector
                value={duration}
                onValueChange={handleSelectTime}
                timeCalculationBase={activeTicketEnd}
              />
            </Field>

            {priceQuery.data ? (
              <Field label={t('PurchaseScreen.paymentMethodsFieldLabel')}>
                {priceQuery.data.creditBpkUsedSeconds ? (
                  <UsedBonusCard
                    creditUsedSeconds={priceQuery.data.creditBpkUsedSeconds}
                    creditBpkRemaining={priceQuery.data.creditBpkRemaining}
                    validUntil={priceQuery.data.bpkValidTo}
                  />
                ) : null}

                {/* Allow to open select only if npk is not used (price is not free) */}
                {priceQuery.data.priceTotal === 0 ? null : (
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

                {priceQuery.data.priceTotal === 0 ? null : <RememberCardField />}
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
        isLoading={initPaymentMutation.isPending || isDebouncingDuration}
      />
    </>
  )
}

export default ProlongTicketScreen
