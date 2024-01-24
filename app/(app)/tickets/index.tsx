import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
import { Link, router } from 'expo-router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { FlatList, Linking, ListRenderItem, useWindowDimensions, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { SceneMap, TabView } from 'react-native-tab-view'

import ActionRow from '@/components/list-rows/ActionRow'
import TabBar from '@/components/navigation/TabBar'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import EmptyStateScreen from '@/components/screen-layout/EmptyStateScreen'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Button from '@/components/shared/Button'
import FloatingButton from '@/components/shared/FloatingButton'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import SkeletonTicketCard from '@/components/tickets/SkeletonTicketCard'
import TicketCard from '@/components/tickets/TicketCard'
import { useQueryInvalidateOnTicketExpire } from '@/hooks/useQueryInvalidateOnTicketExpire'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
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
  const filters = useTicketsFiltersStoreContext()

  const [activeId, setActiveId] = useState<number | null>(null)

  const bottomSheetRef = useRef<BottomSheet>(null)

  const now = useMemo(() => new Date(), [])

  const fromTo = transformTimeframeToFromTo(filters.timeframe, now)

  const downloadReceiptMutation = useMutation({
    mutationFn: (id: number) => clientApi.ticketsControllerGetReceipt(id),
    onSuccess: async (res) => {
      await Linking.openURL(res.data)

      bottomSheetRef.current?.close()
    },
  })

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    [],
  )

  const handleMorePress = useCallback((id: number) => {
    bottomSheetRef.current?.expand()
    setActiveId(id)
  }, [])

  const handleDownloadReceipt = () => {
    if (activeId) {
      downloadReceiptMutation.mutate(activeId)
    }
  }

  const ticketsQueryOptions = ticketsInfiniteQuery({
    parkingEndFrom: active ? new Date() : fromTo.parkingEndFrom,
    parkingEndTo: active ? undefined : fromTo.parkingEndTo,
    pageSize: 20,
    ecvs: filters.ecvs === 'all' ? undefined : filters.ecvs,
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
    ({ item }) => <TicketCard ticket={item} isActive={active} handleMorePress={handleMorePress} />,
    [active, handleMorePress],
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
        hasBackButton={false}
        contentTitle={t('noActiveTickets')}
        text={t('noActiveTicketsText')}
        actionButtonPosition="insideContent"
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
        hasBackButton={false}
        contentTitle={t('noHistoryTickets')}
        text={t('noHistoryTicketsText')}
        actionButtonPosition="insideContent"
        actionButton={
          <Button variant="primary" onPress={handleFiltersPress}>
            {t('filtersButton')}
          </Button>
        }
      />
    )
  }

  return (
    <>
      <ScreenContent variant="center">
        <View className="w-full flex-1">
          <FlatList
            // padding bottom is there for the last card to be able to go above the floating button when finishing scroll movement
            contentContainerStyle={{ gap: 12, paddingBottom: 32 }}
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
            className="absolute bottom-0 w-full items-center pb-2"
            pointerEvents="box-none"
            colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
          >
            <FloatingButton startIcon="filter-list" onPress={handleFiltersPress}>
              {t('filtersButton')}
            </FloatingButton>
          </LinearGradient>
        )}
      </ScreenContent>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        enableDynamicSizing
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <BottomSheetContent>
          <PressableStyled
            disabled={downloadReceiptMutation.isPending}
            onPress={handleDownloadReceipt}
          >
            <ActionRow
              startIcon={downloadReceiptMutation.isPending ? 'hourglass-top' : 'file-download'}
              label={t('downloadReceipt')}
            />
          </PressableStyled>
        </BottomSheetContent>
      </BottomSheet>
    </>
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
