import { useContext } from 'react'

import { QuestionnaireContext } from './QuestionnaireProvider'

export const useQuestionnaireContext = () => {
  const context = useContext(QuestionnaireContext)

  if (context === null) {
    throw new Error('useQuestionnairesContext must be used within a QuestionnaireProvider')
  }

  return context
}
