import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import { InteractionManager } from 'react-native'

import { useLocale } from '@/hooks/useTranslation'
import {
  announcementsOptions,
  notificationSettingsOptions,
  parkingCardsInfiniteOptions,
  verifiedEmailsInfiniteOptions,
  visitorCardsOptions,
} from '@/modules/backend/constants/queryOptions'
import { getAccessTokenOrLogout } from '@/modules/cognito/utils'

export const usePrefetchOnAppStart = () => {
  const queryClient = useQueryClient()
  const locale = useLocale()

  const prefetch = useCallback(async () => {
    const token = await getAccessTokenOrLogout()

    /* Do not prefetch if user is not logged in */
    if (!token) {
      return
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    try {
      /* Define and prefetch standard queries */
      const queries = [
        notificationSettingsOptions(),
        visitorCardsOptions(),
        announcementsOptions(locale),
      ]
      await Promise.all(
        queries.map((query) => queryClient.prefetchQuery<any, any, any, any>(query)),
      )

      /* Define and prefetch infinite queries (must be prefetched separately by `prefetchInfiniteQuery`) */
      const verifiedEmails = verifiedEmailsInfiniteOptions()
      const infiniteQueries = [verifiedEmails]

      await Promise.all(
        infiniteQueries.map((infiniteQuery) =>
          queryClient.prefetchInfiniteQuery<any, any, any, any, any>(infiniteQuery),
        ),
      )

      /* Prefetch parking cards for first page of verified emails */
      const emails = await queryClient.fetchInfiniteQuery(verifiedEmails)
      if (emails.pages[0].data.verifiedEmails.length > 0)
        await Promise.all(
          emails.pages[0].data.verifiedEmails.map((emailDto) =>
            queryClient.prefetchInfiniteQuery(
              parkingCardsInfiniteOptions({ email: emailDto.email }),
            ),
          ),
        )
    } catch (error) {
      console.log(error)
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }, [locale, queryClient])

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => prefetch())
  }, [prefetch])
}
