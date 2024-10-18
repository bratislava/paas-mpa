import { useInfiniteQuery } from '@tanstack/react-query'
import { Link } from 'expo-router'
import { View } from 'react-native'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'

import { EmptyStateAvatar } from '@/assets/avatars'
import ListRow from '@/components/list-rows/ListRow'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import LoadingScreen from '@/components/screen-layout/LoadingScreen'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Button from '@/components/shared/Button'
import Divider from '@/components/shared/Divider'
import IconButton from '@/components/shared/IconButton'
import { List } from '@/components/shared/List/List'
import Markdown from '@/components/shared/Markdown'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { verifiedEmailsInfiniteOptions } from '@/modules/backend/constants/queryOptions'

const Page = () => {
  const { t } = useTranslation()

  const { data, isPending, isError, error, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery(verifiedEmailsInfiniteOptions())

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage()
    }
  }

  const verifiedEmails = data?.pages.flatMap((page) => page.data.verifiedEmails) ?? []

  return (
    <ScreenView
      title={t('ParkingCards.title')}
      backgroundVariant={verifiedEmails.length > 0 ? 'white' : 'dots'}
      options={{
        headerRight:
          verifiedEmails.length > 0
            ? () => (
                <Link asChild href="/parking-cards/verification">
                  <IconButton name="add" accessibilityLabel={t('ParkingCards.addParkingCards')} />
                </Link>
              )
            : null,
        headerTransparent: verifiedEmails.length > 0 ? undefined : true,
      }}
    >
      {isPending ? (
        <LoadingScreen />
      ) : isError ? (
        <Typography>Error: {error.message}</Typography>
      ) : verifiedEmails.length > 0 ? (
        <ScreenContent className="g-2">
          <Typography variant="default-bold">{t('ParkingCards.paasEmailsList')}</Typography>

          <List
            estimatedItemSize={62}
            data={verifiedEmails}
            keyExtractor={(emailItem) => emailItem.email}
            onEndReachedThreshold={0.2}
            onEndReached={loadMore}
            ItemSeparatorComponent={() => <Divider />}
            ListFooterComponent={
              isFetchingNextPage ? (
                <View>
                  <Divider />
                  <SkeletonPlaceholder borderRadius={4}>
                    <SkeletonPlaceholder.Item
                      paddingVertical={16}
                      gap={12}
                      flexDirection="row"
                      justifyContent="space-between"
                    >
                      <SkeletonPlaceholder.Item height={20} width={150} />
                      <SkeletonPlaceholder.Item height={20} width={20} />
                    </SkeletonPlaceholder.Item>
                  </SkeletonPlaceholder>
                </View>
              ) : null
            }
            renderItem={({ item: emailItem }) => (
              <Link
                asChild
                // TODO when email is used as param with pathname /parking-cards/[email] - it returns %40 instead of @
                href={{
                  pathname: `/parking-cards/${emailItem.email}`,
                  params: { emailId: emailItem.id },
                }}
              >
                <PressableStyled>
                  <ListRow label={emailItem.email} />
                </PressableStyled>
              </Link>
            )}
          />
        </ScreenContent>
      ) : (
        <View className="flex-1 justify-center">
          <ContentWithAvatar
            title={t('ParkingCards.noEmailsTitle')}
            text={t('ParkingCards.noEmailsText')}
            customAvatarComponent={<EmptyStateAvatar />}
            actionButton={
              <View className="g-10">
                <Link asChild href="/parking-cards/verification">
                  <Button>{t('ParkingCards.addParkingCards')}</Button>
                </Link>

                <View className="bg-white g-2">
                  <Typography className="text-center" variant="h2">
                    {t('ParkingCards.noParkingCard')}
                  </Typography>
                  <Markdown textCenter>{t('ParkingCards.noParkingCardDescription')}</Markdown>
                </View>
              </View>
            }
          />
        </View>
      )}
    </ScreenView>
  )
}

export default Page
