import { useCallback, useMemo, useState } from 'react'
import { FlatList, ListRenderItem, useWindowDimensions, View } from 'react-native'
import { SceneMap, TabView } from 'react-native-tab-view'

import TabBar from '@/components/navigation/TabBar'
import EmptyStateScreen from '@/components/screen-layout/EmptyStateScreen'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Button from '@/components/shared/Button'
import TicketCard from '@/components/tickets/TicketCard'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { useTranslation } from '@/hooks/useTranslation'
import { ticketsOptions } from '@/modules/backend/constants/queryOptions'
import { TicketDto } from '@/modules/backend/openapi-generated'

const ActiveTicketsRoute = () => {
  const t = useTranslation('Tickets')

  const now = useMemo(() => new Date().toISOString(), [])
  const { data: ticketsResponse } = useQueryWithFocusRefetch(
    ticketsOptions({
      parkingEndFrom: now,
    }),
  )
  const { tickets } = ticketsResponse ?? {}

  const renderItem: ListRenderItem<TicketDto> = useCallback(
    ({ item }) => <TicketCard ticket={item} />,
    [],
  )

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
      />
    </ScreenContent>
  )
}

const HistoryRoute = () => {
  const now = useMemo(() => new Date().toISOString(), [])

  const { data: ticketsResponse } = useQueryWithFocusRefetch(
    ticketsOptions({
      parkingEndTo: now,
    }),
  )

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
