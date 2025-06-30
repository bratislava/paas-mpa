import { router } from 'expo-router'
import { useEffect, useState } from 'react'

import AvatarCircleFeedbackForm from '@/components/info/AvatarCircleFeedbackForm'
import Modal from '@/components/screen-layout/Modal/Modal'
import ModalContentWithActions from '@/components/screen-layout/Modal/ModalContentWithActions'
import { useQuestionnaireStorage } from '@/hooks/useQuestionnaireStorage'
import { useQuestionnaireContext } from '@/state/QuestionnaireProvider/useQuestionnaireContext'

export const QuestionnaireModal = () => {
  const questionnaire = useQuestionnaireContext()

  const { hasQuestionnaireBeenShown, markQuestionnaireAsShown } = useQuestionnaireStorage()
  const [isQuestionnaireModalOpen, setIsQuestionnaireModalOpen] = useState(false)

  useEffect(() => {
    if (questionnaire && !hasQuestionnaireBeenShown(questionnaire.id)) {
      setIsQuestionnaireModalOpen(true)
    }
  }, [questionnaire, hasQuestionnaireBeenShown])

  if (!questionnaire) return null

  const handleModalClose = () => {
    markQuestionnaireAsShown(questionnaire.id)

    setIsQuestionnaireModalOpen(false)
  }

  const handleQuestionnaireRedirect = () => {
    handleModalClose()
    router.push(`questionnaire/${questionnaire.id}`)
  }

  return (
    <Modal visible={isQuestionnaireModalOpen} onRequestClose={handleModalClose}>
      <ModalContentWithActions
        customAvatarComponent={<AvatarCircleFeedbackForm />}
        title={questionnaire.title}
        text={questionnaire.description}
        primaryActionLabel={questionnaire.ctaText}
        primaryActionOnPress={handleQuestionnaireRedirect}
        secondaryActionLabel={questionnaire.secondaryCtaText}
        secondaryActionOnPress={handleModalClose}
      />
    </Modal>
  )
}
