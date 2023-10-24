import BottomSheet from '@gorhom/bottom-sheet'
import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, useWindowDimensions, View } from 'react-native'
import { SceneMap, TabView } from 'react-native-tab-view'

import TabBar from '@/components/navigation/TabBar'
import EmailsBottomSheet from '@/components/parking-cards/EmailsBottomSheet'
import ParkingCard from '@/components/parking-cards/ParkingCard'
import IconButton from '@/components/shared/IconButton'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'

export type ParkingCardsLocalSearchParams = {
  email: string
  emailId: string
}

const Active = () => {
  const { email } = useLocalSearchParams<ParkingCardsLocalSearchParams>()

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

  // TODO pagination
  return (
    <ScrollView>
      <ScreenContent>
        <Typography>TODO pagination, showing only first 10 cards</Typography>

        <View className="g-3">
          {cards.map((card) => {
            return <ParkingCard key={card.identificator} card={card} />
          })}
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

const Page = () => {
  const navigation = useNavigation()
  const t = useTranslation('ParkingCards')
  const { email } = useLocalSearchParams<ParkingCardsLocalSearchParams>()

  const bottomSheetRef = useRef<BottomSheet>(null)

  const layout = useWindowDimensions()

  const [index, setIndex] = useState(0)
  const [routes] = useState([
    { key: 'active', title: t('activeCards') },
    { key: 'expired', title: t('expiredCards') },
  ])

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          name="more-horiz"
          accessibilityLabel={t('openEmailActions')}
          onPress={() => bottomSheetRef.current?.expand()}
        />
      ),
    })
  }, [navigation, t])

  return (
    <>
      <ScreenView title={email}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={(props) => <TabBar {...props} />}
        />
      </ScreenView>

      <EmailsBottomSheet ref={bottomSheetRef} />
    </>
  )
}

export default Page
