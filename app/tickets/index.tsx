import { useInfiniteQuery } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'
import { FlatList, ListRenderItem, useWindowDimensions, View } from 'react-native'
import { SceneMap, TabView } from 'react-native-tab-view'

import TabBar from '@/components/navigation/TabBar'
import EmptyStateScreen from '@/components/screen-layout/EmptyStateScreen'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Button from '@/components/shared/Button'
import InfiniteScrollFlatList from '@/components/shared/InfiniteScrollFlatList'
import TicketCard from '@/components/tickets/TicketCard'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { useTranslation } from '@/hooks/useTranslation'
import { ticketsInfiniteOptions, ticketsOptions } from '@/modules/backend/constants/queryOptions'
import { TicketDto } from '@/modules/backend/openapi-generated'

const ActiveTicketsRoute = () => {
  const t = useTranslation('Tickets')

  const {
    data: ticketsPages,
    isFetching,
    fetchNextPage,
  } = useInfiniteQuery({
    ...ticketsInfiniteOptions({ active: true }),
  })

  const tickets = useMemo(
    () => ticketsPages?.reduce((acc, page) => [...acc, ...page.tickets], [] as TicketDto[]),
    [ticketsPages],
  )

  const renderItem: ListRenderItem<TicketDto> = useCallback(
    ({ item }) => <TicketCard ticket={item} />,
    [],
  )

  const renderSkeleton = useCallback(() => <View className="h-5 w-10 bg-green" />, [])

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
      <InfiniteScrollFlatList
        // eslint-disable-next-line react-native/no-inline-styles
        contentContainerStyle={{ gap: 12 }}
        data={tickets}
        renderItem={renderItem}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        fetchNextPage={fetchNextPage}
        renderSkeleton={renderSkeleton}
        isLoading={isFetching}
      />
    </ScreenContent>
  )
}

const HistoryRoute = () => {
  const { data: ticketsResponse } = useQueryWithFocusRefetch(ticketsOptions({ active: false }))

  const renderItem: ListRenderItem<TicketDto> = useCallback(
    ({ item }) => <TicketCard ticket={item} />,
    [],
  )

  const tickets = ticketsResponse?.tickets ?? []

  return (
    <ScreenContent>
      <View className="h-full bg-white">
        <FlatList
          // eslint-disable-next-line react-native/no-inline-styles
          contentContainerStyle={{ gap: 12 }}
          data={tickets}
          renderItem={renderItem}
        />
      </View>
    </ScreenContent>
  )
}

const renderScene = SceneMap({
  active: ActiveTicketsRoute,
  history: HistoryRoute,
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
