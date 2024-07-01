import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { useRef } from 'react'
import { FlatList, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import { EmptyStateAvatar } from '@/assets/avatars'
import EmailsBottomSheet from '@/components/parking-cards/EmailsBottomSheet'
import ParkingCard from '@/components/parking-cards/ParkingCard'
import SkeletonParkingCard from '@/components/parking-cards/SkeletonParkingCard'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import LoadingScreen from '@/components/screen-layout/LoadingScreen'
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
  const { t } = useTranslation()
  const { email } = useLocalSearchParams<ParkingCardsLocalSearchParams>()

  const bottomSheetRef = useRef<BottomSheetModal>(null)

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
        backgroundVariant={parkingCards?.length ? undefined : 'dots'}
        options={{
          headerRight: () => (
            <IconButton
              name="more-horiz"
              accessibilityLabel={t('ParkingCards.openEmailActions')}
              onPress={() => bottomSheetRef.current?.present()}
            />
          ),
        }}
      >
        {isPending ? (
          <LoadingScreen />
        ) : isError ? (
          <Typography>Error: {error?.message}</Typography>
        ) : parkingCards?.length ? (
          // We aren't using ScreenContent here to use whole width for FlatList, to have scrollbar on the right edge of the screen.
          <View className="flex-1">
            <FlatList
              // Padding x and top are the same as in ScreenContent
              contentContainerStyle={{ gap: 12, padding: 20 }}
              data={parkingCards}
              keyExtractor={(parkingCard) => parkingCard.identificator}
              onEndReachedThreshold={0.2}
              onEndReached={loadMore}
              ListFooterComponent={isFetchingNextPage ? <SkeletonParkingCard /> : null}
              renderItem={({ item: parkingCardItem }) => (
                <ParkingCard key={parkingCardItem.identificator} card={parkingCardItem} />
              )}
            />
            {/* TODO make a reusable component from this */}
            <View className="absolute bottom-0 left-0 right-0">
              <LinearGradient
                pointerEvents="box-none"
                // From transparent to white
                colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
              >
                <View className="h-5" />
              </LinearGradient>
            </View>
          </View>
        ) : (
          <View className="flex-1 justify-center">
            <ContentWithAvatar
              title={t('ParkingCards.noActiveCardsTitle')}
              text={t('ParkingCards.noActiveCardsText')}
              customAvatarComponent={<EmptyStateAvatar />}
            />
          </View>
        )}
      </ScreenView>

      <EmailsBottomSheet ref={bottomSheetRef} />
    </>
  )
}

export default Page
