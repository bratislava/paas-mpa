import { Link } from 'expo-router'
import { ScrollView } from 'react-native'

import { ImageNotificationPermission } from '@/assets/onboarding-slides'
import ContinueButton from '@/components/navigation/ContinueButton'
import { BloomreachNotificationInfoScreenItem } from '@/components/notifications/BloomreachNotificationInfoScreen'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenViewCentered from '@/components/screen-layout/ScreenViewCentered'
import { useTranslation } from '@/hooks/useTranslation'

const NotificationsWhyPage = () => {
  const { t } = useTranslation()

  return (
    <ScreenViewCentered
      title={t('Settings.title')}
      actionButton={
        <Link asChild href="/settings/notifications/how">
          <ContinueButton />
        </Link>
      }
      backgroundVariant="white"
    >
      <ScrollView className="h-full">
        <ScreenContent className="flex-1">
          <BloomreachNotificationInfoScreenItem
            title={t('bloomreachNotifications.why.title')}
            items={t('bloomreachNotifications.why.items', { returnObjects: true })}
            icon={<ImageNotificationPermission width="100%" height="100%" />}
          />
        </ScreenContent>
      </ScrollView>
    </ScreenViewCentered>
  )
}

export default NotificationsWhyPage
