import { useQuery } from '@tanstack/react-query'
import { createContext, PropsWithChildren } from 'react'

import { useQuestionnaireStorage } from '@/hooks/useQuestionnaireStorage'
import { useLocale } from '@/hooks/useTranslation'
import { questionnairesOptions } from '@/modules/backend/constants/queryOptions'
import { FeedbackFormDto, Language } from '@/modules/backend/openapi-generated'
import { ApplicationLocale } from '@/modules/map/types'

export const QuestionnaireContext = createContext<FeedbackFormDto | null | undefined>(null)

const localeMap: Record<ApplicationLocale, Language> = {
  en: Language.En,
  sk: Language.Sk,
}

const QuestionnaireProvider = ({ children }: PropsWithChildren) => {
  const locale = useLocale()
  const { hasQuestionnaireBeenShown } = useQuestionnaireStorage()

  const query = useQuery(questionnairesOptions(localeMap[locale]))

  const notShownQuestionnaire = query.data?.feedbackForms.find(
    (form) => !hasQuestionnaireBeenShown(form.id),
  )

  return (
    // Show the questionnaire that was not shown yet (most likely there is only one)
    // If all questionnaires were shown, show most recent one (so user can access it again in menu)
    <QuestionnaireContext.Provider value={notShownQuestionnaire ?? query.data?.feedbackForms[0]}>
      {children}
    </QuestionnaireContext.Provider>
  )
}

export default QuestionnaireProvider
