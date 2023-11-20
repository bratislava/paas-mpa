import BottomSheet from '@gorhom/bottom-sheet'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useRef, useState } from 'react'
import { FlatList, useWindowDimensions } from 'react-native'
import { SceneMap, TabView } from 'react-native-tab-view'

import TabBar from '@/components/navigation/TabBar'
import EmailsBottomSheet from '@/components/parking-cards/EmailsBottomSheet'
import ParkingCard from '@/components/parking-cards/ParkingCard'
import EmptyStateScreen from '@/components/screen-layout/EmptyStateScreen'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import IconButton from '@/components/shared/IconButton'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { parkingCardsInfiniteOptions } from '@/modules/backend/constants/queryOptions'

export type ParkingCardsLocalSearchParams = {
  email: string
  emailId: string
}

const ActiveCards = () => {
  const t = useTranslation('ParkingCards')
  const { email } = useLocalSearchParams<ParkingCardsLocalSearchParams>()

  const { data, isPending, isError, error, hasNextPage, fetchNextPage } = useInfiniteQuery(
    parkingCardsInfiniteOptions({ email }),
  )

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage()
    }
  }

  if (isPending) {
    return <Typography>Loading...</Typography>
  }

  if (isError) {
    return <Typography>Error: {error.message}</Typography>
  }

  const parkingCards = data.pages.flatMap((page) => page.data.parkingCards)

  if (parkingCards.length === 0) {
    return <EmptyStateScreen contentTitle={t('noActiveCardsTitle')} text={t('noActiveCardsText')} />
  }

  return (
    <ScreenContent>
      <FlatList
        data={parkingCards}
        keyExtractor={(parkingCard) => parkingCard.identificator}
        onEndReached={loadMore}
        // eslint-disable-next-line react-native/no-inline-styles
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item: parkingCardItem }) => (
          <ParkingCard key={parkingCardItem.identificator} card={parkingCardItem} />
        )}
      />
    </ScreenContent>
  )
}

// TODO Expired Cards - this have to be defined by Product manager
// const ExpiredCards = () => {
//   return (
//     <ScrollView>
//       <ScreenContent>
//         <Typography>Expired cards</Typography>
//       </ScreenContent>
//     </ScrollView>
//   )
// }

const renderScene = SceneMap({
  active: ActiveCards,
  // expired: ExpiredCards,
})

const Page = () => {
  const t = useTranslation('ParkingCards')
  const { email } = useLocalSearchParams<ParkingCardsLocalSearchParams>()

  const bottomSheetRef = useRef<BottomSheet>(null)

  const layout = useWindowDimensions()

  const [index, setIndex] = useState(0)
  const [routes] = useState([
    { key: 'active', title: t('activeCards') },
    // { key: 'expired', title: t('expiredCards') },
  ])

  return (
    <>
      <ScreenView title={email}>
        <Stack.Screen
          options={{
            headerRight: () => (
              <IconButton
                name="more-horiz"
                accessibilityLabel={t('openEmailActions')}
                onPress={() => bottomSheetRef.current?.expand()}
              />
            ),
          }}
        />

        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={(props) => <TabBar {...props} />}
        />
      </ScreenView>

      <EmailsBottomSheet ref={bottomSheetRef} />
    </>
  )
}

export default Page
