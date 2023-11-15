import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import { InteractionManager } from 'react-native'

import { useLocale } from '@/hooks/useTranslation'
import {
  announcementsOptions,
  notificationSettingsOptions,
  parkingCardsOptions,
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

    const verifiedEmails = verifiedEmailsInfiniteOptions()

    const infiniteQueries = [verifiedEmails]

    const queries = [
      notificationSettingsOptions(),
      visitorCardsOptions(),
      announcementsOptions(locale),
    ]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await Promise.all(queries.map((query) => queryClient.prefetchQuery<any, any, any, any>(query)))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await Promise.all(
      infiniteQueries.map((infiniteQuery) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        queryClient.prefetchInfiniteQuery<any, any, any, any, any>(infiniteQuery),
      ),
    )

    const emails = await queryClient.fetchInfiniteQuery(verifiedEmails)
    if (emails.pages[0].data.verifiedEmails.length > 0)
      await Promise.all(
        emails.pages[0].data.verifiedEmails.map((emailDto) =>
          queryClient.prefetchQuery(parkingCardsOptions({ email: emailDto.email })),
        ),
      )
  }, [locale, queryClient])

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => prefetch())
  }, [prefetch])
}
