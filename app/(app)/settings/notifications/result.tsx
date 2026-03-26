import { router, useLocalSearchParams } from 'expo-router'
import { View } from 'react-native'

import ContinueButton from '@/components/navigation/ContinueButton'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import ScreenViewCentered from '@/components/screen-layout/ScreenViewCentered'
import Button from '@/components/shared/Button'
import { useTranslation } from '@/hooks/useTranslation'

type NotificationsResultSearchParams = {
  status: 'success' | 'error'
}

const NotificationsResultPage = () => {
  const { t } = useTranslation()
  const { status } = useLocalSearchParams<NotificationsResultSearchParams>()

  return (
    <ScreenViewCentered
      options={{ headerShown: false }}
      backgroundVariant={status === 'error' ? 'dots' : undefined}
      actionButton={
        status === 'error' ? (
          <View className="g-3">
            <ContinueButton
              onPress={() => router.replace('/settings/notifications/city-account-login')}
            >
              {t('bloomreachNotifications.result.error.action')}
            </ContinueButton>

            <Button variant="tertiary" onPress={() => router.replace('/')}>
              {t('Navigation.backToMap')}
            </Button>
          </View>
        ) : (
          <ContinueButton onPress={() => router.replace('/')}>
            {t('bloomreachNotifications.result.success.action')}
          </ContinueButton>
        )
      }
    >
      {status === 'error' ? (
        <ContentWithAvatar
          variant="error"
          title={t('bloomreachNotifications.result.error.title')}
          text={t('bloomreachNotifications.result.error.text')}
        />
      ) : (
        <ContentWithAvatar
          variant="success"
          title={t('bloomreachNotifications.result.success.title')}
          text={t('bloomreachNotifications.result.success.text')}
        />
      )}
    </ScreenViewCentered>
  )
}

export default NotificationsResultPage
