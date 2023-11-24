import { useInfiniteQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useCallback, useMemo, useState } from 'react'
import { FlatList, ListRenderItem, useWindowDimensions, View } from 'react-native'
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
import { useTranslation } from '@/hooks/useTranslation'
import { ticketsInfiniteQuery } from '@/modules/backend/constants/queryOptions'
import { TicketDto } from '@/modules/backend/openapi-generated'

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

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handleFiltersPress = () => {
    router.push('/tickets/filters')
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
    <ScreenContent variant="center">
      <View className="w-full">
        <FlatList
          // eslint-disable-next-line react-native/no-inline-styles
          contentContainerStyle={{ gap: 12 }}
          data={tickets}
          renderItem={renderItem}
          ListFooterComponent={isFetchingNextPage ? <SkeletonTicketCard /> : null}
          onEndReachedThreshold={0.2}
          onEndReached={loadMore}
        />
      </View>

      {!active && (
        <View
          // TODO: Padding and insets
          className="absolute items-center pb-8"
          pointerEvents="box-none"
          style={{ bottom: insets.bottom }}
        >
          <FloatingButton startIcon="filter-list" onPress={handleFiltersPress}>
            {t('filters')}
          </FloatingButton>
        </View>
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
