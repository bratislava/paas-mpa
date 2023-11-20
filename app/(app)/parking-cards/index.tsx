import { useInfiniteQuery } from '@tanstack/react-query'
import { Link, Stack } from 'expo-router'
import { FlatList } from 'react-native'

import ListRow from '@/components/list-rows/ListRow'
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

  const { data, isPending, isError, error, hasNextPage, fetchNextPage } = useInfiniteQuery(
    verifiedEmailsInfiniteOptions(),
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

  const verifiedEmails = data.pages.flatMap((page) => page.data.verifiedEmails)

  if (verifiedEmails.length === 0) {
    return (
      <EmptyStateScreen
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
          onEndReached={loadMore}
          ItemSeparatorComponent={() => <Divider />}
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
