import { Link } from 'expo-router'
import { View } from 'react-native'

import TextInput from '@/components/inputs/TextInput'
import Button from '@/components/shared/Button'
import ScreenContent from '@/components/shared/ScreenContent'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'

const Page = () => {
  const t = useTranslation('Navigation')
  const tPhone = useTranslation('EnterPhoneNumber')

  return (
    <View>
      <ScreenContent>
        <Typography variant="h2">{tPhone('enterPhoneNumber')}</Typography>
        <TextInput />
        <Typography>{tPhone('consent')}</Typography>

        <Link asChild href="/onboarding/enter-verification-code">
          <Button title={t('continue')} />
        </Link>
      </ScreenContent>
    </View>
  )
}

export default Page
