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

  useEffect(() => {
    if (questioner && !hasQuestionerBeenShown(questioner.id)) {
      setIsQuestionerModalOpen(true)
    }
  }, [questioner, hasQuestionerBeenShown])

  if (!questioner) return null

  const handleModalClose = () => {
    markQuestionerAsShown(questioner.id)

    setIsQuestionerModalOpen(false)
  }

  const handleQuestionerRedirect = () => {
    handleModalClose()
    router.push(`questioner/${questioner.id}`)
  }

  return (
    <Modal visible={isQuestionerModalOpen} onRequestClose={handleModalClose}>
      <ModalContentWithActions
        customAvatarComponent={<AvatarCircleFeedbackForm />}
        title={questioner.title}
        text={questioner.description}
        primaryActionLabel={questioner.ctaText}
        primaryActionOnPress={handleQuestionerRedirect}
        secondaryActionLabel={questioner.secondaryCtaText}
        secondaryActionOnPress={handleModalClose}
      />
    </Modal>
  )
}
