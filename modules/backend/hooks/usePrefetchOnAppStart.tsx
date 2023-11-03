import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import { InteractionManager } from 'react-native'

import {
  notificationSettingsOptions,
  parkingCardsOptions,
  verifiedEmailsOptions,
  visitorCardsOptions,
} from '@/modules/backend/constants/queryOptions'
import { getAccessTokenOrLogout } from '@/modules/cognito/utils'

export const usePrefetchOnAppStart = () => {
  const queryClient = useQueryClient()

  const prefetch = useCallback(async () => {
    const token = await getAccessTokenOrLogout()

    /* Do not prefetch if use is not logged in */
    if (!token) {
      return
    }

    const verifiedEmails = verifiedEmailsOptions()
    const queries = [notificationSettingsOptions(), verifiedEmails, visitorCardsOptions()]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await Promise.all(queries.map((query) => queryClient.prefetchQuery<any, any, any, any>(query)))
    const emails = await queryClient.fetchQuery(verifiedEmails)
    if (emails)
      await Promise.all(
        emails.data.verifiedEmails.map((emailDto) =>
          queryClient.prefetchQuery(parkingCardsOptions({ email: emailDto.email })),
        ),
      )
  }, [queryClient])

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => prefetch())
  }, [prefetch])
}
