import { ScrollView } from 'react-native'

import PaymentMethodsField from '@/components/controls/payment-methods/PaymentMethodsField'
import VisitorCardsField from '@/components/controls/payment-methods/VisitorCardsField'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Divider from '@/components/shared/Divider'
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
          <PaymentMethodsField />

          {isBpkUsedInProlongation ? null : (
            <>
              <Divider />
              <VisitorCardsField />
            </>
          )}
        </ScreenContent>
      </ScrollView>
    </ScreenView>
  )
}

export default ChoosePaymentMethodContent
