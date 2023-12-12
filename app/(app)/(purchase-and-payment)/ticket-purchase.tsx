import { useQueryClient } from '@tanstack/react-query'
import { Link, Stack, useLocalSearchParams } from 'expo-router'
import React, { useEffect } from 'react'

import ContinueButton from '@/components/navigation/ContinueButton'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import ScreenViewCentered from '@/components/screen-layout/ScreenViewCentered'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import BoughtTicket from '@/components/tickets/BoughtTicket'
import { usePreventGoBack } from '@/hooks/usePreventGoBack'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { useTranslation } from '@/hooks/useTranslation'
import { getTicketOptions } from '@/modules/backend/constants/queryOptions'
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
  usePreventGoBack()
  const queryClient = useQueryClient()

  const { data, isPending, isError, error, refetch } = useQueryWithFocusRefetch(
    getTicketOptions(ticketIdParsed),
  )

  useEffect(() => {
    if (data?.paymentStatus === 'SUCCESS') {
      onPurchaseStoreUpdate(defaultInitialPurchaseStoreValues)
      queryClient.invalidateQueries({ queryKey: ['Tickets'] })
    } else if (data?.paymentStatus === 'PENDING') {
      refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <ScreenViewCentered
      actionButton={
        <Link asChild href="/">
          <ContinueButton>{t('backToMap')}</ContinueButton>
        </Link>
      }
    >
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
      {isPending || data?.paymentStatus === 'PENDING' ? (
        <ContentWithAvatar title="Ticket is being processed" text={ticketId} />
      ) : isError || data.paymentStatus === 'FAIL' ? (
        <ContentWithAvatar variant="error" title={t('paymentFailed')} text={t('paymentFailedText')}>
          <Panel className="bg-negative-light">
            <Typography>{data?.paymentFailReason || error?.message}</Typography>
          </Panel>
        </ContentWithAvatar>
      ) : data?.paymentStatus === 'SUCCESS' ? (
        <ContentWithAvatar
          variant="success"
          title={t('paymentSuccessful')}
          text={t('paymentSuccessfulText')}
        >
          <BoughtTicket ticket={data} />
        </ContentWithAvatar>
      ) : null}
    </ScreenViewCentered>
  )
}

export default TicketPurchasePage
