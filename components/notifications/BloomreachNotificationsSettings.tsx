import { BloomreachNotificationControls } from '@/components/notifications/BloomreachNotificationControls'
import { BloomreachNotificationCallout } from '@/components/notifications/BloomreachNotificationsCallout'
import { useAuthStoreContext } from '@/state/AuthStoreProvider/useAuthStoreContext'

export const BloomreachNotificationSettings = () => {
  const { bloomreachId } = useAuthStoreContext()

  if (!bloomreachId) {
    return <BloomreachNotificationCallout />
  }

  return <BloomreachNotificationControls />
}
