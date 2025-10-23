import { router } from 'expo-router'

import { NotificationBellAvatar } from '@/assets/avatars'
import Modal from '@/components/screen-layout/Modal/Modal'
import ModalContentWithActions from '@/components/screen-layout/Modal/ModalContentWithActions'
import { useBloomreachNotificationModalStorage } from '@/hooks/storage/useBloomreachNotificationModalStorage'
import { useTranslation } from '@/hooks/useTranslation'

export const BloomreachNotificationModal = () => {
  const { t } = useTranslation()

  const [bloomreachNotificationModalShown, setBloomreachNotificationModalShown] =
    useBloomreachNotificationModalStorage()

  const handleModalClose = () => {
    setBloomreachNotificationModalShown(true)
  }

  const handleBloomreachNotificationRedirect = () => {
    handleModalClose()
    router.push('/notifications/settings')
  }

  return (
    <Modal visible={!bloomreachNotificationModalShown} onRequestClose={handleModalClose}>
      <ModalContentWithActions
        customAvatarComponent={<NotificationBellAvatar />}
        title={t('bloomreachNotifications.modal.title')}
        text={t('bloomreachNotifications.modal.text')}
        primaryActionLabel={t('bloomreachNotifications.modal.actionConfirm')}
        primaryActionOnPress={handleBloomreachNotificationRedirect}
        secondaryActionLabel={t('bloomreachNotifications.modal.actionCancel')}
        secondaryActionOnPress={handleModalClose}
      />
    </Modal>
  )
}
