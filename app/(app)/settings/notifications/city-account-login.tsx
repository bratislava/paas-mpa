import { getCurrentUser } from 'aws-amplify/auth'
import { ScrollView } from 'react-native'

import { ImageDataSecurity } from '@/assets/onboarding-slides'
import { BloomreachNotificationInfoScreenItem } from '@/components/notifications/BloomreachNotificationInfoScreen'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenViewCentered from '@/components/screen-layout/ScreenViewCentered'
import Button from '@/components/shared/Button'
import { environment } from '@/environment'
import { useTranslation } from '@/hooks/useTranslation'
import { useCityAccountSignIn } from '@/modules/auth/hooks/useCityAccountSignIn'

const NotificationsHowPage = () => {
  const { t } = useTranslation()
  const { signIn } = useCityAccountSignIn()

  const handleSignIn = async () => {
    try {
      const res = await signIn()

      if (res?.accessToken) {
        const user = await getCurrentUser()

        const fetchResponse = await fetch(`${environment.cityAccountApiUrl}/mpa/register-phone`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${res.accessToken}`,
          },
          body: JSON.stringify({
            phone: '+421912345670' || user.signInDetails?.loginId,
          }),
        })

        const data = await fetchResponse.json()

        console.log('fetchResponse data', data)
      }
    } catch (error) {
      console.log('Error during City Account sign-in:', error)
    }
  }

  return (
    <ScreenViewCentered
      title={t('Settings.title')}
      actionButton={
        <Button onPress={handleSignIn}>{t('bloomreachNotification.how.action')}</Button>
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
