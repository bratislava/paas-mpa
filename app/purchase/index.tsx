import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { Link, Stack, useLocalSearchParams } from 'expo-router'
import React, { useRef } from 'react'
import { ScrollView } from 'react-native'

import PaymentGate from '@/components/controls/payment-methods/PaymentGate'
import TimeSelector from '@/components/controls/TimeSelector'
import VehicleField from '@/components/controls/vehicles/VehicleField'
import SegmentBadge from '@/components/info/SegmentBadge'
import Button from '@/components/shared/Button'
import Divider from '@/components/shared/Divider'
import Field from '@/components/shared/Field'
import FlexRow from '@/components/shared/FlexRow'
import Panel from '@/components/shared/Panel'
import PressableStyled from '@/components/shared/PressableStyled'
import ScreenContent from '@/components/shared/ScreenContent'
import Typography from '@/components/shared/Typography'
import { useTimeSelector } from '@/hooks/useTimeSelector'
import { useTranslation } from '@/hooks/useTranslation'
import { useVehicles } from '@/hooks/useVehicles'

const PurchaseScreen = () => {
  const t = useTranslation('PurchaseScreen')
  const bottomSheetRef = useRef<BottomSheet>(null)
  const { licencePlate } = useLocalSearchParams()
  const { getVehicle, defaultVehicle } = useVehicles()
  const { timeValue, setTimeValue } = useTimeSelector(60)
  const chosenVehicle =
    licencePlate && typeof licencePlate === 'string' ? getVehicle(licencePlate) : defaultVehicle

  // TODO TimeSelector chips collapses when not in ScrollView - investigate
  return (
    <>
      <ScrollView>
        <Stack.Screen options={{ title: t('title') }} />

        <ScreenContent>
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

          <VehicleField vehicle={chosenVehicle} />

          <Field label={t('parkingTimeFieldLabel')}>
            <TimeSelector value={timeValue} onValueChange={setTimeValue} />
          </Field>

          <Field label={t('paymentMethodsFieldLabel')}>
            {/* TODO replace by proper field control */}
            <PressableStyled>
              <PaymentGate />
            </PressableStyled>
          </Field>
        </ScreenContent>
      </ScrollView>

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
