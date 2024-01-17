import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import { useCallback, useRef, useState } from 'react'
import { Platform, ScrollView } from 'react-native'

import PaymentOptionRow from '@/components/controls/payment-methods/rows/PaymentOptionRow'
import { PaymentOption } from '@/components/controls/payment-methods/types'
import ActionRow from '@/components/list-rows/ActionRow'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Field from '@/components/shared/Field'
import PressableStyled from '@/components/shared/PressableStyled'
import { useDefaultPaymentOption } from '@/hooks/useDefaultPaymentOption'
import { useTranslation } from '@/hooks/useTranslation'

const Page = () => {
  const t = useTranslation('PaymentMethods')

  const paymentOptions: PaymentOption[] = [
    'payment-card',
    ...(Platform.OS === 'ios' ? (['apple-pay'] as const) : []),
    'google-pay',
    // 'e-wallet'
  ]

  const [defaultPaymentOption, setDefaultPaymentOption] = useDefaultPaymentOption()
  const [activeOption, setActiveOption] = useState<PaymentOption | null>(null)

  const bottomSheetRef = useRef<BottomSheet>(null)

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    [],
  )

  const handleContextMenuPress = (option: PaymentOption) => {
    bottomSheetRef.current?.expand()
    setActiveOption(option)
  }

  const handleActionSetDefault = () => {
    if (activeOption) {
      setDefaultPaymentOption(activeOption)
    }
    bottomSheetRef.current?.close()
  }

  return (
    <ScreenView title={t('title')}>
      <ScrollView>
        <ScreenContent>
          {defaultPaymentOption ? (
            <Field label={t('defaultPaymentOption')}>
              <PaymentOptionRow variant={defaultPaymentOption} />
            </Field>
          ) : null}

          <Field label={t('otherPaymentOptions')}>
            {paymentOptions
              .filter((option) => option !== defaultPaymentOption)
              .map((option) => {
                return (
                  <PaymentOptionRow
                    key={option}
                    variant={option}
                    onContextMenuPress={() => handleContextMenuPress(option)}
                  />
                )
              })}
          </Field>
        </ScreenContent>
      </ScrollView>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        enableDynamicSizing
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <BottomSheetContent>
          <PressableStyled onPress={handleActionSetDefault}>
            <ActionRow startIcon="check-circle" label={t('actions.saveAsDefault')} />
          </PressableStyled>
        </BottomSheetContent>
      </BottomSheet>
    </ScreenView>
  )
}

export default Page
