import BottomSheet from '@gorhom/bottom-sheet'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Link, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useRef } from 'react'
import { ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import TimeSelector from '@/components/controls/date-time/TimeSelector'
import ParkingZoneField from '@/components/controls/ParkingZoneField'
import PaymentMethodsFieldControl from '@/components/controls/payment-methods/PaymentMethodsFieldControl'
import VehicleFieldControl from '@/components/controls/vehicles/VehicleFieldControl'
import Field from '@/components/shared/Field'
import PressableStyled from '@/components/shared/PressableStyled'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import PurchaseBottomSheet from '@/components/tickets/PurchaseBottomSheet'
import { useTranslation } from '@/hooks/useTranslation'
import { useVehicles } from '@/hooks/useVehicles'
import { clientApi } from '@/modules/backend/client-api'
import { GetTicketPriceRequestDto } from '@/modules/backend/openapi-generated'
import { useGlobalStoreContext } from '@/state/GlobalStoreProvider/useGlobalStoreContext'
import { useMapZone } from '@/state/MapProvider/useMapZone'

export type PurchaseSearchParams = {
  udrId?: string
}

// TODO TimeSelector chips sometimes collapses - investigate
const PurchaseScreen = () => {
  const t = useTranslation('PurchaseScreen')

  const { ticketPriceRequest, setTicketPriceRequest } = useGlobalStoreContext()
  const { getVehicle, defaultVehicle } = useVehicles()

  const { udrId: udrIdSearchParam } = useLocalSearchParams<PurchaseSearchParams>()

  // BottomSheet
  const bottomSheetRef = useRef<BottomSheet>(null)
  const insets = useSafeAreaInsets()
  // height of the button + safeArea bottom inset
  const purchaseButtonContainerHeight = 48 + insets.bottom

  const parkingEnd = new Date(
    Date.now() + (ticketPriceRequest?.duration ?? 0) * 60_000,
  ).toISOString()
  const udrUuid = useMapZone(ticketPriceRequest?.udr ?? null, true)?.udrUuid

  const isQueryEnabled =
    !!ticketPriceRequest?.udr &&
    !!ticketPriceRequest?.ecv &&
    !!ticketPriceRequest?.duration &&
    !!udrUuid

  const body: GetTicketPriceRequestDto = {
    npkId: ticketPriceRequest?.npkId || undefined,
    ticket: {
      udr: ticketPriceRequest?.udr ?? '',
      udrUuid: udrUuid ?? '',
      ecv: ticketPriceRequest?.ecv ?? '',
      parkingEnd,
    },
  }

  // TODO handleError
  const { data, error, isError, isFetching } = useQuery({
    queryKey: ['TicketRequest', ticketPriceRequest],
    queryFn: () => clientApi.ticketsControllerGetTicketPrice(body),
    select: (res) => res.data,
    // https://tanstack.com/query/latest/docs/react/guides/migrating-to-v5#removed-keeppreviousdata-in-favor-of-placeholderdata-identity-function
    placeholderData: keepPreviousData,
    enabled: isQueryEnabled,
  })

  console.log('body', body)
  console.log('data', data, isError, error)

  // Change zone when udrId from SearchParam changes
  useEffect(() => {
    if (udrIdSearchParam && udrIdSearchParam !== ticketPriceRequest?.udr) {
      setTicketPriceRequest((prev) => ({
        ...prev,
        udr: udrIdSearchParam,
      }))
    }
  }, [setTicketPriceRequest, ticketPriceRequest?.udr, udrIdSearchParam])

  // Set ticketPriceRequest.ecv to defaultVehicle
  useEffect(() => {
    if (!ticketPriceRequest?.ecv && defaultVehicle) {
      setTicketPriceRequest((prev) => ({
        ...prev,
        ecv: defaultVehicle.licencePlate,
      }))
    }
  }, [defaultVehicle, setTicketPriceRequest, ticketPriceRequest?.ecv])

  return (
    <>
      <ScreenView title={t('title')}>
        <ScrollView>
          {/* TODO better approach - this padding is here to be able to scroll up above bottom sheet */}
          <ScreenContent style={{ paddingBottom: purchaseButtonContainerHeight + 150 }}>
            <ParkingZoneField />

            <Field label={t('chooseVehicleFieldLabel')}>
              <Link asChild href={{ pathname: '/purchase/choose-vehicle' }}>
                <PressableStyled>
                  <VehicleFieldControl
                    vehicle={ticketPriceRequest?.ecv ? getVehicle(ticketPriceRequest.ecv) : null}
                  />
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
              <Link asChild href={{ pathname: '/purchase/choose-payment-method' }}>
                <PressableStyled>
                  <PaymentMethodsFieldControl />
                </PressableStyled>
              </Link>
            </Field>
          </ScreenContent>
        </ScrollView>
      </ScreenView>

      <PurchaseBottomSheet ref={bottomSheetRef} priceData={data} isLoading={isFetching} />
    </>
  )
}

export default PurchaseScreen
