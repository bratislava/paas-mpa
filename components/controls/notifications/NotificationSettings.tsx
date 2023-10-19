import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import NotificationControl from '@/components/controls/notifications/NotificationControl'
import Field from '@/components/shared/Field'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import { SaveUserSettingsDto } from '@/modules/backend/openapi-generated'

const notificationSettingsQueryKey = ['NotificationSetting']

/*
 * TODO
 *  - handle error with snackbar
 *  - refetch on focus - otherwise previousData are undefined
 *  - typescript types
 *  - add email notifications
 *
 */
const NotificationSettings = () => {
  const t = useTranslation('Settings')
  const queryClient = useQueryClient()

  const { data: response } = useQuery({
    queryKey: notificationSettingsQueryKey,
    queryFn: () => clientApi.usersControllerGetUserSettings(),
  })

  const mutation = useMutation({
    mutationFn: (body: SaveUserSettingsDto) => clientApi.usersControllerSaveUserSettings(body),

    // Optimistic update docs: https://tanstack.com/query/latest/docs/react/guides/optimistic-updates
    // When mutate is called:
    onMutate: async (changedSettings) => {
      console.log('onMutate', changedSettings)
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: notificationSettingsQueryKey })

      // Snapshot the previous value
      const previousSettings = queryClient.getQueryData(notificationSettingsQueryKey)

      // Optimistically update to the new value
      queryClient.setQueryData(notificationSettingsQueryKey, (old) => ({
        // @ts-ignore
        ...old,
        ...changedSettings,
      }))

      // Return a context object with the snapshot value
      return { previousSettings }
    },

    // TODO handle error - show snackbar?
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (error, changedSettings, context) => {
      queryClient.setQueryData(notificationSettingsQueryKey, context?.previousSettings)
      console.log(error)
    },

    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationSettingsQueryKey })
    },
  })

  if (!response?.data) {
    return null
  }

  const saveNotifications = async (value: SaveUserSettingsDto) => {
    mutation.mutate(value)
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

  // TODO email notifications are not supported yet
  // const emailNotifications = [
  //   {
  //     name: 'emailNotificationsAboutToEnd',
  //     value: notificationSettings.emailNotificationsAboutToEnd,
  //   },
  //   {
  //     name: 'emailNotificationsToEnd',
  //     value: notificationSettings.emailNotificationsToEnd,
  //   },
  // ] as const

  return (
    <>
      <Field label={t('pushNotifications')}>
        {pushNotifications.map((setting) => (
          <NotificationControl
            key={setting.name}
            notificationName={setting.name}
            value={setting.value}
            onValueChange={() => saveNotifications({ [setting.name]: !setting.value })}
          />
        ))}
      </Field>

      {/* <Field label={t('emailNotifications')}> */}
      {/*   {emailNotifications.map((setting) => ( */}
      {/*     <NotificationControl */}
      {/*       key={setting.name} */}
      {/*       notificationName={setting.name} */}
      {/*       value={setting.value} */}
      {/*       onValueChange={() => */}
      {/*         saveNotifications({ */}
      {/*           ...notificationSettings, */}
      {/*           [setting.name]: !setting.value, */}
      {/*         }) */}
      {/*       } */}
      {/*     /> */}
      {/*   ))} */}
      {/* </Field> */}
    </>
  )
}

export default NotificationSettings
