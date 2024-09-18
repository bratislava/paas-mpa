import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
} from '@gorhom/bottom-sheet'
import { useCallback, useRef, useState } from 'react'
import { Platform, ScrollView } from 'react-native'
import { useReducedMotion } from 'react-native-reanimated'

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
  const { t } = useTranslation()
  const reducedMotion = useReducedMotion()

  const paymentOptions: PaymentOption[] = [
    'payment-card',
    ...(Platform.OS === 'ios' ? (['apple-pay'] as const) : []),
    ...(Platform.OS === 'android' ? (['google-pay'] as const) : []),
    // 'e-wallet'
  ]

  const [defaultPaymentOption, setDefaultPaymentOption] = useDefaultPaymentOption()
  const [activeOption, setActiveOption] = useState<PaymentOption | null>(null)

  const bottomSheetRef = useRef<BottomSheetModal>(null)

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    [],
  )

  const handleContextMenuPress = (option: PaymentOption) => {
    bottomSheetRef.current?.present()
    setActiveOption(option)
  }

  const handleActionSetDefault = () => {
    if (activeOption) {
      setDefaultPaymentOption(activeOption)
    }
    bottomSheetRef.current?.close()
  }

  return (
    <ScreenView title={t('PaymentMethods.title')}>
      <ScrollView>
        <ScreenContent>
          {defaultPaymentOption ? (
            <Field label={t('PaymentMethods.defaultPaymentOption')}>
              <PaymentOptionRow variant={defaultPaymentOption} />
            </Field>
          ) : null}

          <Field label={t('PaymentMethods.otherPaymentOptions')}>
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

      <BottomSheetModal
        ref={bottomSheetRef}
        enableDynamicSizing
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        animateOnMount={!reducedMotion}
      >
        <BottomSheetContent>
          <PressableStyled onPress={handleActionSetDefault}>
            <ActionRow startIcon="check-circle" label={t('PaymentMethods.actions.saveAsDefault')} />
          </PressableStyled>
        </BottomSheetContent>
      </BottomSheetModal>
    </ScreenView>
  )
}

export default Page
