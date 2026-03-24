import { router } from 'expo-router'
import { View } from 'react-native'

import { NotificationBellAvatar } from '@/assets/avatars'
import Modal from '@/components/screen-layout/Modal/Modal'
import ModalContent from '@/components/screen-layout/Modal/ModalContent'
import Button from '@/components/shared/Button'
import Typography from '@/components/shared/Typography'
import { useBloomreachNotificationModalStorage } from '@/hooks/storage/useBloomreachNotificationModalStorage'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuthStoreContext } from '@/state/AuthStoreProvider/useAuthStoreContext'

export const BloomreachNotificationModal = () => {
  const { t } = useTranslation()
  const { bloomreachId, isLoading } = useAuthStoreContext()
  const { shouldShowModal, snoozeForWeek, dismissPermanently } =
    useBloomreachNotificationModalStorage()

  if (isLoading || bloomreachId || !shouldShowModal) {
    return null
  }

  const handleLearnMore = () => {
    dismissPermanently()
    router.push('/settings/notifications')
  }

  return (
    <Modal visible onRequestClose={snoozeForWeek}>
      <ModalContent className="g-6">
        <View className="items-center">
          <NotificationBellAvatar />
        </View>

        <View className="g-2">
          <Typography variant="h1" className="text-center">
            {t('bloomreachNotifications.modal.title')}
          </Typography>
          <Typography className="text-center">{t('bloomreachNotifications.modal.text')}</Typography>
        </View>

        <View className="g-2">
          <Button variant="primary" onPress={handleLearnMore}>
            {t('bloomreachNotifications.modal.actionConfirm')}
          </Button>
          <Button variant="secondary" onPress={snoozeForWeek}>
            {t('bloomreachNotifications.modal.actionCancel')}
          </Button>
          <Button variant="tertiary" onPress={dismissPermanently}>
            {t('bloomreachNotifications.modal.actionDismiss')}
          </Button>
        </View>
      </ModalContent>
    </Modal>
  )
}
