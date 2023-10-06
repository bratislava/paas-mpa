import React, { useState } from 'react'
import { useWindowDimensions } from 'react-native'
import { SceneMap, TabView } from 'react-native-tab-view'

import TabBar from '@/components/navigation/TabBar'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import Typography from '@/components/shared/Typography'
import TicketCard from '@/components/tickets/TicketCard'
import { useTranslation } from '@/hooks/useTranslation'

const ActiveTicketsRoute = () => (
  <ScreenContent>
    <Typography>TODO</Typography>
    <TicketCard />
  </ScreenContent>
)

const HistoryRoute = () => (
  <ScreenContent>
    <Typography>History</Typography>
  </ScreenContent>
)

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
    <ScreenView title={t('title')}>
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
