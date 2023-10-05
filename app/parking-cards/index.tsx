import { Link, useNavigation } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ScrollView, useWindowDimensions, View } from 'react-native'
import { SceneMap, TabView } from 'react-native-tab-view'

import TabBar from '@/components/navigation/TabBar'
import BonusCard from '@/components/parking-cards/BonusCard'
import ResidentCard from '@/components/parking-cards/ResidentCard'
import SubscriberCard from '@/components/parking-cards/SubscriberCard'
import VisitorCard from '@/components/parking-cards/VisitorCard'
import FlexRow from '@/components/shared/FlexRow'
import IconButton from '@/components/shared/IconButton'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'

const Active = () => {
  const t = useTranslation('ParkingCards')

  return (
    <ScrollView>
      <ScreenContent>
        <Typography variant="h1">TODO</Typography>

        <View className="g-3">
          <FlexRow>
            <Typography variant="default-bold">katarina.novotna@gmail.com</Typography>
            {/* TODO translation */}
            {/* TODO actions */}
            <IconButton name="more-vert" accessibilityLabel="More" />
          </FlexRow>
          <VisitorCard />
          <ResidentCard />
          <BonusCard />
          <SubscriberCard />
        </View>
      </ScreenContent>
    </ScrollView>
  )
}

const Expired = () => {
  const t = useTranslation('ParkingCards')

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
  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Link asChild href="/parking-cards/enter-paas-account">
          <IconButton name="add" accessibilityLabel={t('addParkingCards')} />
        </Link>
      ),
    })
  }, [])

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
