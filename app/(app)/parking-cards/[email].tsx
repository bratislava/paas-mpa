import BottomSheet from '@gorhom/bottom-sheet'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useRef } from 'react'
import { FlatList } from 'react-native'

import EmailsBottomSheet from '@/components/parking-cards/EmailsBottomSheet'
import ParkingCard from '@/components/parking-cards/ParkingCard'
import SkeletonParkingCard from '@/components/parking-cards/SkeletonParkingCard'
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

  const { data, isPending, isError, error, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery(parkingCardsInfiniteOptions({ email }))

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
        onEndReachedThreshold={0.2}
        onEndReached={loadMore}
        contentContainerStyle={{ gap: 12 }}
        ListFooterComponent={isFetchingNextPage ? <SkeletonParkingCard /> : null}
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

const Page = () => {
  const t = useTranslation('ParkingCards')
  const { email } = useLocalSearchParams<ParkingCardsLocalSearchParams>()

  const bottomSheetRef = useRef<BottomSheet>(null)

  return (
    <>
      <ScreenView title={email} hasBackButton>
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

        <ActiveCards />
      </ScreenView>

      <EmailsBottomSheet ref={bottomSheetRef} />
    </>
  )
}

export default Page
