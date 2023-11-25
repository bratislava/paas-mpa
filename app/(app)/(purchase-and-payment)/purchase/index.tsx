import BottomSheet from '@gorhom/bottom-sheet'
import { isAxiosError } from 'axios'
import { Link } from 'expo-router'
import { useEffect, useRef } from 'react'
import { ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import TimeSelector from '@/components/controls/date-time/TimeSelector'
import ParkingZoneField from '@/components/controls/ParkingZoneField'
import PaymentMethodsFieldControl from '@/components/controls/payment-methods/PaymentMethodsFieldControl'
import BonusCardRow from '@/components/controls/payment-methods/rows/BonusCardRow'
import VehicleFieldControl from '@/components/controls/vehicles/VehicleFieldControl'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Field from '@/components/shared/Field'
import PressableStyled from '@/components/shared/PressableStyled'
import PurchaseBottomSheet from '@/components/tickets/PurchaseBottomSheet'
import { useDefaultPaymentOption } from '@/hooks/useDefaultPaymentOption'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { useTranslation } from '@/hooks/useTranslation'
import { useVehicles } from '@/hooks/useVehicles'
import { ticketPriceOptions } from '@/modules/backend/constants/queryOptions'
import { GetTicketPriceRequestDto } from '@/modules/backend/openapi-generated'
import { usePurchaseStoreContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreContext'
import { usePurchaseStoreUpdateContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreUpdateContext'

export type PurchaseSearchParams = {
  udrId?: string
}

const PurchaseScreen = () => {
  const t = useTranslation('PurchaseScreen')
  const bottomSheetRef = useRef<BottomSheet>(null)
  const insets = useSafeAreaInsets()
  // height of the button + safeArea bottom inset
  const purchaseButtonContainerHeight = 48 + insets.bottom

  const { udr, licencePlate, duration, npk, paymentOption } = usePurchaseStoreContext()
  const onPurchaseStoreUpdate = usePurchaseStoreUpdateContext()

  const { getVehicle, defaultVehicle } = useVehicles()
  const [defaultPaymentOption] = useDefaultPaymentOption()

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

  // Set licencePlate to defaultVehicle if empty
  useEffect(() => {
    if (!(licencePlate && getVehicle(licencePlate)) && defaultVehicle) {
      onPurchaseStoreUpdate({ licencePlate: defaultVehicle.licencePlate })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultVehicle])

  // TODO handleError
  const { data, isError, error, isFetching } = useQueryWithFocusRefetch(
    ticketPriceOptions(body, { udr, npk, licencePlate, duration }),
  )

  // console.log('body', body)
  console.log('data', data, isError, error, isAxiosError(error) && error.response?.data)

  const onSelectTime = (value: number) => {
    onPurchaseStoreUpdate({ duration: value })
  }

  return (
    <>
      <ScreenView title={t('vehicles')}>
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
              <TimeSelector value={duration} onValueChange={onSelectTime} />
            </Field>

            <Field label={t('paymentMethodsFieldLabel')}>
              {data?.creditBpkUsedSeconds ? (
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
        priceData={data}
        isLoading={isFetching}
        priceRequestBody={body}
      />
    </>
  )
}

export default PurchaseScreen
