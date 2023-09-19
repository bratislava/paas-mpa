import TextInput from '@/components/inputs/TextInput'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'

const Page = () => {
  const t = useTranslation('EnterVerificationCode')

  return (
    <ScreenView>
      <ScreenContent continueProps={{ href: '/' }}>
        <Typography variant="h1">{t('enterVerificationCode')}</Typography>
        <TextInput />
        <Typography>{t('instructions')}</Typography>
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
