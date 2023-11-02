import { useMutation, useQueryClient } from '@tanstack/react-query'

import NotificationControl from '@/components/controls/notifications/NotificationControl'
import Field from '@/components/shared/Field'
import Typography from '@/components/shared/Typography'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import { notificationSettingsOptions } from '@/modules/backend/constants/queryOptions'
import { SaveUserSettingsDto } from '@/modules/backend/openapi-generated'

/*
 * TODO
 *  - handle loading state
 *  - handle error with snackbar
 *  - refetch on focus - otherwise previousData are undefined
 *  - add email notifications
 *
 * Figma: https://www.figma.com/file/3TppNabuUdnCChkHG9Vft7/paas-mpa?type=design&node-id=486-2961&mode=design&t=z0hMnU6kV59bjya1-0
 *
 * Optimistic update docs: https://tanstack.com/query/latest/docs/react/guides/optimistic-updates
 *
 */

/**
 * We use `queryOptions` to leverage query type queryProvider functions (like queryClient.setQueryData)
 * Docs: https://tanstack.com/query/latest/docs/react/typescript#typing-query-options
 */

const NotificationSettings = () => {
  const t = useTranslation('Settings')
  const queryClient = useQueryClient()

  const {
    data: settings,
    isPending,
    isError,
    error,
  } = useQueryWithFocusRefetch(notificationSettingsOptions())

  const mutation = useMutation({
    mutationFn: (body: SaveUserSettingsDto) => clientApi.usersControllerSaveUserSettings(body),

    // When mutate is called:
    onMutate: async (changedSettings) => {
      console.log('onMutate', changedSettings)
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: notificationSettingsOptions().queryKey })

      // Snapshot the previous value
      const previousSettings = queryClient.getQueryData(notificationSettingsOptions().queryKey)

      // Optimistically update to the new value
      queryClient.setQueryData(notificationSettingsOptions().queryKey, (oldSettings) =>
        oldSettings
          ? {
              ...oldSettings,
              ...changedSettings,
            }
          : undefined,
      )

      // Return a context object with the snapshot value
      return { previousSettings }
    },

    // TODO handle error - show snackbar?
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (error, changedSettings, context) => {
      queryClient.setQueryData(notificationSettingsOptions().queryKey, context?.previousSettings)
      console.log(error)
    },

    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationSettingsOptions().queryKey })
    },
  })

  if (isPending) {
    return <Typography>Loading...</Typography>
  }

  if (isError) {
    return <Typography>Error: {error.message}</Typography>
  }

  const saveNotifications = async (value: SaveUserSettingsDto) => {
    mutation.mutate(value)
  }

  const pushNotifications = [
    {
      name: 'pushNotificationsAboutToEnd',
      value: settings.pushNotificationsAboutToEnd,
    },
    {
      name: 'pushNotificationsToEnd',
      value: settings.pushNotificationsToEnd,
    },
  ] as const

  // TODO add email notifications when they are supported
  // const emailNotifications = [
  //   {
  //     name: 'emailNotificationsAboutToEnd',
  //     value: settings.emailNotificationsAboutToEnd,
  //   },
  //   {
  //     name: 'emailNotificationsToEnd',
  //     value: settings.emailNotificationsToEnd,
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
      {/*           ...settings, */}
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
