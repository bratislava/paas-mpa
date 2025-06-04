import { useContext } from 'react'

import { QuestionerContext } from './QuestionerProvider'

export const useQuestionerContext = () => {
  const context = useContext(QuestionerContext)

  if (context === null) {
    throw new Error('useQuestionersContext must be used within a QuestionerProvider')
  }

  return context
}
