import NoConnectionModal from '@/components/special/NoConnectionModal'
import StoreVersionControl from '@/components/special/StoreVersionControl'
import { useOpenAppFromNotification } from '@/hooks/useOpenAppFromNotification'
import { usePrefetchOnAppStart } from '@/modules/backend/hooks/usePrefetchOnAppStart'

/** A component that is always present and is inside all global providers */
const OmnipresentComponent = () => {
  usePrefetchOnAppStart()
  useOpenAppFromNotification()

  return (
    <>
      <NoConnectionModal />
      <StoreVersionControl />
    </>
  )
}

export default OmnipresentComponent
