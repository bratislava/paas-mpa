import { ScrollView } from 'react-native'

import PaymentMethodsField from '@/components/controls/payment-methods/PaymentMethodsField'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import { useTranslation } from '@/hooks/useTranslation'

type Props = {
  isBpkUsedInProlongation?: boolean
}

const ChoosePaymentMethodContent = ({ isBpkUsedInProlongation }: Props) => {
  const { t } = useTranslation()

  return (
    <ScreenView title={t('PaymentMethods.title')} options={{ presentation: 'modal' }}>
      <ScrollView>
        <ScreenContent>
          <PaymentMethodsField isBpkUsedInProlongation={isBpkUsedInProlongation} />
        </ScreenContent>
      </ScrollView>
    </ScreenView>
  )
}

export default ChoosePaymentMethodContent
