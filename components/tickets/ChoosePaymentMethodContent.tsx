import { ScrollView } from 'react-native'

import PaymentOptionsField from '@/components/controls/payment-methods/PaymentOptionsField'
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
          <PaymentOptionsField />

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
