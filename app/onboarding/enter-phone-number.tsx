import TextInput from '@/components/inputs/TextInput'
import Screen from '@/components/shared/Screen'
import ScreenContent from '@/components/shared/ScreenContent'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'

const Page = () => {
  const t = useTranslation('EnterPhoneNumber')

  return (
    <Screen>
      <ScreenContent continueProps={{ href: '/onboarding/enter-verification-code' }}>
        <Typography variant="h1">{t('enterPhoneNumber')}</Typography>

        <TextInput keyboardType="phone-pad" />

        <Typography>{t('consent')}</Typography>
      </ScreenContent>
    </Screen>
  )
}

export default Page
