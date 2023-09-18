import { Link } from 'expo-router'
import { View } from 'react-native'

import TextInput from '@/components/inputs/TextInput'
import Button from '@/components/shared/Button'
import ScreenContent from '@/components/shared/ScreenContent'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'

const Page = () => {
  const t = useTranslation('Navigation')
  const tCode = useTranslation('EnterVerificationCode')

  return (
    <View>
      <ScreenContent>
        <Typography variant="h1">{tCode('enterVerificationCode')}</Typography>
        <TextInput />
        <Typography>{tCode('instructions')}</Typography>

        <Link asChild href="/">
          <Button title={t('continue')} />
        </Link>
      </ScreenContent>
    </View>
  )
}

export default Page
