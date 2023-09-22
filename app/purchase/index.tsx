import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { Link, Stack } from 'expo-router'
import React, { useRef } from 'react'

import PaymentGate from '@/components/controls/payment-methods/PaymentGate'
import SegmentBadge from '@/components/info/SegmentBadge'
import TextInput from '@/components/inputs/TextInput'
import Button from '@/components/shared/Button'
import Divider from '@/components/shared/Divider'
import Field from '@/components/shared/Field'
import FlexRow from '@/components/shared/FlexRow'
import PanelPressable from '@/components/shared/PanelPressable'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { useVehicles } from '@/hooks/useVehicles'

const PurchaseScreen = () => {
  const t = useTranslation('PurchaseScreen')
  const bottomSheetRef = useRef<BottomSheet>(null)
  const { defaultVehicle } = useVehicles()

  return (
    <ScreenView>
      <Stack.Screen options={{ title: t('ticketPurchaseTitle') }} />

      <ScreenContent>
        <Field label={t('segmentFieldLabel')} labelInsertArea={<SegmentBadge label="1048" />}>
          <PanelPressable>
            <FlexRow>
              <Typography>Staré Mesto – Fazuľová</Typography>
              <Typography variant="default-semibold">2,90</Typography>
            </FlexRow>
          </PanelPressable>
        </Field>

        <Field label={t('vehicleFieldLabel')}>
          <TextInput keyboardType="numeric" defaultValue={defaultVehicle?.licencePlate} />
          {/* TODO replace by proper field control */}
          {/* <Surface touchable> */}
          {/*   <FlexRow> */}
          {/*     <Typography variant="default-semibold">{t('addVehicle')}</Typography> */}
          {/*   </FlexRow> */}
          {/* </Surface> */}
        </Field>

        <Field label={t('parkingTimeFieldLabel')}>
          <TextInput keyboardType="numeric" />
          {/* TODO replace by proper field control */}
        </Field>

        <Field label={t('paymentMethodsFieldLabel')}>
          {/* TODO replace by control */}
          <PaymentGate />
        </Field>
      </ScreenContent>

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
    </ScreenView>
  )
}

export default PurchaseScreen
