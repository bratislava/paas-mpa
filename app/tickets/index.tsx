import { useInfiniteQuery } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'
import { FlatList, ListRenderItem, useWindowDimensions } from 'react-native'
import { SceneMap, TabView } from 'react-native-tab-view'

import TabBar from '@/components/navigation/TabBar'
import EmptyStateScreen from '@/components/screen-layout/EmptyStateScreen'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Button from '@/components/shared/Button'
import Typography from '@/components/shared/Typography'
import SkeletonTicketCard from '@/components/tickets/SkeletonTicketCard'
import TicketCard from '@/components/tickets/TicketCard'
import { useTranslation } from '@/hooks/useTranslation'
import { ticketsInfiniteQuery } from '@/modules/backend/constants/queryOptions'
import { TicketDto } from '@/modules/backend/openapi-generated'

type RouteProps =
  | {
      active: true
    }
  | {
      active?: never
      // TODO filters?
    }

const TicketsRoute = ({ active }: RouteProps) => {
  const t = useTranslation('Tickets')

  const renderItem: ListRenderItem<TicketDto> = useCallback(
    ({ item }) => <TicketCard ticket={item} isActive={active} />,
    [active],
  )

  const now = useMemo(() => new Date().toISOString(), [])

  const {
    data: ticketsDataInf,
    isPending,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ticketsInfiniteQuery({
      parkingEndTo: active ? undefined : now,
      parkingEndFrom: active ? now : undefined,
      pageSize: 20,
    }),
  )

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage()
    }
  }

  if (isPending) {
    return (
      <ScreenContent>
        <SkeletonTicketCard />
      </ScreenContent>
    )
  }

  if (isError) {
    return <Typography>Error: {error.message}</Typography>
  }

  const tickets = ticketsDataInf.pages.flatMap((page) => page.data.tickets)

  if (!tickets?.length) {
    return (
      <EmptyStateScreen
        contentTitle={t('noActiveTickets')}
        text={t('noActiveTicketsText')}
        actionButton={<Button variant="primary">{t('buyTicket')}</Button>}
      />
    )
  }

  return (
    <ScreenContent>
      <FlatList
        // eslint-disable-next-line react-native/no-inline-styles
        contentContainerStyle={{ gap: 12 }}
        data={tickets}
        renderItem={renderItem}
        ListFooterComponent={isFetchingNextPage ? <SkeletonTicketCard /> : null}
        onEndReachedThreshold={0.2}
        onEndReached={loadMore}
      />
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
    <ScreenView title={t('title')} backgroundVariant="dots">
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
