import { useQuery } from '@tanstack/react-query'
import { Link, useNavigation } from 'expo-router'
import React, { useEffect } from 'react'
import { FlatList } from 'react-native'

import ListRow from '@/components/actions/ListRow'
import Divider from '@/components/shared/Divider'
import IconButton from '@/components/shared/IconButton'
import PressableStyled from '@/components/shared/PressableStyled'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'

const Page = () => {
  const t = useTranslation('ParkingCards')
  const navigation = useNavigation()

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['VerifiedEmails'],
    queryFn: () => clientApi.verifiedEmailsControllerVerifiedEmailsGetMany(1, 10),
    select: (res) => res.data,
  })

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Link asChild href="/parking-cards/enter-paas-account">
          <IconButton name="add" accessibilityLabel={t('addParkingCards')} />
        </Link>
      ),
    })
  }, [navigation, t])

  if (isPending) {
    return <Typography>Loading...</Typography>
  }

  if (isError) {
    return <Typography>Error: {error.message}</Typography>
  }

  return (
    <ScreenView title={t('paasEmailsTitle')}>
      <ScreenContent>
        <Typography variant="default-bold">{t('paasEmailsList')}</Typography>
        <FlatList
          data={data.verifiedEmails}
          keyExtractor={(emailItem) => emailItem.email}
          ItemSeparatorComponent={() => <Divider />}
          renderItem={({ item: emailItem }) => (
            <Link asChild href={`/parking-cards/${emailItem.email}`} key={emailItem.id}>
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
