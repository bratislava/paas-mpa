import { useQuery } from '@tanstack/react-query'
import { createContext, PropsWithChildren } from 'react'

import { useLocale } from '@/hooks/useTranslation'
import { questionnairesOptions } from '@/modules/backend/constants/queryOptions'
import { FeedbackFormDto, Language } from '@/modules/backend/openapi-generated'
import { ApplicationLocale } from '@/modules/map/types'

export const QuestionnaireContext = createContext<FeedbackFormDto[] | null | undefined>(null)

const localeMap: Record<ApplicationLocale, Language> = {
  en: Language.En,
  sk: Language.Sk,
}

const QuestionnaireProvider = ({ children }: PropsWithChildren) => {
  const locale = useLocale()

  const query = useQuery(questionnairesOptions(localeMap[locale]))

  return (
    <QuestionnaireContext.Provider value={query.data?.feedbackForms}>
      {children}
    </QuestionnaireContext.Provider>
  )
}

export default QuestionnaireProvider
