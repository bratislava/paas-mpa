import { usePrefetchOnAppStart } from '@/modules/backend/hooks/usePrefetchOnAppStart'

const OmnipresentComponent = () => {
  usePrefetchOnAppStart()

  return null
}

export default OmnipresentComponent
