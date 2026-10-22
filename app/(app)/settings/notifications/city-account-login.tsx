import * as Sentry from '@sentry/react-native'
import { getCurrentUser, updateUserAttribute } from 'aws-amplify/auth'
import { router } from 'expo-router'
import { useState } from 'react'
import { ScrollView } from 'react-native'

import { ImageDataSecurity } from '@/assets/onboarding-slides'
import { BloomreachNotificationInfoScreenItem } from '@/components/notifications/BloomreachNotificationInfoScreen'
import { acceptParkingConsents, configureExponea } from '@/components/notifications/utils'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenViewCentered from '@/components/screen-layout/ScreenViewCentered'
import { useSnackbar } from '@/components/screen-layout/Snackbar/useSnackbar'
import Button from '@/components/shared/Button'
import { environment } from '@/environment'
import { useTranslation } from '@/hooks/useTranslation'
import { useCityAccountSignIn } from '@/modules/auth/hooks/useCityAccountSignIn'
import { useAuthStoreUpdateContext } from '@/state/AuthStoreProvider/useAuthStoreUpdateContext'

const redirectToNotificationsResult = (status: 'success' | 'error') => {
  router.replace({ pathname: '/settings/notifications/result', params: { status } })
}

const NotificationsHowPage = () => {
  const { t } = useTranslation()
  const { signIn } = useCityAccountSignIn()
  const updateAuthStore = useAuthStoreUpdateContext()
  const snackbar = useSnackbar()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    /* Guards the error screen: once the account is linked, no later failure may claim otherwise. */
    let isAccountLinked = false

    try {
      const res = await signIn()

      if (!res?.accessToken) return

      const user = await getCurrentUser()

      if (!user.signInDetails?.loginId) {
        redirectToNotificationsResult('error')

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
        redirectToNotificationsResult('error')

        return
      }

      const data = await fetchResponse.json()

      if (!data.bloomreachContactId) {
        redirectToNotificationsResult('error')

        return
      }

      await updateUserAttribute({
        userAttribute: {
          attributeKey: 'custom:bloomreachId',
          value: data.bloomreachContactId,
        },
      })
      isAccountLinked = true

      updateAuthStore({ bloomreachId: data.bloomreachContactId })

      // Set PARKING-GENERAL, PARKING-FINE-EMAIL, PARKING-FINE-SMS consents to true
      acceptParkingConsents({
        onConsentFailed: () =>
          snackbar.show(t('bloomreachNotifications.consents.setupFailed'), { variant: 'warning' }),
      })

      try {
        await configureExponea(data.bloomreachContactId, user.signInDetails.loginId)
      } catch (error) {
        /* Recoverable - AuthStoreProvider configures Exponea again on the next app start. */
        Sentry.captureException(error, { tags: { feature: 'configure-exponea' } })
      }
      redirectToNotificationsResult('success')
    } catch {
      if (isAccountLinked) {
        redirectToNotificationsResult('success')
      } else {
        redirectToNotificationsResult('error')
      }
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
