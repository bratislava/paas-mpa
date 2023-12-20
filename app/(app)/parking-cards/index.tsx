import { useInfiniteQuery } from '@tanstack/react-query'
import { Link, Stack } from 'expo-router'
import { FlatList, View } from 'react-native'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'

import ListRow from '@/components/list-rows/ListRow'
import SkeletonParkingCard from '@/components/parking-cards/SkeletonParkingCard'
import EmptyStateScreen from '@/components/screen-layout/EmptyStateScreen'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Button from '@/components/shared/Button'
import Divider from '@/components/shared/Divider'
import IconButton from '@/components/shared/IconButton'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { verifiedEmailsInfiniteOptions } from '@/modules/backend/constants/queryOptions'

const Page = () => {
  const t = useTranslation('ParkingCards')

  const { data, isPending, isError, error, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery(verifiedEmailsInfiniteOptions())

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage()
    }
  }

  if (isPending) {
    return (
      <ScreenContent>
        <SkeletonParkingCard />
      </ScreenContent>
    )
  }

  if (isError) {
    return <Typography>Error: {error.message}</Typography>
  }

  const verifiedEmails = data.pages.flatMap((page) => page.data.verifiedEmails)

  if (verifiedEmails.length === 0) {
    return (
      <EmptyStateScreen
        title={t('paasEmailsTitle')}
        contentTitle={t('noEmailsTitle')}
        text={t('noEmailsText')}
        actionButton={
          <Link asChild href="/parking-cards/verification">
            <Button>{t('addParkingCards')}</Button>
          </Link>
        }
        actionButtonPosition="insideContent"
      />
    )
  }

  return (
    <ScreenView title={t('paasEmailsTitle')}>
      <Stack.Screen
        options={{
          headerRight: () =>
            verifiedEmails.length > 0 ? (
              <Link asChild href="/parking-cards/verification">
                <IconButton name="add" accessibilityLabel={t('addParkingCards')} />
              </Link>
            ) : null,
        }}
      />

      <ScreenContent>
        <Typography variant="default-bold">{t('paasEmailsList')}</Typography>

        <FlatList
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
                    <SkeletonPlaceholder.Item height={16} width={150} />
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
              key={emailItem.id}
            >
              <PressableStyled>
                <ListRow label={emailItem.email} />
              </PressableStyled>
            </Link>
          )}
        />
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
