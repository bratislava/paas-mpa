import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, router, useFocusEffect } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ScrollView } from 'react-native'
import { useDebounce } from 'use-debounce'

import { VerificationIndexSearchParams } from '@/app/(app)/parking-cards/verification'
import { ParkingCardAvatar } from '@/assets/avatars'
import TimeSelector from '@/components/controls/date-time/TimeSelector'
import ParkingZoneField from '@/components/controls/ParkingZoneField'
import PaymentMethodsFieldControl from '@/components/controls/payment-methods/PaymentMethodsFieldControl'
import { RememberCardField } from '@/components/controls/payment-methods/RememberCardField'
import UsedBonusCard from '@/components/controls/payment-methods/UsedBonusCard'
import VehicleFieldControl from '@/components/controls/vehicles/VehicleFieldControl'
import Modal from '@/components/screen-layout/Modal/Modal'
import ModalContentWithActions from '@/components/screen-layout/Modal/ModalContentWithActions'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Field from '@/components/shared/Field'
import PressableStyled from '@/components/shared/PressableStyled'
import PurchaseBottomContent from '@/components/tickets/PurchaseBottomContent'
import { useDefaultPaymentOption } from '@/hooks/useDefaultPaymentOption'
import { useFirstPurchaseStorage } from '@/hooks/useFirstPurchaseStorage'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { useLocale, useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import {
  ticketPriceOptions,
  verifiedEmailsLengthOptions,
} from '@/modules/backend/constants/queryOptions'
import {
  GetTicketPriceRequestDto,
  InitiatePaymentRequestDto,
} from '@/modules/backend/openapi-generated'
import { usePurchaseStoreContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreContext'
import { usePurchaseStoreUpdateContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreUpdateContext'
import { useVehiclesStoreContext } from '@/state/VehiclesStoreProvider/useVehiclesStoreContext'
import { createPriceRequestBody } from '@/utils/createPriceRequestBody'
import { paymentRedirect } from '@/utils/paymentRedirect'

const PurchaseScreen = () => {
  const { t } = useTranslation()
  const locale = useLocale()

  // TODO: find solution for height of bottom content with drawing
  const [purchaseButtonContainerHeight, setPurchaseButtonContainerHeight] = useState(0)

  const [hasLicencePlateError, setHasLicencePlateError] = useState(false)

  const { udr, vehicle, duration, npk, paymentOption, rememberCard } = usePurchaseStoreContext()
  const onPurchaseStoreUpdate = usePurchaseStoreUpdateContext()

  const { getVehicle, defaultVehicle } = useVehiclesStoreContext()
  const [defaultPaymentOption] = useDefaultPaymentOption()
  const [firstPurchaseOpened, setFirstPurchaseOpened] = useFirstPurchaseStorage()
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false)

  const licencePlate = vehicle?.vehiclePlateNumber ?? ''

  const [debouncedDuration] = useDebounce(duration, 400)
  const isDebouncingDuration = duration !== debouncedDuration

  const parkingCardsQuery = useQuery(verifiedEmailsLengthOptions({ enabled: !firstPurchaseOpened }))

  const priceRequestBody: GetTicketPriceRequestDto = useMemo(
    () => createPriceRequestBody({ udr, licencePlate, duration: debouncedDuration, npk, locale }),
    [udr, licencePlate, debouncedDuration, npk, locale],
  )

  const handleModalClose = () => setIsAddCardModalOpen(false)

  const handleParkingCardRedirect = () => {
    handleModalClose()
    router.push({
      pathname: '/parking-cards/verification',
      // "Boolean" value is passed as string because of Expo router limitations
      params: { isFirstPurchase: 'true' } satisfies VerificationIndexSearchParams,
    })
  }

  /** Open modal for adding parking card on first run of application */
  useEffect(() => {
    if (firstPurchaseOpened || !parkingCardsQuery.data) return

    if (parkingCardsQuery.data.verifiedEmails.length === 0) {
      setIsAddCardModalOpen(true)
    }
    setFirstPurchaseOpened(true)
    // needs to run only at first render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parkingCardsQuery.data])

  /** Set licencePlate to defaultVehicle if empty */
  useEffect(() => {
    if (vehicle?.isOneTimeUse) return
    if (!(vehicle && getVehicle(vehicle.id)) && defaultVehicle) {
      onPurchaseStoreUpdate({ vehicle: defaultVehicle })
    } else if (vehicle && !getVehicle(vehicle.id)) {
      onPurchaseStoreUpdate({ vehicle: null })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultVehicle])

  useEffect(() => {
    if (licencePlate && hasLicencePlateError) {
      setHasLicencePlateError(false)
    }
  }, [licencePlate, hasLicencePlateError])

  const priceQuery = useQueryWithFocusRefetch(
    ticketPriceOptions(priceRequestBody, {
      udr,
      licencePlate,
      duration: debouncedDuration,
      npk,
    }),
  )

  /**
   * Refetch price every minute when screen is focused.
   * Docs: https://docs.expo.dev/router/reference/hooks/#usefocuseffect.
   */
  useFocusEffect(
    useCallback(() => {
      const interval = setInterval(() => priceQuery.refetch(), 1000 * 60)

      return () => clearInterval(interval)
    }, [priceQuery]),
  )

  const handleSelectTime = (value: number) => {
    onPurchaseStoreUpdate({ duration: value })
  }

  const initPaymentMutation = useMutation({
    mutationFn: (bodyInner: InitiatePaymentRequestDto) =>
      clientApi.ticketsControllerInitiateTicketPayment(bodyInner),
  })

  const handlePressPay = () => {
    if (!licencePlate) {
      setHasLicencePlateError(true)

      return
    }

    const actualPaymentOption = paymentOption ?? defaultPaymentOption

    initPaymentMutation.mutate(
      {
        ...priceRequestBody,
        rememberCard: actualPaymentOption === 'payment-card' ? rememberCard : false,
      } satisfies InitiatePaymentRequestDto,
      {
        onSuccess: ({ data: ticketInit }) => {
          paymentRedirect(ticketInit, paymentOption ?? defaultPaymentOption)
        },
      },
    )
  }

  return (
    <>
      <ScreenView title={t('PurchaseScreen.title')}>
        <ScrollView>
          {/* TODO better approach - this padding is here to be able to scroll up above bottom sheet */}
          <ScreenContent style={{ paddingBottom: purchaseButtonContainerHeight }}>
            <ParkingZoneField zone={udr} />
            <Field label={t('PurchaseScreen.chooseVehicleFieldLabel')}>
              <Link asChild href={{ pathname: '/purchase/choose-vehicle' }}>
                <PressableStyled>
                  <VehicleFieldControl
                    hasError={hasLicencePlateError}
                    vehicle={vehicle?.isOneTimeUse ? vehicle : getVehicle(vehicle?.id)}
                  />
                </PressableStyled>
              </Link>
            </Field>
            <Field label={t('PurchaseScreen.parkingTimeFieldLabel')}>
              <TimeSelector value={duration} onValueChange={handleSelectTime} />
            </Field>
            <Field label={t('PurchaseScreen.paymentMethodsFieldLabel')}>
              {priceQuery.data?.creditBpkUsedSeconds ? (
                <UsedBonusCard
                  creditUsedSeconds={priceQuery.data.creditBpkUsedSeconds}
                  creditBpkRemaining={priceQuery.data.creditBpkRemaining}
                  validUntil={priceQuery.data.bpkValidTo}
                />
              ) : null}

              {priceQuery.data?.priceTotal !== 0 || priceQuery.data?.creditNpkUsedSeconds ? (
                <Link asChild href={{ pathname: '/purchase/choose-payment-method' }}>
                  <PressableStyled>
                    <PaymentMethodsFieldControl
                      visitorCard={npk}
                      paymentOption={paymentOption ?? defaultPaymentOption}
                    />
                  </PressableStyled>
                </Link>
              ) : null}

              {priceQuery.data?.priceTotal === 0 ? null : <RememberCardField />}
            </Field>
          </ScreenContent>
        </ScrollView>
      </ScreenView>

      <PurchaseBottomContent
        duration={debouncedDuration}
        priceQuery={priceQuery}
        handlePressPay={handlePressPay}
        purchaseButtonContainerHeight={purchaseButtonContainerHeight}
        setPurchaseButtonContainerHeight={setPurchaseButtonContainerHeight}
        isLoading={initPaymentMutation.isPending || isDebouncingDuration}
        hasLicencePlateError={hasLicencePlateError}
      />

      <Modal visible={isAddCardModalOpen} onRequestClose={handleModalClose}>
        <ModalContentWithActions
          customAvatarComponent={<ParkingCardAvatar />}
          title={t('PurchaseScreen.parkingCardModal.title')}
          text={t('PurchaseScreen.parkingCardModal.message')}
          primaryActionLabel={t('PurchaseScreen.parkingCardModal.actionConfirm')}
          primaryActionOnPress={handleParkingCardRedirect}
          secondaryActionLabel={t('PurchaseScreen.parkingCardModal.actionCancel')}
          secondaryActionOnPress={handleModalClose}
        />
      </Modal>
    </>
  )
}

export default PurchaseScreen
