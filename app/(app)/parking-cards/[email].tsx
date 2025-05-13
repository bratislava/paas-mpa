import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { useRef, useState } from 'react'
import { View } from 'react-native'

import EmailsBottomSheet from '@/components/parking-cards/EmailsBottomSheet'
import MissingCardCallout from '@/components/parking-cards/MissingCardCallout'
import ParkingCard from '@/components/parking-cards/ParkingCard'
import { ParkingCardsEmptyState } from '@/components/parking-cards/ParkingCardsEmptyState'
import { ParkingCardsFilter, ValidityKey } from '@/components/parking-cards/ParkingCardsFilter'
import SkeletonParkingCard from '@/components/parking-cards/SkeletonParkingCard'
import LoadingScreen from '@/components/screen-layout/LoadingScreen'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import IconButton from '@/components/shared/IconButton'
import { List } from '@/components/shared/List/List'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { parkingCardsInfiniteOptions } from '@/modules/backend/constants/queryOptions'

export type ParkingCardsLocalSearchParams = {
  email: string
  emailId: string
}

const Page = () => {
  const { t } = useTranslation()
  const { email } = useLocalSearchParams<ParkingCardsLocalSearchParams>()
  const [validityKey, setValidityKey] = useState<ValidityKey>('all')

  const bottomSheetRef = useRef<BottomSheetModal>(null)

  const {
    data,
    isPending,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery(parkingCardsInfiniteOptions({ email, validityKey }))

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
        backgroundVariant={parkingCards?.length ? undefined : 'dots'}
        options={{
          headerRight: () => (
            <IconButton
              name="more-horiz"
              testID="emailMoreMenu"
              accessibilityLabel={t('ParkingCards.openEmailActions')}
              onPress={() => bottomSheetRef.current?.present()}
            />
          ),
        }}
      >
        <View className="mt-2 px-4">
          <ParkingCardsFilter selectedKey={validityKey} onChange={setValidityKey} />
        </View>

        {isPending ? (
          <LoadingScreen />
        ) : isError ? (
          <Typography>Error: {error?.message}</Typography>
        ) : parkingCards?.length ? (
          <ScreenContent>
            <List
              estimatedItemSize={162}
              ItemSeparatorComponent={() => <View className="h-3" />}
              data={parkingCards}
              keyExtractor={(parkingCard) => parkingCard.identificator}
              onEndReachedThreshold={0.2}
              onEndReached={loadMore}
              onRefresh={refetch}
              refreshing={isRefetching}
              ListFooterComponent={
                isFetchingNextPage ? (
                  <SkeletonParkingCard />
                ) : (
                  <MissingCardCallout areCardsPresent />
                )
              }
              renderItem={({ item: parkingCardItem }) => <ParkingCard card={parkingCardItem} />}
            />
          </ScreenContent>
        ) : (
          <ParkingCardsEmptyState validityKey={validityKey} />
        )}
      </ScreenView>

      <EmailsBottomSheet ref={bottomSheetRef} />
    </>
  )
}

export default Page
