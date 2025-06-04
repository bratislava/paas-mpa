import { router } from 'expo-router'
import { useEffect, useState } from 'react'

import AvatarCircleFeedbackForm from '@/components/info/AvatarCircleFeedbackForm'
import Modal from '@/components/screen-layout/Modal/Modal'
import ModalContentWithActions from '@/components/screen-layout/Modal/ModalContentWithActions'
import { useQuestionerStorage } from '@/hooks/useQuestionerStorage'
import { useQuestionerContext } from '@/state/QuestionerProvider/useQuestionerContext'

export const QuestionerModal = () => {
  const questioner = useQuestionerContext()

  const { hasQuestionerBeenShown, markQuestionerAsShown } = useQuestionerStorage()
  const [isQuestionerModalOpen, setIsQuestionerModalOpen] = useState(false)

  const handleModalClose = () => {
    if (questioner) {
      markQuestionerAsShown(questioner.id)
    }
    setIsQuestionerModalOpen(false)
  }

  useEffect(() => {
    if (questioner && !hasQuestionerBeenShown(questioner.id)) {
      setIsQuestionerModalOpen(true)
    }
  }, [questioner, hasQuestionerBeenShown])

  if (!questioner) return null

  const handleQuestionerRedirect = () => {
    handleModalClose()
    router.push(`questioner/${questioner.id}`)
  }

  return (
    <Modal visible={isQuestionerModalOpen} onRequestClose={handleModalClose}>
      <ModalContentWithActions
        customAvatarComponent={<AvatarCircleFeedbackForm />}
        testID="addParkingCardsModal"
        title={questioner.title}
        text={questioner.description}
        primaryActionLabel={questioner.buttonText}
        primaryActionOnPress={handleQuestionerRedirect}
        secondaryActionLabel={questioner.buttonText}
        secondaryActionOnPress={handleModalClose}
      />
    </Modal>
  )
}
