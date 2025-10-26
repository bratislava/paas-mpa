import { BloomreachNotificationControls } from '@/components/notifications/BloomreachNotificationControls'
import { BloomreachNotificationCallout } from '@/components/notifications/BloomreachNotificationsCallout'

export const BloomreachNotificationSettings = () => {
  return (
    <>
      <BloomreachNotificationCallout />

      <BloomreachNotificationControls />
    </>
  )
}
