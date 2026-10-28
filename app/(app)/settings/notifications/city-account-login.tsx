import { useQueryClient } from '@tanstack/react-query'
import { getCurrentUser, updateUserAttribute } from 'aws-amplify/auth'
import { router } from 'expo-router'
import { useState } from 'react'
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
import { consentsOptions } from '@/modules/backend/constants/queryOptions'
import {
  TrackConsentChangePropertiesDtoActionEnum,
  TrackConsentChangePropertiesDtoCategoryEnum,
} from '@/modules/backend/openapi-generated'
import { useAuthStoreUpdateContext } from '@/state/AuthStoreProvider/useAuthStoreUpdateContext'

const NotificationsHowPage = () => {
  const { t } = useTranslation()
  const { signIn } = useCityAccountSignIn()
  const updateAuthStore = useAuthStoreUpdateContext()
  const [isLoading, setIsLoading] = useState(false)

  const queryClient = useQueryClient()

  const handleSignIn = async () => {
    setIsLoading(true)
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

      if (!fetchResponse.ok) {
        router.replace({ pathname: '/settings/notifications/result', params: { status: 'error' } })

        return
      }

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

      // Set PARKING-GENERAL, PARKING-FINE-EMAIL, PARKING-FINE-SMS consents to true
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
      await clientApi.consentControllerTrackConsentChange({
        properties: {
          action: TrackConsentChangePropertiesDtoActionEnum.Accept,
          category: TrackConsentChangePropertiesDtoCategoryEnum.FineSms,
          valid_until: 'unlimited',
        },
      })

      // Invalidate consents query to refetch consents
      await queryClient.invalidateQueries({ queryKey: consentsOptions().queryKey })

      await configureExponea(data.bloomreachContactId, user.signInDetails.loginId)
      updateAuthStore({ bloomreachId: data.bloomreachContactId })

      router.replace({ pathname: '/settings/notifications/result', params: { status: 'success' } })
    } catch {
      router.replace({ pathname: '/settings/notifications/result', params: { status: 'error' } })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ScreenViewCentered
      title={t('Settings.title')}
      actionButton={
        <Button loading={isLoading} onPress={handleSignIn}>
          {t('bloomreachNotification.how.action')}
        </Button>
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
