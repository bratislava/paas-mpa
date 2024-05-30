import { useQueryClient } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { Link, useLocalSearchParams, useNavigation } from 'expo-router'
import { useEffect } from 'react'
import { ActivityIndicator } from 'react-native'

import ContinueButton from '@/components/navigation/ContinueButton'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import ScreenViewCentered from '@/components/screen-layout/ScreenViewCentered'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import BoughtTicket from '@/components/tickets/BoughtTicket'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { useTranslation } from '@/hooks/useTranslation'
import { getTicketOptions } from '@/modules/backend/constants/queryOptions'
import { PaymentStatus, TicketDto, TicketsResponseDto } from '@/modules/backend/openapi-generated'
import { defaultInitialPurchaseStoreValues } from '@/state/PurchaseStoreProvider/PurchaseStoreProvider'
import { usePurchaseStoreUpdateContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreUpdateContext'
import { isDefined } from '@/utils/isDefined'

export type TicketPurchaseSearchParams = {
  ticketId: string
}

/**
 * This page takes care of redirect from Payment gate. Do not change its path, unless it's changed on BE too.
 */
const TicketPurchasePage = () => {
  const { t } = useTranslation()
  const { ticketId } = useLocalSearchParams<TicketPurchaseSearchParams>()
  const ticketIdParsed = ticketId ? parseInt(ticketId, 10) : undefined

  const updatePurchaseStore = usePurchaseStoreUpdateContext()
  const queryClient = useQueryClient()
  const navigation = useNavigation()

  const { data, isPending, isError, error, refetch } = useQueryWithFocusRefetch(
    getTicketOptions(ticketIdParsed),
  )

  const isProlongation = !!data?.lastProlongationTicketId
  const purchaseType = isProlongation ? 'prolongation' : 'payment'

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined

    if (data?.paymentStatus === 'PENDING') {
      // Without this timeout, the refetch would occur too often
      timeout = setTimeout(() => {
        refetch()
      }, 2000)
    } else if (data?.paymentStatus === 'SUCCESS') {
      // TODO add explanation comment
      if (data.lastProlongationTicketId) {
        queryClient.invalidateQueries({ queryKey: ['Tickets'] })
      } else {
        updatePurchaseStore(defaultInitialPurchaseStoreValues)

        const cacheResponse = queryClient.getQueryData([
          'Tickets',
        ]) as AxiosResponse<TicketsResponseDto>

        if (cacheResponse) {
          queryClient.setQueryData(['Tickets'], {
            ...cacheResponse,
            data: { ...cacheResponse.data, tickets: [data, ...cacheResponse.data.tickets] },
          })
        }

        queryClient.removeQueries({ queryKey: ['TicketPrice'] })
      }
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [data, updatePurchaseStore, queryClient, refetch])

  useEffect(() => {
    const state = navigation.getState()

    navigation.reset({
      ...state,
      index: 1,
      routes: [state.routes[0], state.routes.at(-1)].filter(isDefined),
    })
  }, [navigation])

  const translationMap = {
    payment: {
      successTitle: t('PurchaseScreen.payment.successful'),
      successText: t('PurchaseScreen.payment.successfulText'),
      failedTitle: t('PurchaseScreen.payment.failed'),
      failedText: t('PurchaseScreen.payment.failedText'),
    },
    prolongation: {
      successTitle: t('PurchaseScreen.prolongation.successful'),
      successText: t('PurchaseScreen.prolongation.successfulText'),
      failedTitle: t('PurchaseScreen.prolongation.failed'),
      failedText: t('PurchaseScreen.prolongation.failedText'),
    },
  }

  const PendingComponent = () => (
    <ContentWithAvatar
      title={t('PurchaseScreen.pendingTitle')}
      text={t('PurchaseScreen.pendingText')}
    >
      <ActivityIndicator size="large" />
    </ContentWithAvatar>
  )

  const ErrorComponent = ({ message }: { message: string }) => (
    <ContentWithAvatar
      variant="error"
      title={translationMap[purchaseType].failedTitle}
      text={translationMap[purchaseType].failedText}
    >
      <Panel className="bg-negative-light">
        <Typography>{message}</Typography>
      </Panel>
    </ContentWithAvatar>
  )

  const SuccessComponent = ({ ticket }: { ticket: TicketDto }) => (
    <ContentWithAvatar
      variant="success"
      title={translationMap[purchaseType].successTitle}
      text={translationMap[purchaseType].successText}
    >
      <BoughtTicket ticket={ticket} />
    </ContentWithAvatar>
  )

  const PaymentStatusComponent = ({ ticket }: { ticket: TicketDto }) => {
    switch (ticket.paymentStatus) {
      case PaymentStatus.Pending:
        return <PendingComponent />

      case PaymentStatus.Success:
        return <SuccessComponent ticket={ticket} />

      // Other statuses (Fail, Error) and unexpected states are handled by ErrorComponent
      default:
        return (
          <ErrorComponent
            message={
              // TODO error text
              // TODO translation
              ticket.paymentFailReason ?? 'Undefined payment error, please contact administrators.'
            }
          />
        )
    }
  }

  return (
    <ScreenViewCentered
      actionButton={
        <Link asChild href="/">
          <ContinueButton>{t('PurchaseScreen.backToMap')}</ContinueButton>
        </Link>
      }
      options={{ headerShown: false }}
    >
      {isPending ? (
        <PendingComponent />
      ) : isError ? (
        <ErrorComponent message={error.message} />
      ) : (
        <PaymentStatusComponent ticket={data} />
      )}
    </ScreenViewCentered>
  )
}

export default TicketPurchasePage
