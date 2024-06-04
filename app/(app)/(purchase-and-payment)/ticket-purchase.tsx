import { useQueryClient } from '@tanstack/react-query'
import { Link, useLocalSearchParams, useNavigation } from 'expo-router'
import { useEffect } from 'react'

import ContinueButton from '@/components/navigation/ContinueButton'
import ErrorContent from '@/components/purchase/PaymentStatus/ErrorContent'
import PaymentStatusContent from '@/components/purchase/PaymentStatus/PaymentStatusContent'
import PendingContent from '@/components/purchase/PaymentStatus/PendingContent'
import ScreenViewCentered from '@/components/screen-layout/ScreenViewCentered'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { useTranslation } from '@/hooks/useTranslation'
import { getTicketOptions } from '@/modules/backend/constants/queryOptions'
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

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined

    // Repeatedly refetch ticket data, until we get SUCCESS or some error
    if (data?.paymentStatus === 'PENDING') {
      // Without this timeout, the refetch would occur too often
      timeout = setTimeout(() => {
        refetch()
      }, 2000)
    } else if (data?.paymentStatus === 'SUCCESS') {
      // TODO investigate if this invalidation is needed
      queryClient.invalidateQueries({ queryKey: ['Tickets'] })

      // This reset must happen only for PurchaseScreen, it's not relevant for prolongation, because the whole prolongation context provider gets unmounted completely
      if (!data.lastProlongationTicketId) {
        updatePurchaseStore(defaultInitialPurchaseStoreValues)
        queryClient.removeQueries({ queryKey: ['TicketPrice'] })
      }
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [data, updatePurchaseStore, queryClient, refetch])

  // TODO refactor if we find simpler solution
  // Reset navigation stack to contain only homepage (map) and result page (ticket-purchase) to remove purchase screens
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
      {isPending ? (
        <PendingContent />
      ) : isError ? (
        <ErrorContent message={error.message} />
      ) : (
        <PaymentStatusContent ticket={data} />
      )}
    </ScreenViewCentered>
  )
}

export default TicketPurchasePage
