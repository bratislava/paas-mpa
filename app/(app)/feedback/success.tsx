import { router } from 'expo-router'
import { useCallback } from 'react'

import ContinueButton from '@/components/navigation/ContinueButton'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import ScreenViewCentered from '@/components/screen-layout/ScreenViewCentered'
import { useTranslation } from '@/hooks/useTranslation'

const FeedbackSuccessScreen = () => {
  const { t } = useTranslation()

  const handleContinue = useCallback(() => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.dismissTo('/')
    }
  }, [])

  return (
    <ScreenViewCentered
      options={{ headerShown: false }}
      backgroundVariant="dots"
      actionButton={<ContinueButton onPress={handleContinue} />}
    >
      <ContentWithAvatar
        title={t('FeedbackScreen.success.title')}
        text={t('FeedbackScreen.success.text')}
        variant="success"
      />
    </ScreenViewCentered>
  )
}

export default FeedbackSuccessScreen
