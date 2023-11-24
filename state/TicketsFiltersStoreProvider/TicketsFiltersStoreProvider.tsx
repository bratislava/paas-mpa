import { createContext, PropsWithChildren, useCallback, useState } from 'react'

export type FilteringTimeframe = 'thisMonth' | 'lastMonth' | 'thisYear' | 'lastYear' // | 'custom'

interface TicketsFiltersStoreContextProps {
  timeframe: FilteringTimeframe | null
  ecv: string | null
}

export const TicketsFiltersStoreContext = createContext<TicketsFiltersStoreContextProps | null>(
  null,
)
TicketsFiltersStoreContext.displayName = 'TicketsFiltersStoreContext'

export const TicketsFiltersStoreUpdateContext = createContext<
  ((newValues: Partial<TicketsFiltersStoreContextProps>) => void) | null
>(null)

export const defaultTicketsFiltersStoreContextValues: TicketsFiltersStoreContextProps = {
  timeframe: 'thisYear',
  ecv: null,
}

const TicketsFiltersStoreProvider = ({ children }: PropsWithChildren) => {
  const [values, setValues] = useState<TicketsFiltersStoreContextProps>(
    defaultTicketsFiltersStoreContextValues,
  )

  const onTicketsFiltersStoreUpdate = useCallback(
    (newValues: Partial<TicketsFiltersStoreContextProps>) => {
      setValues((prevValues) => ({ ...prevValues, ...newValues }))
    },
    [setValues],
  )

  return (
    <TicketsFiltersStoreUpdateContext.Provider value={onTicketsFiltersStoreUpdate}>
      <TicketsFiltersStoreContext.Provider value={values}>
        {children}
      </TicketsFiltersStoreContext.Provider>
    </TicketsFiltersStoreUpdateContext.Provider>
  )
}

export default TicketsFiltersStoreProvider
