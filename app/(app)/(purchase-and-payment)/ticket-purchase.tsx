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
import { TicketsResponseDto } from '@/modules/backend/openapi-generated'
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

  const onPurchaseStoreUpdate = usePurchaseStoreUpdateContext()
  const queryClient = useQueryClient()
  const navigation = useNavigation()

  const { data, isPending, isError, error, refetch } = useQueryWithFocusRefetch(
    getTicketOptions(ticketIdParsed),
  )

  const isProlongation = !!data?.lastProlongationTicketId

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined

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
      // Without this timeout, the refetch would occur too often
      timeout = setTimeout(() => {
        refetch()
      }, 2000)
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [data, onPurchaseStoreUpdate, queryClient, refetch])

  useEffect(() => {
    const state = navigation.getState()

    navigation.reset({
      ...state,
      index: 1,
      routes: [state.routes[0], state.routes.at(-1)].filter(isDefined),
    })
  }, [navigation])

  return (
    <ScreenViewCentered
      actionButton={
        <Link asChild href="/">
          <ContinueButton>{t('PurchaseScreen.backToMap')}</ContinueButton>
        </Link>
      }
      options={{ headerShown: false }}
    >
      {isPending || data?.paymentStatus === 'PENDING' ? (
        <ContentWithAvatar
          title={t('PurchaseScreen.pendingTitle')}
          text={t('PurchaseScreen.pendingText')}
        >
          <ActivityIndicator size="large" />
        </ContentWithAvatar>
      ) : isError || data.paymentStatus === 'FAIL' || data.paymentStatus === 'ERROR' ? (
        <ContentWithAvatar
          variant="error"
          title={
            isProlongation
              ? t('PurchaseScreen.prolongation.failed')
              : t('PurchaseScreen.payment.failed')
          }
          text={
            isProlongation
              ? t('PurchaseScreen.prolongation.failedText')
              : t('PurchaseScreen.payment.failedText')
          }
        >
          <Panel className="bg-negative-light">
            <Typography>{data?.paymentFailReason ?? error?.message}</Typography>
          </Panel>
        </ContentWithAvatar>
      ) : data?.paymentStatus === 'SUCCESS' ? (
        <ContentWithAvatar
          variant="success"
          title={
            isProlongation
              ? t('PurchaseScreen.prolongation.successful')
              : t('PurchaseScreen.payment.successful')
          }
          text={
            isProlongation
              ? t('PurchaseScreen.prolongation.successfulText')
              : t('PurchaseScreen.payment.successfulText')
          }
        >
          <BoughtTicket ticket={data} />
        </ContentWithAvatar>
      ) : null}
    </ScreenViewCentered>
  )
}

export default TicketPurchasePage
