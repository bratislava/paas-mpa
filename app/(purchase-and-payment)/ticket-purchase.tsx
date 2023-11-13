import { Link, useLocalSearchParams } from 'expo-router'
import React from 'react'

import ContinueButton from '@/components/navigation/ContinueButton'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import ScreenViewCentered from '@/components/screen-layout/ScreenViewCentered'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import BoughtTicket from '@/components/tickets/BoughtTicket'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { useTranslation } from '@/hooks/useTranslation'
import { getTicketOptions } from '@/modules/backend/constants/queryOptions'

export type TicketPurchaseSearchParams = {
  ticketId: string
}

/**
 * This page takes care of redirect from Payment gate. Do not change its path, unless it's changes on BE too.
 *
 * @constructor
 */

// TODO repeat request to BE until the state of ticket is SUCCESS or FAIL
const TicketPurchasePage = () => {
  const t = useTranslation('PurchaseScreen')
  const { ticketId } = useLocalSearchParams<TicketPurchaseSearchParams>()
  const ticketIdParsed = ticketId ? parseInt(ticketId, 10) : undefined

  const { data, isPending, isError, error } = useQueryWithFocusRefetch(
    getTicketOptions(ticketIdParsed!),
  )

  return (
    <ScreenViewCentered
      actionButton={
        <Link asChild href="/">
          <ContinueButton>{t('backToMap')}</ContinueButton>
        </Link>
      }
    >
      {isPending ? (
        // TODO show this content when ticket status is PENDING
        <ContentWithAvatar title="Ticket is being processed" text={ticketId} />
      ) : isError ? (
        // TODO show tis content when ticket status is FAIL
        <ContentWithAvatar variant="error" title={t('paymentFailed')} text={t('paymentFailedText')}>
          <Panel className="bg-negative-light">
            <Typography>{error.message}</Typography>
          </Panel>
        </ContentWithAvatar>
      ) : (
        // TODO show this content when ticket status is SUCCESS
        <ContentWithAvatar
          variant="success"
          title={t('paymentSuccessful')}
          text={t('paymentSuccessfulText')}
        >
          <BoughtTicket ticket={data} />
        </ContentWithAvatar>
      )}
    </ScreenViewCentered>
  )
}

export default TicketPurchasePage
