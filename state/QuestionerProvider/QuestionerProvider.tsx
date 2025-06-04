import { useQuery } from '@tanstack/react-query'
import { createContext, PropsWithChildren } from 'react'

import { useLocale } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import { FeedbackFormDto } from '@/modules/backend/openapi-generated'

export const QuestionerContext = createContext<FeedbackFormDto | null | undefined>(null)

const QuestionerProvider = ({ children }: PropsWithChildren) => {
  const locale = useLocale()

  const query = useQuery({
    queryKey: ['Questioner', locale],
    queryFn: () => clientApi.feedbackFormsControllerFeedbackFormsGetMany(),
    select: (res) => res.data,
  })

  return (
    <QuestionerContext.Provider value={query.data?.feedbackForms[0]}>
      {children}
    </QuestionerContext.Provider>
  )
}

export default QuestionerProvider
