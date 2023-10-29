import { usePrefetchOnAppStart } from '@/modules/backend/hooks/usePrefetchOnAppStart'

/** A component that is always present and is inside all global providers */
const OmnipresentComponent = () => {
  usePrefetchOnAppStart()

  return null
}

export default OmnipresentComponent
