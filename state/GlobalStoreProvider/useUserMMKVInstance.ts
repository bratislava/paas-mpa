import { useGlobalStoreContext } from '@/state/GlobalStoreProvider/useGlobalStoreContext'

export const useUserMMKVInstance = () => {
  const { mmkvStorage } = useGlobalStoreContext()

  return mmkvStorage
}
