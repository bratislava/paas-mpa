import { router, Stack } from 'expo-router'
import { useCallback } from 'react'

import ContinueButton from '@/components/navigation/ContinueButton'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import ScreenViewCentered from '@/components/screen-layout/ScreenViewCentered'
import { useTranslation } from '@/hooks/useTranslation'

const FeedbackSuccessScreen = () => {
  const t = useTranslation('FeedbackScreen.success')

  const handleContinue = useCallback(() => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/')
    }
  }, [])

  return (
    <ScreenViewCentered
      backgroundVariant="dots"
      actionButton={<ContinueButton onPress={handleContinue} />}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <ContentWithAvatar title={t('title')} text={t('text')} variant="success" />
    </ScreenViewCentered>
  )
}

export default FeedbackSuccessScreen
