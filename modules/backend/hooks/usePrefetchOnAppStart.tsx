import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import { InteractionManager } from 'react-native'

import { clientApi } from '@/modules/backend/client-api'
import { visitorCardsOptions } from '@/modules/backend/constants/queryOptions'
import { getAccessToken } from '@/modules/cognito/utils'

export const usePrefetchOnAppStart = () => {
  const queryClient = useQueryClient()

  const prefetch = useCallback(async () => {
    const token = await getAccessToken()

    /* Do not prefetch if user is not logged in */
    if (!token) {
      return
    }

    try {
      /* Define and prefetch standard queries */
      const queries = [visitorCardsOptions()] // , announcementsOptions(locale)

      // refresh verified emails before prefetching visitor cards
      await clientApi.verifiedEmailsControllerRefreshVerifiedEmail(true)

      await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        queries.map((query) => queryClient.prefetchQuery<any, any, any, any>(query)),
      )
    } catch (error) {
      console.log(error)
    }
  }, [queryClient]) // add locale when adding announcementsOptions

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => prefetch())
  }, [prefetch])
}
