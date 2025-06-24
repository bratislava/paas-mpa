import { useQuery } from '@tanstack/react-query'
import { createContext, PropsWithChildren } from 'react'

import { useQuestionerStorage } from '@/hooks/useQuestionerStorage'
import { useLocale } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import { FeedbackFormDto, Language } from '@/modules/backend/openapi-generated'
import { ApplicationLocale } from '@/modules/map/types'

export const QuestionerContext = createContext<FeedbackFormDto | null | undefined>(null)

const localeMap: Record<ApplicationLocale, Language> = {
  en: Language.En,
  sk: Language.Sk,
}

const QuestionerProvider = ({ children }: PropsWithChildren) => {
  const locale = useLocale()
  const { hasQuestionerBeenShown } = useQuestionerStorage()

  const query = useQuery({
    queryKey: ['Questioner', locale],
    queryFn: () => clientApi.feedbackFormsControllerFeedbackFormsGetMany(localeMap[locale]),
    select: (res) => res.data,
  })

  const notShownQuestioner = query.data?.feedbackForms.find(
    (form) => !hasQuestionerBeenShown(form.id),
  )

  return (
    // Show the questioner that was not shown yet (most likely there is only one)
    // If all questioners were shown, show most recent one (so user can access it again in menu)
    <QuestionerContext.Provider value={notShownQuestioner ?? query.data?.feedbackForms[0]}>
      {children}
    </QuestionerContext.Provider>
  )
}

export default QuestionerProvider
