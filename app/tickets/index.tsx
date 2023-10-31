import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { useCallback, useState } from 'react'
import { FlatList, ListRenderItem, useWindowDimensions, View } from 'react-native'
import { SceneMap, TabView } from 'react-native-tab-view'

import { EmptyStateAvatar } from '@/assets/avatars'
import TabBar from '@/components/navigation/TabBar'
import ModalContentWithActions from '@/components/screen-layout/Modal/ModalContentWithActions'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import TicketCard from '@/components/tickets/TicketCard'
import { useTranslation } from '@/hooks/useTranslation'
import { ticketsOptions } from '@/modules/backend/constants/queryOptions'
import { TicketDto } from '@/modules/backend/openapi-generated'

const ActiveTicketsRoute = () => {
  const { data: ticketsResponse } = useQuery(ticketsOptions({ active: true }))
  const renderItem: ListRenderItem<TicketDto> = useCallback(
    ({ item }) => <TicketCard ticket={item} />,
    [],
  )

  const tickets = ticketsResponse?.tickets

  const isShowingTickets = tickets && tickets.length > 0

  return (
    <ScreenContent
      className={clsx('h-full px-0', !isShowingTickets && 'justify-center bg-transparent')}
    >
      {isShowingTickets ? (
        <View className="h-full bg-white px-5">
          <FlatList
            // eslint-disable-next-line react-native/no-inline-styles
            contentContainerStyle={{ gap: 12 }}
            data={tickets}
            renderItem={renderItem}
          />
        </View>
      ) : (
        <ModalContentWithActions
          variant="success"
          title="No active tickets"
          text="Blababalalalabablal"
          primaryActionLabel="Buy a ticket"
          primaryActionOnPress={() => false}
          customAvatarComponent={
            <View className="w-full items-center">
              <EmptyStateAvatar />
            </View>
          }
          className="bg-white"
        />
      )}
    </ScreenContent>
  )
}

const HistoryRoute = () => {
  const { data: ticketsResponse } = useQuery(ticketsOptions({ active: false }))
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
    { key: 'active', title: 'Active tickets' },
    { key: 'history', title: 'History' },
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
