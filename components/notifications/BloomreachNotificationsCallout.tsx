import { Link } from 'expo-router'

import { NotificationBellAvatar } from '@/assets/avatars'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import Button from '@/components/shared/Button'
import { useTranslation } from '@/hooks/useTranslation'

export const BloomreachNotificationCallout = () => {
  const { t } = useTranslation()

  return (
    <ContentWithAvatar
      title={t('bloomreachNotifications.callout.title')}
      text={t('bloomreachNotifications.callout.text')}
      customAvatarComponent={<NotificationBellAvatar />}
      actionButton={
        <Link asChild href="/settings/notifications">
          <Button>{t('bloomreachNotifications.callout.action')}</Button>
        </Link>
      }
    />
  )
}
