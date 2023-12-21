import { useQueryClient } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { Link, Stack, useLocalSearchParams, useNavigation } from 'expo-router'
import React, { useEffect } from 'react'

import ContinueButton from '@/components/navigation/ContinueButton'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import ScreenViewCentered from '@/components/screen-layout/ScreenViewCentered'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import BoughtTicket from '@/components/tickets/BoughtTicket'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { useTranslation } from '@/hooks/useTranslation'
import { getTicketOptions } from '@/modules/backend/constants/queryOptions'
import { TicketsResponseDto } from '@/modules/backend/openapi-generated'
import { defaultInitialPurchaseStoreValues } from '@/state/PurchaseStoreProvider/PurchaseStoreProvider'
import { usePurchaseStoreUpdateContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreUpdateContext'

export type TicketPurchaseSearchParams = {
  ticketId: string
}

/**
 * This page takes care of redirect from Payment gate. Do not change its path, unless it's changes on BE too.
 */
const TicketPurchasePage = () => {
  const t = useTranslation('PurchaseScreen')
  const { ticketId } = useLocalSearchParams<TicketPurchaseSearchParams>()
  const ticketIdParsed = ticketId ? parseInt(ticketId, 10) : undefined

  const onPurchaseStoreUpdate = usePurchaseStoreUpdateContext()
  const queryClient = useQueryClient()
  const navigation = useNavigation()

  const { data, isPending, isError, error, refetch } = useQueryWithFocusRefetch(
    getTicketOptions(ticketIdParsed),
  )

  const isProlongation = !!data?.lastProlongationTicketId

  useEffect(() => {
    if (data?.paymentStatus === 'SUCCESS') {
      if (data.lastProlongationTicketId) {
        queryClient.invalidateQueries({ queryKey: ['Tickets'] })
      } else {
        onPurchaseStoreUpdate(defaultInitialPurchaseStoreValues)

        const cacheData = queryClient.getQueryData(['Tickets']) as AxiosResponse<TicketsResponseDto>

        if (cacheData) {
          queryClient.setQueryData(['Tickets'], {
            ...cacheData,
            data: { ...cacheData.data, tickets: [data, ...cacheData.data.tickets] },
          })
        }

        queryClient.removeQueries({ queryKey: ['TicketPrice'] })
      }
    } else if (data?.paymentStatus === 'PENDING') {
      refetch()
    }
  }, [data, onPurchaseStoreUpdate, queryClient, refetch])

  useEffect(() => {
    const state = navigation.getState()

    navigation.reset({
      ...state,
      index: 1,
      routes: [state.routes[0], state.routes.at(-1)!],
    })
  }, [navigation])

  const translationKey = isProlongation ? 'prolongation' : 'payment'

  return (
    <ScreenViewCentered
      actionButton={
        <Link asChild href="/">
          <ContinueButton>{t('backToMap')}</ContinueButton>
        </Link>
      }
    >
      <Stack.Screen options={{ headerShown: false }} />
      {isPending || data?.paymentStatus === 'PENDING' ? (
        <ContentWithAvatar title="Ticket is being processed" text={ticketId} />
      ) : isError || data.paymentStatus === 'FAIL' ? (
        <ContentWithAvatar
          variant="error"
          title={t(`${translationKey}.failed`)}
          text={t(`${translationKey}.failedText`)}
        >
          <Panel className="bg-negative-light">
            <Typography>{data?.paymentFailReason ?? error?.message}</Typography>
          </Panel>
        </ContentWithAvatar>
      ) : data?.paymentStatus === 'SUCCESS' ? (
        <ContentWithAvatar
          variant="success"
          title={t(`${translationKey}.successful`)}
          text={t(`${translationKey}.successfulText`)}
        >
          <BoughtTicket ticket={data} />
        </ContentWithAvatar>
      ) : null}
    </ScreenViewCentered>
  )
}

export default TicketPurchasePage
