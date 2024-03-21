import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { useRef } from 'react'
import { FlatList, View } from 'react-native'

import { EmptyStateAvatar } from '@/assets/avatars'
import EmailsBottomSheet from '@/components/parking-cards/EmailsBottomSheet'
import ParkingCard from '@/components/parking-cards/ParkingCard'
import SkeletonParkingCard from '@/components/parking-cards/SkeletonParkingCard'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
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
              accessibilityLabel={t('openEmailActions')}
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
          <View className="flex-1 justify-center">
            <ContentWithAvatar
              title={t('noActiveCardsTitle')}
              text={t('noActiveCardsText')}
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
