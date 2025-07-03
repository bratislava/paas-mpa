import { router, useLocalSearchParams } from 'expo-router'
import { useMemo } from 'react'
import { useWindowDimensions, View } from 'react-native'
import { SceneMap, TabView } from 'react-native-tab-view'

import TabBar from '@/components/navigation/TabBar'
import ScreenView from '@/components/screen-layout/ScreenView'
import Typography from '@/components/shared/Typography'
import { TicketsList } from '@/components/tickets/TicketsList'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/utils/cn'

const ActiveTicketsRoute = () => <TicketsList active />
const HistoryTicketsRoute = () => <TicketsList />

const renderScene = SceneMap({
  active: ActiveTicketsRoute,
  history: HistoryTicketsRoute,
})

type TabType = 'active' | 'history'

type TicketsSearchParams = {
  tab: TabType
}

const Page = () => {
  const { t } = useTranslation()
  const layout = useWindowDimensions()
  const { tab } = useLocalSearchParams<TicketsSearchParams>()

  const routes = useMemo(
    () => [
      { key: 'active', title: t('Tickets.activeTickets') },
      { key: 'history', title: t('Tickets.history') },
    ],
    [t],
  )

  const index = useMemo(() => {
    const foundIndex = routes.findIndex((route) => route.key === tab)

    return foundIndex >= 0 ? foundIndex : 0
  }, [tab, routes])

  const navigateToTab = (newIndex: number) => {
    router.setParams({ tab: routes[newIndex].key })
  }

  return (
    <ScreenView title={t('Tickets.title')}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={navigateToTab}
        initialLayout={{ width: layout.width }}
        commonOptions={{
          label: ({ route, focused }) => {
            return (
              <View className="items-center justify-center">
                <Typography
                  variant="default-bold"
                  className={cn('text-dark', { 'text-green': focused })}
                >
                  {route.title}
                </Typography>
              </View>
            )
          },
        }}
        renderTabBar={(props) => <TabBar {...props} />}
      />
    </ScreenView>
  )
}

export default Page
