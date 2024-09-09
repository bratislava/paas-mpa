import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { RouteComponentProps } from '@/app/permissions'
import { ImageNotificationPermission } from '@/assets/onboarding-slides'
import { PermissionsSlide } from '@/components/special/permissions/PermissionsSlide'
import { clientApi } from '@/modules/backend/client-api'
import { SaveUserSettingsDto } from '@/modules/backend/openapi-generated'
import { useNotificationPermission } from '@/modules/map/hooks/useNotificationPermission'
import { UnifiedPermissionStatus } from '@/utils/types'

export const NotificationPermissions = ({ onContinue }: RouteComponentProps) => {
  const { t } = useTranslation()

  const { notificationPermissionStatus, requestNotificationPermissionAndRegisterDevice } =
    useNotificationPermission()

  const { mutate: mutateSaveSetting } = useMutation({
    mutationFn: (body: SaveUserSettingsDto) => clientApi.usersControllerSaveUserSettings(body),
  })

  useEffect(() => {
    if (notificationPermissionStatus !== UnifiedPermissionStatus.UNDETERMINED) {
      onContinue()
    }
  }, [onContinue, notificationPermissionStatus])

  const onPress = async () => {
    const result = await requestNotificationPermissionAndRegisterDevice()

    if (result === UnifiedPermissionStatus.GRANTED) {
      mutateSaveSetting({ pushNotificationsAboutToEnd: true, pushNotificationsToEnd: true })
    }
  }

  return (
    <PermissionsSlide
      title={t('PermissionsScreen.notifications.title')}
      text={t('PermissionsScreen.notifications.text')}
      SvgImage={ImageNotificationPermission}
      onPress={onPress}
    />
  )
}
