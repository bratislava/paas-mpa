import { Link } from 'expo-router'
import { View } from 'react-native'

import Button from '@/components/shared/Button'
import ScreenContent from '@/components/shared/ScreenContent'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'

const Page = () => {
  const t = useTranslation('Navigation')

  return (
    <View>
      <ScreenContent>
        <Typography>Intro</Typography>

        <Link asChild href="/onboarding/enter-phone-number">
          <Button title={t('continue')} />
        </Link>
      </ScreenContent>
    </View>
  )
}

export default Page
