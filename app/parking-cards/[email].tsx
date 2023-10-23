import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { ScrollView, useWindowDimensions, View } from 'react-native'
import { SceneMap, TabView } from 'react-native-tab-view'

import TabBar from '@/components/navigation/TabBar'
import FlexRow from '@/components/shared/FlexRow'
import IconButton from '@/components/shared/IconButton'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'

const Active = () => {
  const { email } = useLocalSearchParams<{ email: string }>()

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['ParkingCardsActive'],
    enabled: !!email,
    queryFn: () => clientApi.parkingCardsControllerGetParkingCards(email!),
    select: (res) => res.data,
  })

  if (isPending) {
    return <Typography>Loading...</Typography>
  }

  if (isError) {
    return <Typography>Error: {error.message}</Typography>
  }
  const cards = data.parkingCards

  console.log('PARKING CARDS', cards)

  return (
    <ScrollView>
      <ScreenContent>
        <Typography variant="h1">TODO</Typography>

        <View className="g-3">
          <FlexRow>
            <Typography variant="default-bold">{email}</Typography>
            {/* TODO translation */}
            {/* TODO actions */}
            <IconButton name="more-vert" accessibilityLabel="More" />
          </FlexRow>

          {cards.map((card) => {
            // TODO return card component
            return <Typography>{card.type}</Typography>
          })}

          {/* <VisitorCard /> */}
          {/* <ResidentCard /> */}
          {/* <BonusCard /> */}
          {/* <SubscriberCard /> */}
        </View>
      </ScreenContent>
    </ScrollView>
  )
}

const Expired = () => {
  return (
    <ScrollView>
      <ScreenContent>
        <Typography>Expired cards TODO</Typography>
      </ScreenContent>
    </ScrollView>
  )
}

const renderScene = SceneMap({
  active: Active,
  expired: Expired,
})

// TODO
const Page = () => {
  const t = useTranslation('ParkingCards')

  const layout = useWindowDimensions()

  const [index, setIndex] = useState(0)
  const [routes] = useState([
    { key: 'active', title: t('activeCards') },
    { key: 'expired', title: t('expiredCards') },
  ])

  return (
    <ScreenView title={t('title')}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => <TabBar {...props} />}
      />
    </ScreenView>
  )
}

export default Page
