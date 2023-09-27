import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { Link, router, useGlobalSearchParams } from 'expo-router'
import React, { useRef } from 'react'
import { ScrollView } from 'react-native'

import TimeSelector from '@/components/controls/date-time/TimeSelector'
import PaymentGate from '@/components/controls/payment-methods/PaymentGate'
import VehicleFieldControl from '@/components/controls/vehicles/VehicleFieldControl'
import SegmentBadge from '@/components/info/SegmentBadge'
import Button from '@/components/shared/Button'
import Divider from '@/components/shared/Divider'
import Field from '@/components/shared/Field'
import FlexRow from '@/components/shared/FlexRow'
import Panel from '@/components/shared/Panel'
import PressableStyled from '@/components/shared/PressableStyled'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { useVehicles } from '@/hooks/useVehicles'

export type PurchaseSearchParams = {
  time?: string
  licencePlate?: string
  customParkingTime?: string
}

const setTimeValue = (minutes: number) => {
  router.setParams({ time: String(minutes) })
}

const PurchaseScreen = () => {
  const t = useTranslation('PurchaseScreen')
  const bottomSheetRef = useRef<BottomSheet>(null)
  const searchParams = useGlobalSearchParams<PurchaseSearchParams>()
  const { getVehicle, defaultVehicle } = useVehicles()
  const { licencePlate, time = '60' } = searchParams

  const chosenVehicle = licencePlate ? getVehicle(licencePlate) : defaultVehicle

  // TODO TimeSelector chips sometimes collapses, when not in ScrollView - investigate
  return (
    <>
      <ScreenView title={t('title')}>
        <ScrollView>
          {/* TODO better approach - this padding is here to be able to scroll up above bottom sheet */}
          <ScreenContent cn="pb-[250px]">
            <Field label={t('segmentFieldLabel')} labelInsertArea={<SegmentBadge label="1048" />}>
              <PressableStyled>
                <Panel>
                  <FlexRow>
                    <Typography>Staré Mesto – Fazuľová</Typography>
                    <Typography variant="default-semibold">2,90</Typography>
                  </FlexRow>
                </Panel>
              </PressableStyled>
            </Field>

            <Field label={t('chooseVehicleFieldLabel')}>
              {/* TODO Link+Pressable */}
              <Link
                asChild
                href={{ pathname: '/purchase/choose-vehicle', params: { ...searchParams } }}
              >
                <PressableStyled>
                  <VehicleFieldControl vehicle={chosenVehicle} />
                </PressableStyled>
              </Link>
            </Field>

            <Field label={t('parkingTimeFieldLabel')}>
              <TimeSelector value={Number(time)} onValueChange={setTimeValue} />
            </Field>

            <Field label={t('paymentMethodsFieldLabel')}>
              {/* TODO replace by proper field control */}
              <Link
                asChild
                href={{ pathname: '/purchase/choose-payment-method', params: { ...searchParams } }}
              >
                <PressableStyled>
                  <PaymentGate showControlChevron />
                </PressableStyled>
              </Link>
            </Field>
          </ScreenContent>
        </ScrollView>
      </ScreenView>

      <BottomSheet ref={bottomSheetRef} enableDynamicSizing>
        <BottomSheetView className="p-5 pb-[50px] g-3">
          <FlexRow>
            <Typography variant="default">Parkovanie 60 min</Typography>
            <Typography variant="default-bold">2 €</Typography>
          </FlexRow>

          <Divider />

          <FlexRow>
            <Typography variant="default-bold">{t('summary')}</Typography>
            <Typography variant="default-bold">2 €</Typography>
          </FlexRow>

          <Link href="/" asChild>
            <Button>{t('pay')}</Button>
          </Link>
        </BottomSheetView>
      </BottomSheet>
    </>
  )
}

export default PurchaseScreen
