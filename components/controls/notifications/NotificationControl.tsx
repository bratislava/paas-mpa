import SwitchControl, {
  SwitchControlProps,
} from '@/components/controls/notifications/SwitchControl'
import { useTranslation } from '@/hooks/useTranslation'

type Props = {
  notificationName:
    | 'pushNotificationsAboutToEnd'
    | 'pushNotificationsToEnd'
    | 'emailNotificationsAboutToEnd'
    | 'emailNotificationsToEnd'
} & Omit<SwitchControlProps, 'title' | 'description' | 'accessibilityLabel'>

const NotificationControl = ({ notificationName, ...rest }: Props) => {
  const { t } = useTranslation()

  // TODO test translations
  const translationsMap = {
    pushNotificationsAboutToEnd: {
      title: t('Settings.type.pushNotificationsAboutToEnd.title'),
      description: t('Settings.type.pushNotificationsAboutToEnd.description'),
      accessibilityLabel: t('Settings.type.pushNotificationsAboutToEnd.accessibilityLabel'),
    },
    pushNotificationsToEnd: {
      title: t('Settings.type.pushNotificationsToEnd.title'),
      description: t('Settings.type.pushNotificationsToEnd.description'),
      accessibilityLabel: t('Settings.type.pushNotificationsToEnd.accessibilityLabel'),
    },
    emailNotificationsAboutToEnd: {
      title: t('Settings.type.emailNotificationsAboutToEnd.title'),
      description: t('Settings.type.emailNotificationsAboutToEnd.description'),
      accessibilityLabel: t('Settings.type.emailNotificationsAboutToEnd.accessibilityLabel'),
    },
    emailNotificationsToEnd: {
      title: t('Settings.type.emailNotificationsToEnd.title'),
      description: t('Settings.type.emailNotificationsToEnd.description'),
      accessibilityLabel: t('Settings.type.emailNotificationsToEnd.accessibilityLabel'),
    },
  } satisfies Record<
    typeof notificationName,
    { title: string; description: string; accessibilityLabel: string }
  >

  return (
    <SwitchControl
      title={translationsMap[notificationName].title}
      description={translationsMap[notificationName].description}
      accessibilityLabel={translationsMap[notificationName].accessibilityLabel}
      {...rest}
    />
  )
}

export default NotificationControl
