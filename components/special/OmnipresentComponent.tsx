import { useAxiosResponseInterceptors } from '@/modules/backend/hooks/useAxiosResponseInterceptors'
import { usePrefetchOnAppStart } from '@/modules/backend/hooks/usePrefetchOnAppStart'

/** A component that is always present and is inside all global providers */
const OmnipresentComponent = () => {
  usePrefetchOnAppStart()
  useAxiosResponseInterceptors()

  return null
}

export default OmnipresentComponent
