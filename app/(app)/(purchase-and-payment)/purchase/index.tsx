import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, router } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { ScrollView } from 'react-native'
import { useDebounce } from 'use-debounce'

import { ParkingCardAvatar } from '@/assets/avatars'
import TimeSelector from '@/components/controls/date-time/TimeSelector'
import ParkingZoneField from '@/components/controls/ParkingZoneField'
import PaymentMethodsFieldControl from '@/components/controls/payment-methods/PaymentMethodsFieldControl'
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
import { useTranslation } from '@/hooks/useTranslation'
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
  const t = useTranslation('PurchaseScreen')
  // TODO: find solution for height of bottom content with drawing
  const [purchaseButtonContainerHeight, setPurchaseButtonContainerHeight] = useState(0)

  const [hasLicencePlateError, setHasLicencePlateError] = useState(false)

  const { udr, vehicle, duration, npk, paymentOption } = usePurchaseStoreContext()
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
    () => createPriceRequestBody({ udr, licencePlate, duration: debouncedDuration, npk }),
    [udr, licencePlate, debouncedDuration, npk],
  )

  const handleModalClose = () => setIsAddCardModalOpen(false)

  const handleParkingCardRedirect = () => {
    handleModalClose()
    router.push('/parking-cards/verification')
  }

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

    initPaymentMutation.mutate(
      createPriceRequestBody({
        udr,
        licencePlate,
        duration: debouncedDuration,
        npk,
      }),
      {
        onSuccess: ({ data: ticketInit }) => {
          paymentRedirect(ticketInit, paymentOption ?? defaultPaymentOption)
        },
      },
    )
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
                  <VehicleFieldControl
                    hasError={hasLicencePlateError}
                    vehicle={vehicle?.isOneTimeUse ? vehicle : getVehicle(vehicle?.id)}
                  />
                </PressableStyled>
              </Link>
            </Field>

            <Field label={t('parkingTimeFieldLabel')}>
              <TimeSelector value={duration} onValueChange={handleSelectTime} />
            </Field>

            <Field label={t('paymentMethodsFieldLabel')}>
              <UsedBonusCard
                id={priceQuery.data?.bpkId}
                creditUsedSeconds={priceQuery.data?.creditBpkUsedSeconds}
                creditBpkRemaining={priceQuery.data?.creditBpkRemaining}
                validUntil={priceQuery.data?.bpkValidTo}
              />

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
          title={t('parkingCardModal.title')}
          text={t('parkingCardModal.message')}
          primaryActionLabel={t('parkingCardModal.actionConfirm')}
          primaryActionOnPress={handleParkingCardRedirect}
          secondaryActionLabel={t('parkingCardModal.actionCancel')}
          secondaryActionOnPress={handleModalClose}
        />
      </Modal>
    </>
  )
}

export default PurchaseScreen
