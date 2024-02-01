import SwitchControl, {
  SwitchControlProps,
} from '@/components/controls/notifications/SwitchControl'
import { useTranslation } from '@/hooks/useTranslation'

type Props = {
  notificationName: string
} & Omit<SwitchControlProps, 'title' | 'description' | 'accessibilityLabel'>

const NotificationControl = ({ notificationName, ...rest }: Props) => {
  const t = useTranslation('Settings')

  return (
    <SwitchControl
      title={t(`type.${notificationName}.title`)}
      description={t(`type.${notificationName}.description`)}
      accessibilityLabel={t(`type.${notificationName}.accessibilityLabel`)}
      {...rest}
    />
  )
}

export default NotificationControl
