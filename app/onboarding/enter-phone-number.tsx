import TextInput from '@/components/inputs/TextInput'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'

const Page = () => {
  const t = useTranslation('EnterPhoneNumber')

  return (
    <ScreenView>
      <ScreenContent continueProps={{ href: '/onboarding/enter-verification-code' }}>
        <Typography variant="h1">{t('enterPhoneNumber')}</Typography>

        <TextInput keyboardType="phone-pad" />

        <Typography>{t('consent')}</Typography>
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
