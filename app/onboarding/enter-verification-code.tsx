import TextInput from '@/components/inputs/TextInput'
import Screen from '@/components/shared/Screen'
import ScreenContent from '@/components/shared/ScreenContent'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'

const Page = () => {
  const t = useTranslation('EnterVerificationCode')

  return (
    <Screen>
      <ScreenContent continueProps={{ href: '/' }}>
        <Typography variant="h1">{t('enterVerificationCode')}</Typography>
        <TextInput />
        <Typography>{t('instructions')}</Typography>
      </ScreenContent>
    </Screen>
  )
}

export default Page
