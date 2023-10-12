import { useQuery } from '@tanstack/react-query'

import NotificationControl from '@/components/controls/notifications/NotificationControl'
import Field from '@/components/shared/Field'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import { SaveUserSettingsDto } from '@/modules/backend/openapi-generated'

const NotificationSettings = () => {
  const t = useTranslation('Settings')

  const { data: response, refetch } = useQuery({
    queryKey: ['NotificationSetting'],
    queryFn: () => clientApi.usersControllerGetUserSettings(),
  })

  if (!response?.data) {
    return null
  }

  // TODO catch error
  const saveNotifications = async (value: SaveUserSettingsDto) => {
    try {
      await clientApi.usersControllerSaveUserSettings(value)
      await refetch()
    } catch (error) {
      console.log(error)
    }
  }

  const notificationSettings = response.data

  const pushNotifications = [
    {
      name: 'pushNotificationsAboutToEnd',
      value: notificationSettings.pushNotificationsAboutToEnd,
    },
    {
      name: 'pushNotificationsToEnd',
      value: notificationSettings.pushNotificationsToEnd,
    },
  ] as const

  const emailNotifications = [
    {
      name: 'emailNotificationsAboutToEnd',
      value: notificationSettings.emailNotificationsAboutToEnd,
    },
    {
      name: 'emailNotificationsToEnd',
      value: notificationSettings.emailNotificationsToEnd,
    },
  ] as const

  return (
    <>
      <Field label={t('pushNotifications')}>
        {pushNotifications.map((setting) => (
          <NotificationControl
            key={setting.name}
            notificationName={setting.name}
            value={setting.value}
            onValueChange={() =>
              saveNotifications({
                ...notificationSettings,
                [setting.name]: !setting.value,
              })
            }
          />
        ))}
      </Field>

      <Field label={t('emailNotifications')}>
        {emailNotifications.map((setting) => (
          <NotificationControl
            key={setting.name}
            notificationName={setting.name}
            value={setting.value}
            onValueChange={() =>
              saveNotifications({
                ...notificationSettings,
                [setting.name]: !setting.value,
              })
            }
          />
        ))}
      </Field>
    </>
  )
}

export default NotificationSettings
