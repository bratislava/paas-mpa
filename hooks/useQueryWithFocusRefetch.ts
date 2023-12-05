import {
  DefinedInitialDataOptions,
  QueryKey,
  UndefinedInitialDataOptions,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query'
import { useCallback, useRef } from 'react'
import { AppState } from 'react-native'

import { useFocusEffect } from '@/hooks/useFocusEffect'

// https://github.com/TanStack/query/discussions/296

export const useQueryWithFocusRefetch = <T, E = unknown, R = T, K extends QueryKey = QueryKey>(
  options:
    | UseQueryOptions<T, E, R, K>
    | DefinedInitialDataOptions<T, E, R, K>
    | UndefinedInitialDataOptions<T, E, R, K>,
) => {
  const queryResult = useQuery<T, E, R, K>(options)
  const appState = useRef(AppState.currentState)

  const focusEffect = useCallback(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (/inactive|background/.test(appState.current) && nextAppState === 'active') {
        queryResult.refetch()
      }
      appState.current = nextAppState
    })

    return () => {
      subscription.remove()
    }
  }, [queryResult])

  useFocusEffect(focusEffect)

  return queryResult
}
