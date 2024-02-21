import AxiosConnection from '@/components/special/AxiosConnection'
import NetworkConnection from '@/components/special/NetworkConnection'
import { usePrefetchOnAppStart } from '@/modules/backend/hooks/usePrefetchOnAppStart'

/** A component that is always present and is inside all global providers */
const OmnipresentComponent = () => {
  usePrefetchOnAppStart()

  return (
    <>
      <AxiosConnection />
      <NetworkConnection />
    </>
  )
}

export default OmnipresentComponent
