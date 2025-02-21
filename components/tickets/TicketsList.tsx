import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { ListRenderItem } from '@shopify/flash-list'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Link, router } from 'expo-router'
import React, { useCallback, useRef, useState } from 'react'
import { View } from 'react-native'

import { EmptyStateAvatar } from '@/assets/avatars'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import Button from '@/components/shared/Button'
import FloatingButton from '@/components/shared/FloatingButton'
import { List } from '@/components/shared/List/List'
import Typography from '@/components/shared/Typography'
import SkeletonTicketCard from '@/components/tickets/SkeletonTicketCard'
import TicketCard from '@/components/tickets/TicketCard'
import TicketsHistoryBottomSheet from '@/components/tickets/TicketsHistoryBottomSheet'
import { useQueryInvalidateOnTicketExpire } from '@/hooks/useQueryInvalidateOnTicketExpire'
import { useTranslation } from '@/hooks/useTranslation'
import { ticketsInfiniteQuery } from '@/modules/backend/constants/queryOptions'
import { TicketDto } from '@/modules/backend/openapi-generated'
import { useTicketsFiltersStoreContext } from '@/state/TicketsFiltersStoreProvider/useTicketsFiltersStoreContext'
import { getParkingEndRange } from '@/utils/getParkingEndRange'

type RouteProps =
  | {
      active: true
    }
  | {
      active?: never
    }

export const TicketsList = ({ active }: RouteProps) => {
  const { t } = useTranslation()
  const filters = useTicketsFiltersStoreContext()

  const [activeId, setActiveId] = useState<number | null>(null)

  const bottomSheetRef = useRef<BottomSheetModal>(null)

  const handleMorePress = useCallback((id: number) => {
    bottomSheetRef.current?.present()
    setActiveId(id)
  }, [])

  const now = new Date()
  const { parkingEndFrom, parkingEndTo } = getParkingEndRange(filters.timeframe, now)

  const options = active
    ? {
        isActive: active,
        parkingEndFrom: now,
        pageSize: 20,
      }
    : {
        isActive: false,
        timeframe: filters.timeframe ?? undefined,
        parkingEndFrom,
        parkingEndTo,
        pageSize: 20,
        ecvs: filters.ecvs === 'all' ? undefined : filters.ecvs,
      }

  const {
    data: ticketsDataInf,
    isPending,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isRefetching,
    refetch,
  } = useInfiniteQuery(ticketsInfiniteQuery(options))

  const tickets = ticketsDataInf?.pages.flatMap((page) => page.data.tickets)

  useQueryInvalidateOnTicketExpire(active ? (tickets ?? null) : null, refetch, ['Tickets'])

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage()
    }
  }

  const renderItem: ListRenderItem<TicketDto> = useCallback(
    ({ item }) => <TicketCard ticket={item} isActive={active} handleMorePress={handleMorePress} />,
    [active, handleMorePress],
  )

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handleFiltersButtonPress = () => {
    router.push('/tickets/filters')
  }

  if (isPending) {
    return (
      <ScreenContent className="bg-transparent">
        <SkeletonTicketCard />
      </ScreenContent>
    )
  }

  if (isError) {
    return <Typography>Error: {error.message}</Typography>
  }

  return (
    <>
      <ScreenContent>
        <List
          data={tickets}
          estimatedItemSize={active ? 188 : 187}
          renderItem={renderItem}
          ListFooterComponent={isFetchingNextPage ? <SkeletonTicketCard /> : null}
          onEndReachedThreshold={0.2}
          onEndReached={loadMore}
          onRefresh={refetch}
          refreshing={isRefetching}
          ItemSeparatorComponent={() => <View className="h-3" />}
          actionButton={
            active ? (
              tickets?.length ? null : (
                <Link asChild href="/">
                  <Button className="w-full" variant="primary">
                    {t('Tickets.buyTicket')}
                  </Button>
                </Link>
              )
            ) : (
              <FloatingButton startIcon="filter-list" onPress={handleFiltersButtonPress}>
                {t('Tickets.filtersButton')}
              </FloatingButton>
            )
          }
          ListEmptyComponent={
            active ? (
              <ContentWithAvatar
                title={t('Tickets.noActiveTickets')}
                text={t('Tickets.noActiveTicketsText')}
                customAvatarComponent={<EmptyStateAvatar />}
              />
            ) : (
              <ContentWithAvatar
                title={t('Tickets.noHistoryTickets')}
                text={t('Tickets.noHistoryTicketsTextFiltered')}
                customAvatarComponent={<EmptyStateAvatar />}
              />
            )
          }
        />
      </ScreenContent>

      <TicketsHistoryBottomSheet ref={bottomSheetRef} activeId={activeId} />
    </>
  )
}
