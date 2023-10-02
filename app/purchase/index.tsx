import BottomSheet from '@gorhom/bottom-sheet'
import { Link, router, useLocalSearchParams } from 'expo-router'
import React, { useMemo, useRef } from 'react'
import { ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import TimeSelector from '@/components/controls/date-time/TimeSelector'
import PaymentGate from '@/components/controls/payment-methods/PaymentGate'
import VehicleFieldControl from '@/components/controls/vehicles/VehicleFieldControl'
import SegmentBadge from '@/components/info/SegmentBadge'
import BottomSheetContent from '@/components/shared/BottomSheetContent'
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
import { formatDuration } from '@/utils/formatDuration'

export type PurchaseSearchParams = {
  duration?: string
  licencePlate?: string
  customParkingTime?: string
}

// TODO TimeSelector chips sometimes collapses - investigate
const PurchaseScreen = () => {
  const t = useTranslation('PurchaseScreen')
  const bottomSheetRef = useRef<BottomSheet>(null)
  const purchaseParams = useLocalSearchParams<PurchaseSearchParams>()
  const { getVehicle, defaultVehicle } = useVehicles()
  const { licencePlate, duration = '60' } = purchaseParams
  const insets = useSafeAreaInsets()
  // height of the button + safeArea bottom inset
  const purchaseButtonContainerHeight = 48 + insets.bottom

  const chosenVehicle = licencePlate ? getVehicle(licencePlate) : defaultVehicle

  // 32 is just visually okay
  const snapPoints = useMemo(() => [32], [])

  return (
    <>
      <ScreenView title={t('title')}>
        <ScrollView>
          {/* TODO better approach - this padding is here to be able to scroll up above bottom sheet */}
          <ScreenContent style={{ paddingBottom: purchaseButtonContainerHeight + 150 }}>
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
                href={{ pathname: '/purchase/choose-vehicle', params: { ...purchaseParams } }}
              >
                <PressableStyled>
                  <VehicleFieldControl vehicle={chosenVehicle} />
                </PressableStyled>
              </Link>
            </Field>

            <Field label={t('parkingTimeFieldLabel')}>
              <TimeSelector
                value={Number(duration)}
                onValueChange={(newDuration) => router.setParams({ duration: String(newDuration) })}
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
                  <PaymentGate showControlChevron />
                </PressableStyled>
              </Link>
            </Field>
          </ScreenContent>
        </ScrollView>
      </ScreenView>

      <BottomSheet
        ref={bottomSheetRef}
        enableDynamicSizing
        bottomInset={purchaseButtonContainerHeight}
        snapPoints={snapPoints}
        index={1}
      >
        <BottomSheetContent cn="g-3" hideSpacer>
          <FlexRow>
            <Typography variant="default">Parkovanie {formatDuration(Number(duration))}</Typography>
            <Typography variant="default-bold">? €</Typography>
          </FlexRow>

          <Typography>{JSON.stringify(purchaseParams)}</Typography>
          <Divider />

          <FlexRow>
            <Typography variant="default-bold">{t('summary')}</Typography>
            <Typography variant="default-bold">2 €</Typography>
          </FlexRow>
        </BottomSheetContent>
      </BottomSheet>

      <View style={{ height: purchaseButtonContainerHeight }} className="bg-white px-5 g-3">
        <Link href="/" asChild>
          <Button>{t('pay')}</Button>
        </Link>
      </View>
    </>
  )
}

export default PurchaseScreen
