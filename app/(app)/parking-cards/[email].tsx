import BottomSheet from '@gorhom/bottom-sheet'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { useRef } from 'react'
import { FlatList } from 'react-native'

import EmailsBottomSheet from '@/components/parking-cards/EmailsBottomSheet'
import ParkingCard from '@/components/parking-cards/ParkingCard'
import SkeletonParkingCard from '@/components/parking-cards/SkeletonParkingCard'
import EmptyStateScreen from '@/components/screen-layout/EmptyStateScreen'
import LoadingScreen from '@/components/screen-layout/LoadingScreen'
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

const Page = () => {
  const t = useTranslation('ParkingCards')
  const { email } = useLocalSearchParams<ParkingCardsLocalSearchParams>()

  const bottomSheetRef = useRef<BottomSheet>(null)

  const { data, isPending, isError, error, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery(parkingCardsInfiniteOptions({ email }))

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage()
    }
  }

  const parkingCards = data?.pages.flatMap((page) => page.data.parkingCards)

  return (
    <>
      <ScreenView
        title={email}
        options={{
          headerRight: () => (
            <IconButton
              name="more-horiz"
              accessibilityLabel={t('openEmailActions')}
              onPress={() => bottomSheetRef.current?.expand()}
            />
          ),
        }}
        hasInsets={!!(!parkingCards || parkingCards?.length)}
        hasBackButton
      >
        {isPending ? (
          <LoadingScreen />
        ) : isError ? (
          <Typography>Error: {error?.message}</Typography>
        ) : parkingCards?.length ? (
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
        ) : (
          <EmptyStateScreen contentTitle={t('noActiveCardsTitle')} text={t('noActiveCardsText')} />
        )}
      </ScreenView>

      <EmailsBottomSheet ref={bottomSheetRef} />
    </>
  )
}

export default Page
