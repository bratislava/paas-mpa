import { useState } from 'react'

import TextInput from '@/components/inputs/TextInput'
import Field from '@/components/shared/Field'
import Panel from '@/components/shared/Panel'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'

/*
 * TODO
 * - [ ] add email validation
 */

const Page = () => {
  const t = useTranslation('AddParkingCards')

  const [email, setEmail] = useState('')

  // TODO add email validation
  const isValid = email.length > 0

  return (
    <ScreenView title={t('addCardsTitle')}>
      <ScreenContent
        continueProps={{
          href: `/add-parking-cards/verification-sent?emailToVerify=${email}`,
          isDisabled: !isValid,
        }}
      >
        <Field label={t('emailField')}>
          <TextInput
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </Field>

        <Panel>
          <Typography>{t('instructions')}</Typography>
        </Panel>
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
