import { Link } from 'expo-router'
import { ScrollView } from 'react-native'

import { ImageDataSecurity } from '@/assets/onboarding-slides'
import ContinueButton from '@/components/navigation/ContinueButton'
import { BloomreachNotificationInfoScreenItem } from '@/components/notifications/BloomreachNotificationInfoScreen'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenViewCentered from '@/components/screen-layout/ScreenViewCentered'
import { useTranslation } from '@/hooks/useTranslation'

const NotificationsHowPage = () => {
  const { t } = useTranslation()

  return (
    <ScreenViewCentered
      title={t('Settings.title')}
      actionButton={
        <Link href="/settings/notifications/login" asChild>
          <ContinueButton>{t('bloomreachNotification.how.action')}</ContinueButton>
        </Link>
      }
      backgroundVariant="white"
    >
      <ScrollView className="h-full">
        <ScreenContent className="flex-1">
          <BloomreachNotificationInfoScreenItem
            title={t('bloomreachNotifications.how.title')}
            items={t('bloomreachNotifications.how.items', { returnObjects: true })}
            icon={<ImageDataSecurity width="100%" height="100%" />}
          />
        </ScreenContent>
      </ScrollView>
    </ScreenViewCentered>
  )
}

export default NotificationsHowPage
