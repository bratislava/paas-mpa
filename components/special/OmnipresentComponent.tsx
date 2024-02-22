import AxiosConnection from '@/components/special/AxiosConnection'
import NetworkConnection from '@/components/special/NetworkConnection'
import StoreVersionControl from '@/components/special/StoreVersionControl'
import { usePrefetchOnAppStart } from '@/modules/backend/hooks/usePrefetchOnAppStart'

/** A component that is always present and is inside all global providers */
const OmnipresentComponent = () => {
  usePrefetchOnAppStart()

  return (
    <>
      <AxiosConnection />
      <NetworkConnection />
      <StoreVersionControl />
    </>
  )
}

export default OmnipresentComponent
