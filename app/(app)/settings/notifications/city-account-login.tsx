import { getCurrentUser, updateUserAttribute } from 'aws-amplify/auth'
import { router } from 'expo-router'
import { ScrollView } from 'react-native'

import { ImageDataSecurity } from '@/assets/onboarding-slides'
import { BloomreachNotificationInfoScreenItem } from '@/components/notifications/BloomreachNotificationInfoScreen'
import { configureExponea } from '@/components/notifications/utils'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenViewCentered from '@/components/screen-layout/ScreenViewCentered'
import Button from '@/components/shared/Button'
import { environment } from '@/environment'
import { useTranslation } from '@/hooks/useTranslation'
import { useCityAccountSignIn } from '@/modules/auth/hooks/useCityAccountSignIn'
import { clientApi } from '@/modules/backend/client-api'
import {
  TrackConsentChangePropertiesDtoActionEnum,
  TrackConsentChangePropertiesDtoCategoryEnum,
} from '@/modules/backend/openapi-generated'
import { useAuthStoreUpdateContext } from '@/state/AuthStoreProvider/useAuthStoreUpdateContext'

const NotificationsHowPage = () => {
  const { t } = useTranslation()
  const { signIn } = useCityAccountSignIn()
  const updateAuthStore = useAuthStoreUpdateContext()

  const handleSignIn = async () => {
    try {
      const res = await signIn()

      if (!res?.accessToken) return

      const user = await getCurrentUser()

      if (!user.signInDetails?.loginId) {
        router.replace({ pathname: '/settings/notifications/result', params: { status: 'error' } })

        return
      }

      const fetchResponse = await fetch(`${environment.cityAccountApiUrl}/paas-mpa/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${res.accessToken}`,
        },
        body: JSON.stringify({
          phoneNumber: user.signInDetails.loginId,
        }),
      })

      const data = await fetchResponse.json()

      if (!data.bloomreachContactId) {
        router.replace({ pathname: '/settings/notifications/result', params: { status: 'error' } })

        return
      }

      await updateUserAttribute({
        userAttribute: {
          attributeKey: 'custom:bloomreachId',
          value: data.bloomreachContactId,
        },
      })

      // Set PARKING-GENERAL and PARKING-FINE-EMAIL consents to true
      await clientApi.consentControllerTrackConsentChange({
        properties: {
          action: TrackConsentChangePropertiesDtoActionEnum.Accept,
          category: TrackConsentChangePropertiesDtoCategoryEnum.General,
          valid_until: 'unlimited',
        },
      })
      await clientApi.consentControllerTrackConsentChange({
        properties: {
          action: TrackConsentChangePropertiesDtoActionEnum.Accept,
          category: TrackConsentChangePropertiesDtoCategoryEnum.FineEmail,
          valid_until: 'unlimited',
        },
      })

      await configureExponea(data.bloomreachContactId, user.signInDetails.loginId)
      updateAuthStore({ bloomreachId: data.bloomreachContactId })

      router.replace({ pathname: '/settings/notifications/result', params: { status: 'success' } })
    } catch {
      router.replace({ pathname: '/settings/notifications/result', params: { status: 'error' } })
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
