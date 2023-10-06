import { useContext } from 'react'

import { GlobalStoreContext } from '@/state/GlobalStoreProvider'

export const useGlobalStoreContext = () => useContext(GlobalStoreContext)
