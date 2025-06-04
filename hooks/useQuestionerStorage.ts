import { useUserMMKVInstance } from '@/state/AuthStoreProvider/useUserMMKVInstance'

const QUESTIONER_SHOWN_PREFIX = 'questioner_shown_'

export const useQuestionerStorage = () => {
  const storage = useUserMMKVInstance()

  const hasQuestionerBeenShown = (questionerId: string | number): boolean => {
    return storage.getBoolean(`${QUESTIONER_SHOWN_PREFIX}${questionerId}`) ?? false
  }

  const markQuestionerAsShown = (questionerId: string | number): void => {
    storage.set(`${QUESTIONER_SHOWN_PREFIX}${questionerId}`, true)
  }

  return {
    hasQuestionerBeenShown,
    markQuestionerAsShown,
  }
}
