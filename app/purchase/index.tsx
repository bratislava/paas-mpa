import BottomSheet from '@gorhom/bottom-sheet'
import { useQuery } from '@tanstack/react-query'
import { Link, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useRef } from 'react'
import { ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import TimeSelector from '@/components/controls/date-time/TimeSelector'
import ParkingZoneField from '@/components/controls/ParkingZoneField'
import PaymentGateMethod from '@/components/controls/payment-methods/PaymentGateMethod'
import VehicleFieldControl from '@/components/controls/vehicles/VehicleFieldControl'
import Field from '@/components/shared/Field'
import PressableStyled from '@/components/shared/PressableStyled'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import PurchaseBottomSheet from '@/components/tickets/PurchaseBottomSheet'
import { useTranslation } from '@/hooks/useTranslation'
import { useVehicles } from '@/hooks/useVehicles'
import { clientApi } from '@/modules/backend/client-api'
import { useGlobalStoreContext } from '@/state/hooks/useGlobalStoreContext'

export type PurchaseSearchParams = {
  duration?: string
  licencePlate?: string
  customParkingTime?: string
}

// TODO TimeSelector chips sometimes collapses - investigate
const PurchaseScreen = () => {
  const t = useTranslation('PurchaseScreen')

  const { ticketPriceRequest, setTicketPriceRequest } = useGlobalStoreContext()

  const bottomSheetRef = useRef<BottomSheet>(null)
  const purchaseParams = useLocalSearchParams<PurchaseSearchParams>()
  const { getVehicle, defaultVehicle } = useVehicles()
  const { licencePlate } = purchaseParams
  const insets = useSafeAreaInsets()
  // height of the button + safeArea bottom inset
  const purchaseButtonContainerHeight = 48 + insets.bottom

  const chosenVehicle = licencePlate ? getVehicle(licencePlate) : defaultVehicle

  const parkingEnd = new Date(
    Date.now() + (ticketPriceRequest?.duration ?? 0) * 60_000,
  ).toISOString()

  const isEnabled =
    !!ticketPriceRequest?.udr && !!ticketPriceRequest?.ecv && !!ticketPriceRequest?.duration

  const body = {
    ticket: {
      udr: ticketPriceRequest?.udr ?? '',
      ecv: ticketPriceRequest?.ecv ?? '',
      parkingEnd,
    },
  }

  const {
    data: response,
    error,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ['TicketRequest', ticketPriceRequest],
    queryFn: () => clientApi.ticketsControllerGetTicketPrice(body),
    keepPreviousData: true,
    enabled: isEnabled,
  })

  // TODO handleError
  console.log('data', isError, error)

  useEffect(() => {
    if (ticketPriceRequest?.ecv !== chosenVehicle?.licencePlate) {
      setTicketPriceRequest((prev) => ({
        ...prev,
        ecv: chosenVehicle?.licencePlate,
      }))
    }
  }, [chosenVehicle, setTicketPriceRequest, ticketPriceRequest])

  return (
    <>
      <ScreenView title={t('title')}>
        <ScrollView>
          {/* TODO better approach - this padding is here to be able to scroll up above bottom sheet */}
          <ScreenContent style={{ paddingBottom: purchaseButtonContainerHeight + 150 }}>
            <ParkingZoneField />

            <Field label={t('chooseVehicleFieldLabel')}>
              {/* TODO Link+Pressable */}
              <Link
                asChild
                href={{ pathname: '/purchase/choose-vehicle', params: { ...purchaseParams } }}
              >
                <PressableStyled>
                  <VehicleFieldControl vehicle={chosenVehicle} />
                </PressableStyled>
              </Link>
            </Field>

            <Field label={t('parkingTimeFieldLabel')}>
              <TimeSelector
                value={ticketPriceRequest?.duration ?? 60}
                onValueChange={(newDuration) =>
                  setTicketPriceRequest((prev) => ({ ...prev, duration: newDuration }))
                }
              />
            </Field>

            <Field label={t('paymentMethodsFieldLabel')}>
              {/* TODO replace by proper field control */}
              <Link
                asChild
                href={{
                  pathname: '/purchase/choose-payment-method',
                  params: { ...purchaseParams },
                }}
              >
                <PressableStyled>
                  <PaymentGateMethod showControlChevron />
                </PressableStyled>
              </Link>
            </Field>
          </ScreenContent>
        </ScrollView>
      </ScreenView>

      <PurchaseBottomSheet ref={bottomSheetRef} priceData={response?.data} isLoading={isFetching} />
    </>
  )
}

export default PurchaseScreen
