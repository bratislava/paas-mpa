import { useQuery } from '@tanstack/react-query'
import { Link, Stack } from 'expo-router'
import { FlatList } from 'react-native'

import ListRow from '@/components/actions/ListRow'
import Divider from '@/components/shared/Divider'
import IconButton from '@/components/shared/IconButton'
import PressableStyled from '@/components/shared/PressableStyled'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { verifiedEmailsOptions } from '@/modules/backend/constants/queryOptions'

const Page = () => {
  const t = useTranslation('ParkingCards')

  // TODO invalidate/refresh query on add/remove
  const { data, isPending, isError, error } = useQuery(verifiedEmailsOptions())

  if (isPending) {
    return <Typography>Loading...</Typography>
  }

  if (isError) {
    return <Typography>Error: {error.message}</Typography>
  }

  return (
    <ScreenView title={t('paasEmailsTitle')}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Link asChild href="/parking-cards/enter-paas-account">
              <IconButton name="add" accessibilityLabel={t('addParkingCards')} />
            </Link>
          ),
        }}
      />

      <ScreenContent>
        <Typography variant="default-bold">{t('paasEmailsList')}</Typography>
        <FlatList
          data={data.verifiedEmails}
          keyExtractor={(emailItem) => emailItem.email}
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
