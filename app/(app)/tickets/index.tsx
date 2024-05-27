import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Link, router } from 'expo-router'
import { useCallback, useRef, useState } from 'react'
import { FlatList, ListRenderItem, useWindowDimensions, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { SceneMap, TabView } from 'react-native-tab-view'

import { EmptyStateAvatar } from '@/assets/avatars'
import TabBar from '@/components/navigation/TabBar'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Button from '@/components/shared/Button'
import FloatingButton from '@/components/shared/FloatingButton'
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

const TicketsRoute = ({ active }: RouteProps) => {
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

  const ticketsQueryOptions = ticketsInfiniteQuery(options)

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
      {/* We aren't using ScreenContent here to use whole width for FlatList, to have scrollbar on the right edge of the screen. */}
      <View className="flex-1">
        <FlatList
          // Padding bottom is there for the last card to be able to go above the floating button when finishing scroll movement.
          // Padding x and top are the same as in ScreenContent
          contentContainerStyle={{ gap: 12, paddingBottom: 64, padding: 20 }}
          data={tickets}
          renderItem={renderItem}
          ListFooterComponent={isFetchingNextPage ? <SkeletonTicketCard /> : null}
          onEndReachedThreshold={0.2}
          onEndReached={loadMore}
          onRefresh={refetch}
          refreshing={isRefetching}
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
      </View>

      {active ? (
        tickets?.length ? null : (
          <View className="absolute bottom-0 w-full p-5">
            <Link asChild href="/purchase">
              <Button variant="primary">{t('Tickets.buyTicket')}</Button>
            </Link>
          </View>
        )
      ) : (
        <View className="absolute bottom-0 w-full">
          <LinearGradient
            pointerEvents="box-none"
            // From transparent to white
            colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
          >
            <View className="items-center px-5 py-2">
              <FloatingButton startIcon="filter-list" onPress={handleFiltersButtonPress}>
                {t('Tickets.filtersButton')}
              </FloatingButton>
            </View>
          </LinearGradient>
        </View>
      )}

      <TicketsHistoryBottomSheet ref={bottomSheetRef} activeId={activeId} />
    </>
  )
}

const ActiveTicketsRoute = () => <TicketsRoute active />
const HistoryTicketsRoute = () => <TicketsRoute />

const renderScene = SceneMap({
  active: ActiveTicketsRoute,
  history: HistoryTicketsRoute,
})

const Page = () => {
  const { t } = useTranslation()
  const layout = useWindowDimensions()

  const [index, setIndex] = useState(0)
  const [routes] = useState([
    { key: 'active', title: t('Tickets.activeTickets') },
    { key: 'history', title: t('Tickets.history') },
  ])

  return (
    <ScreenView title={t('Tickets.title')}>
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
