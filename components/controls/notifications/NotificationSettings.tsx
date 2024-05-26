import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Linking } from 'react-native'

import NotificationControl from '@/components/controls/notifications/NotificationControl'
import LoadingScreen from '@/components/screen-layout/LoadingScreen'
import Field from '@/components/shared/Field'
import Panel from '@/components/shared/Panel'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import { settingsOptions } from '@/modules/backend/constants/queryOptions'
import { SaveUserSettingsDto } from '@/modules/backend/openapi-generated'
import { useNotificationPermission } from '@/modules/map/hooks/useNotificationPermission'
import { PermissionStatus } from '@/utils/types'

/*
 * TODO
 *  - handle error with snackbar
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
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [notificationsPermissionStatus] = useNotificationPermission({ autoAsk: true })

  const { data, isPending, isError, error } = useQueryWithFocusRefetch(settingsOptions())

  // cannot use `select: (res) => res.data` because of type error inside optimistic update
  const settings = data?.data

  const mutation = useMutation({
    mutationFn: (body: SaveUserSettingsDto) => clientApi.usersControllerSaveUserSettings(body),

    // When mutate is called:
    onMutate: async (changedSettings) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: settingsOptions().queryKey })

      // Snapshot the previous value
      const previousSettings = queryClient.getQueryData(settingsOptions().queryKey)

      if (previousSettings) {
        // Optimistically update to the new value
        queryClient.setQueryData(settingsOptions().queryKey, {
          ...previousSettings,
          data: { ...previousSettings.data, ...changedSettings },
        })
      }

      // Return a context object with the snapshot value
      return { previousSettings }
    },

    // TODO handle error - show snackbar?
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (error, changedSettings, context) => {
      queryClient.setQueryData(settingsOptions().queryKey, context?.previousSettings)
      console.log(error)
    },

    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: settingsOptions().queryKey })
    },
  })

  if (isPending) {
    return <LoadingScreen />
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
      value: settings?.pushNotificationsAboutToEnd,
    },
    {
      name: 'pushNotificationsToEnd',
      value: settings?.pushNotificationsToEnd,
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

  const arePermissionsDisabled = notificationsPermissionStatus !== PermissionStatus.GRANTED

  return (
    <>
      <Field label={t('Settings.pushNotifications')}>
        {arePermissionsDisabled ? (
          <Panel className="my-2 bg-warning-light px-5">
            <Typography>{t(`notificationsDisabled`)}</Typography>
            <PressableStyled className="inline-flex" onPress={() => Linking.openSettings()}>
              <Typography variant="default-bold">{t(`notificationButtonText`)}</Typography>
            </PressableStyled>
          </Panel>
        ) : null}

        {pushNotifications.map((setting) => (
          <NotificationControl
            key={setting.name}
            notificationName={setting.name}
            disabled={arePermissionsDisabled}
            value={arePermissionsDisabled ? false : !!setting.value}
            onValueChange={() => saveNotifications({ [setting.name]: !setting.value })}
          />
        ))}
      </Field>

      {/* <Field label={t('Settings.emailNotifications')}> */}
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
