import BottomSheet from '@gorhom/bottom-sheet'
import { useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { Link, useLocalSearchParams } from 'expo-router'
import { useEffect, useRef } from 'react'
import { ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import TimeSelector from '@/components/controls/date-time/TimeSelector'
import ParkingZoneField from '@/components/controls/ParkingZoneField'
import PaymentMethodsFieldControl from '@/components/controls/payment-methods/PaymentMethodsFieldControl'
import VehicleFieldControl from '@/components/controls/vehicles/VehicleFieldControl'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Field from '@/components/shared/Field'
import PressableStyled from '@/components/shared/PressableStyled'
import PurchaseBottomSheet from '@/components/tickets/PurchaseBottomSheet'
import { useTranslation } from '@/hooks/useTranslation'
import { useVehicles } from '@/hooks/useVehicles'
import { ticketPriceOptions } from '@/modules/backend/constants/queryOptions'
import { GetTicketPriceRequestDto } from '@/modules/backend/openapi-generated'
import { useMapZone } from '@/state/MapZonesProvider/useMapZone'
import { usePurchaseStoreContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreContext'

export type PurchaseSearchParams = {
  udrId?: string
}

// TODO TimeSelector chips sometimes collapses - investigate
const PurchaseScreen = () => {
  const t = useTranslation('PurchaseScreen')
  const bottomSheetRef = useRef<BottomSheet>(null)
  const insets = useSafeAreaInsets()
  // height of the button + safeArea bottom inset
  const purchaseButtonContainerHeight = 48 + insets.bottom

  const { udr, setUdr, licencePlate, setLicencePlate, duration, setDuration, npk } =
    usePurchaseStoreContext()
  const { getVehicle, defaultVehicle } = useVehicles()

  const { udrId: udrIdSearchParam } = useLocalSearchParams<PurchaseSearchParams>()

  // Change zone when udrId from SearchParam changes
  const newUdrZone = useMapZone(udrIdSearchParam ?? null, true)
  useEffect(() => {
    if (newUdrZone && newUdrZone.udrId !== udr?.udrId) {
      setUdr(newUdrZone)
    }
  }, [newUdrZone, setUdr, udr?.udrId])

  // Set licencePlate to defaultVehicle if empty
  useEffect(() => {
    if (!licencePlate && defaultVehicle) {
      setLicencePlate(defaultVehicle.licencePlate)
    }
  }, [defaultVehicle, licencePlate, setLicencePlate])

  const dateNow = Date.now()
  const parkingStart = new Date(dateNow).toISOString()
  const parkingEnd = new Date(dateNow + duration * 1000).toISOString()
  const body: GetTicketPriceRequestDto = {
    npkId: npk?.identificator || undefined,
    ticket: {
      udr: String(udr?.udrId) ?? '',
      udrUuid: udr?.udrUuid ?? '',
      ecv: licencePlate,
      parkingStart,
      parkingEnd,
    },
  }

  // TODO handleError
  const { data, isError, error, isFetching } = useQuery(
    ticketPriceOptions(body, { udr, npk, licencePlate, duration }),
  )

  // console.log('body', body)
  console.log('data', data, isError, error, isAxiosError(error) && error.response?.data)

  return (
    <>
      <ScreenView title={t('title')}>
        <ScrollView>
          {/* TODO better approach - this padding is here to be able to scroll up above bottom sheet */}
          <ScreenContent style={{ paddingBottom: purchaseButtonContainerHeight + 150 }}>
            <ParkingZoneField zone={udr} />

            <Field label={t('chooseVehicleFieldLabel')}>
              <Link asChild href={{ pathname: '/purchase/choose-vehicle' }}>
                <PressableStyled>
                  <VehicleFieldControl vehicle={getVehicle(licencePlate)} />
                </PressableStyled>
              </Link>
            </Field>

            <Field label={t('parkingTimeFieldLabel')}>
              <TimeSelector value={duration} onValueChange={setDuration} />
            </Field>

            <Field label={t('paymentMethodsFieldLabel')}>
              <Link asChild href={{ pathname: '/purchase/choose-payment-method' }}>
                <PressableStyled>
                  <PaymentMethodsFieldControl card={npk} />
                </PressableStyled>
              </Link>
            </Field>
          </ScreenContent>
        </ScrollView>
      </ScreenView>

      <PurchaseBottomSheet
        ref={bottomSheetRef}
        priceData={data}
        isLoading={isFetching}
        priceRequestBody={body}
      />
    </>
  )
}

export default PurchaseScreen
