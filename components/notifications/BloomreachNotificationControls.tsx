import { useQuery } from '@tanstack/react-query'
import exponea from 'react-native-exponea-sdk'

import SwitchControl from '@/components/controls/notifications/SwitchControl'
import Field from '@/components/shared/Field'
import { useTranslation } from '@/hooks/useTranslation'

export const BloomreachNotificationControls = () => {
  const { t } = useTranslation()

  const query = useQuery({
    queryKey: ['bloomreach-notifications'],
    queryFn: async () => {
      const isConfigured = await exponea.isConfigured()
      if (isConfigured) {
        return exponea.fetchConsents()
      }

      return null
    },
  })

  console.log(query.data)

  return (
    <>
      <Field label={t('bloomreachNotifications.fine.title')}>
        <SwitchControl
          title={t('bloomreachNotifications.fine.sms.title')}
          description={t('bloomreachNotifications.fine.sms.description')}
          accessibilityLabel={t('bloomreachNotifications.fine.sms.accessibilityLabel')}
          value
          onValueChange={() => {}}
        />
        <SwitchControl
          title={t('bloomreachNotifications.fine.push.title')}
          description={t('bloomreachNotifications.fine.push.description')}
          accessibilityLabel={t('bloomreachNotifications.fine.push.accessibilityLabel')}
          value={false}
          onValueChange={() => {}}
        />
      </Field>

      <Field label={t('bloomreachNotifications.expiration.title')}>
        <SwitchControl
          title={t('bloomreachNotifications.expiration.sms.title')}
          description={t('bloomreachNotifications.expiration.sms.description')}
          accessibilityLabel={t('bloomreachNotifications.expiration.sms.accessibilityLabel')}
          value
          onValueChange={() => {}}
        />
        <SwitchControl
          title={t('bloomreachNotifications.expiration.push.title')}
          description={t('bloomreachNotifications.expiration.push.description')}
          accessibilityLabel={t('bloomreachNotifications.expiration.push.accessibilityLabel')}
          value={false}
          onValueChange={() => {}}
        />
      </Field>
    </>
  )
}
