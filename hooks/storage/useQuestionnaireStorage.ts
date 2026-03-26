import { useUserMMKVInstance } from '@/state/AuthStoreProvider/useUserMMKVInstance'

const QUESTIONNAIRE_SHOWN_PREFIX = 'questionnaire_shown_'

export const useQuestionnaireStorage = () => {
  const storage = useUserMMKVInstance()

  const hasQuestionnaireBeenShown = (questionnaireId: string | number): boolean => {
    return storage.getBoolean(`${QUESTIONNAIRE_SHOWN_PREFIX}${questionnaireId}`) ?? false
  }

  const markQuestionnaireAsShown = (questionnaireId: string | number): void => {
    storage.set(`${QUESTIONNAIRE_SHOWN_PREFIX}${questionnaireId}`, true)
  }

  return {
    hasQuestionnaireBeenShown,
    markQuestionnaireAsShown,
  }
}
