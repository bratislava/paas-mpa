import { useInfiniteQuery } from '@tanstack/react-query'
import { Link, router } from 'expo-router'
import { useCallback, useMemo, useState } from 'react'
import { FlatList, ListRenderItem, useWindowDimensions, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SceneMap, TabView } from 'react-native-tab-view'

import TabBar from '@/components/navigation/TabBar'
import EmptyStateScreen from '@/components/screen-layout/EmptyStateScreen'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Button from '@/components/shared/Button'
import FloatingButton from '@/components/shared/FloatingButton'
import Typography from '@/components/shared/Typography'
import SkeletonTicketCard from '@/components/tickets/SkeletonTicketCard'
import TicketCard from '@/components/tickets/TicketCard'
import { useQueryInvalidateOnTicketExpire } from '@/hooks/useQueryInvalidateOnTicketExpire'
import { useTranslation } from '@/hooks/useTranslation'
import { ticketsInfiniteQuery } from '@/modules/backend/constants/queryOptions'
import { TicketDto } from '@/modules/backend/openapi-generated'
import { useTicketsFiltersStoreContext } from '@/state/TicketsFiltersStoreProvider/useTicketsFiltersStoreContext'
import { transformTimeframeToFromTo } from '@/utils/transformTimeframeToFromTo'

type RouteProps =
  | {
      active: true
    }
  | {
      active?: never
    }

const TicketsRoute = ({ active }: RouteProps) => {
  const t = useTranslation('Tickets')
  const insets = useSafeAreaInsets()
  const filters = useTicketsFiltersStoreContext()

  const now = useMemo(() => new Date(), [])

  const fromTo = transformTimeframeToFromTo(filters.timeframe, now)

  const ticketsQueryOptions = ticketsInfiniteQuery({
    parkingEndFrom: active ? new Date() : fromTo.parkingEndFrom,
    parkingEndTo: active ? undefined : fromTo.parkingEndTo,
    pageSize: 20,
    ecv: filters.ecvs ?? undefined,
    isActive: active,
  })

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
  } = useInfiniteQuery(ticketsQueryOptions)

  const tickets = ticketsDataInf?.pages.flatMap((page) => page.data.tickets)

  useQueryInvalidateOnTicketExpire(active ? tickets ?? null : null, refetch, ['Tickets'])

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage()
    }
  }

  const renderItem: ListRenderItem<TicketDto> = useCallback(
    ({ item }) => <TicketCard ticket={item} isActive={active} refetch={refetch} />,
    [active, refetch],
  )

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handleFiltersPress = () => {
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

  if (active && !tickets?.length) {
    return (
      <EmptyStateScreen
        contentTitle={t('noActiveTickets')}
        text={t('noActiveTicketsText')}
        actionButton={
          <Link href="/purchase" asChild>
            <Button variant="primary">{t('buyTicket')}</Button>
          </Link>
        }
      />
    )
  }
  if (!active && !tickets?.length) {
    return (
      <EmptyStateScreen
        contentTitle={t('noHistoryTickets')}
        text={t('noHistoryTicketsText')}
        actionButton={
          <Button variant="primary" onPress={handleFiltersPress}>
            {t('filters')}
          </Button>
        }
      />
    )
  }

  return (
    <ScreenContent variant="center" className="flex-1">
      <View className="w-full">
        <FlatList
          contentContainerStyle={{ gap: 12 }}
          data={tickets}
          renderItem={renderItem}
          ListFooterComponent={isFetchingNextPage ? <SkeletonTicketCard /> : null}
          onEndReachedThreshold={0.2}
          onEndReached={loadMore}
          onRefresh={refetch}
          refreshing={isRefetching}
        />
      </View>

      {!active && (
        <LinearGradient
          // TODO: Padding and insets
          className="absolute w-full items-center pb-6"
          pointerEvents="box-none"
          style={{ bottom: insets.bottom }}
          colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
        >
          <FloatingButton startIcon="filter-list" onPress={handleFiltersPress}>
            {t('filters')}
          </FloatingButton>
        </LinearGradient>
      )}
    </ScreenContent>
  )
}

const ActiveTicketsRoute = () => <TicketsRoute active />
const HistoryTicketsRoute = () => <TicketsRoute />

const renderScene = SceneMap({
  active: ActiveTicketsRoute,
  history: HistoryTicketsRoute,
})

// TODO
const Page = () => {
  const t = useTranslation('Tickets')
  const layout = useWindowDimensions()

  const [index, setIndex] = useState(0)
  const [routes] = useState([
    { key: 'active', title: t('activeTickets') },
    { key: 'history', title: t('history') },
  ])

  return (
    <ScreenView title={t('title')} backgroundVariant="dots" hasBackButton>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => <TabBar {...props} />}
      />
    </ScreenView>
  )
}

export default Page
