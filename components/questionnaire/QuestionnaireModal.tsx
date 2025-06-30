import { router, usePathname } from 'expo-router'
import { useEffect, useState } from 'react'

import AvatarCircleFeedbackForm from '@/components/info/AvatarCircleFeedbackForm'
import Modal from '@/components/screen-layout/Modal/Modal'
import ModalContentWithActions from '@/components/screen-layout/Modal/ModalContentWithActions'
import { useQuestionnaireStorage } from '@/hooks/useQuestionnaireStorage'
import { FeedbackFormDto } from '@/modules/backend/openapi-generated'
import { useQuestionnaireContext } from '@/state/QuestionnaireProvider/useQuestionnaireContext'

export const QuestionnaireModal = () => {
  const questionnaires = useQuestionnaireContext()
  const pathname = usePathname()

  const { hasQuestionnaireBeenShown, markQuestionnaireAsShown } = useQuestionnaireStorage()

  const [shownQuestionnaire, setShownQuestionnaire] = useState<FeedbackFormDto | null>(null)

  useEffect(() => {
    // If the user is already on the questionnaire page, do not show the modal
    if (pathname.includes('questionnaire') || shownQuestionnaire) {
      return
    }
    // Find the first questionnaire that has not been shown yet
    const questionnaire = questionnaires?.find((q) => !hasQuestionnaireBeenShown(q.id))
    if (questionnaire) {
      setShownQuestionnaire(questionnaire)
    }
  }, [hasQuestionnaireBeenShown, pathname, shownQuestionnaire, questionnaires])

  if (!shownQuestionnaire) return null

  const handleModalClose = () => {
    markQuestionnaireAsShown(shownQuestionnaire.id)

    setShownQuestionnaire(null)
  }

  const handleQuestionnaireRedirect = () => {
    router.push(`questionnaire/${shownQuestionnaire.id}`)
    handleModalClose()
  }

  return (
    <Modal visible={!!shownQuestionnaire} onRequestClose={handleModalClose}>
      <ModalContentWithActions
        customAvatarComponent={<AvatarCircleFeedbackForm />}
        title={shownQuestionnaire.title}
        text={shownQuestionnaire.description}
        primaryActionLabel={shownQuestionnaire.ctaText}
        primaryActionOnPress={handleQuestionnaireRedirect}
        secondaryActionLabel={shownQuestionnaire.secondaryCtaText}
        secondaryActionOnPress={handleModalClose}
      />
    </Modal>
  )
}
