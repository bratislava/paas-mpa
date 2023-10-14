import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useMemo,
  useState,
} from 'react'

import { MapFeaturesHashMapValue } from '@/state/types'

type MapFeatureHashMap = Map<number, MapFeaturesHashMapValue>

type ContextProps = {
  mapFeatures: MapFeatureHashMap | null
  setMapFeatures: Dispatch<SetStateAction<MapFeatureHashMap | null>>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signInResult: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSignInResult: Dispatch<SetStateAction<any>>
  signUpPhone: string | null
  setSignUpPhone: Dispatch<SetStateAction<string | null>>
}

export const GlobalStoreContext = createContext({} as ContextProps)

const GlobalStoreProvider = ({ children }: PropsWithChildren) => {
  const [mapFeatures, setMapFeatures] = useState<MapFeatureHashMap | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [signInResult, setSignInResult] = useState<any>(null)

  const [signUpPhone, setSignUpPhone] = useState<string | null>(null)

  const value = useMemo(
    () => ({
      mapFeatures,
      setMapFeatures,
      signInResult,
      setSignInResult,
      signUpPhone,
      setSignUpPhone,
    }),
    [signInResult, mapFeatures, signUpPhone],
  )

  return <GlobalStoreContext.Provider value={value}>{children}</GlobalStoreContext.Provider>
}

export default GlobalStoreProvider
