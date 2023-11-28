import { router, Stack } from 'expo-router'
import { useCallback, useState } from 'react'
import { Image, ImageSourcePropType, useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SceneRendererProps, TabView } from 'react-native-tab-view'

import {
  MarketingSliderBonusCard,
  MarketingSliderDataSecurity,
  MarketingSliderHelpUsPlan,
  MarketingSliderParkingCards,
  MarketingSliderVisitorsFree,
  MarketingSliderWelcome,
} from '@/assets/images/marketing-slider'
import ContinueButton from '@/components/navigation/ContinueButton'
import MarketingTabBar from '@/components/navigation/MarketingTabBar'
import Typography from '@/components/shared/Typography'
import { useIsOnboardingFinished } from '@/hooks/useIsOnboardingFinished'
import { useTranslation } from '@/hooks/useTranslation'

type RouteKeys =
  | 'welcome'
  | 'dataSecurity'
  | 'parkingCards'
  | 'helpUsPlan'
  | 'visitorsFree'
  | 'bonusCard'
type MarketingSliderRouteProps = {
  slide: RouteKeys
}
const MarketingSliderRoute = ({ slide }: MarketingSliderRouteProps) => {
  const t = useTranslation('OnboardingScreen')
  const image = (
    {
      welcome: MarketingSliderWelcome,
      dataSecurity: MarketingSliderDataSecurity,
      parkingCards: MarketingSliderParkingCards,
      helpUsPlan: MarketingSliderHelpUsPlan,
      visitorsFree: MarketingSliderVisitorsFree,
      bonusCard: MarketingSliderBonusCard,
    } satisfies { [key in RouteKeys]: ImageSourcePropType }
  )[slide]

  return (
    <View className="flex-1">
      <Image source={image} className="w-full" />
      <View className="p-5 g-2">
        <Typography className="text-center" variant="h1">
          {t(`slides.${slide}.title`)}
        </Typography>
        <Typography className="text-center">{t(`slides.${slide}.text`)}</Typography>
      </View>
    </View>
  )
}

const renderScene = ({
  route,
}: SceneRendererProps & {
  route: {
    key: RouteKeys
  }
}) => <MarketingSliderRoute slide={route.key} />

const OnboardingScreen = () => {
  const layout = useWindowDimensions()
  const t = useTranslation('OnboardingScreen')
  const insets = useSafeAreaInsets()
  const [isOnboardingFinished, setIsOnboardingFinished] = useIsOnboardingFinished()

  const [index, setIndex] = useState(0)
  const [routes] = useState<{ key: RouteKeys }[]>([
    { key: 'welcome' },
    { key: 'dataSecurity' },
    { key: 'parkingCards' },
    { key: 'helpUsPlan' },
    { key: 'visitorsFree' },
    { key: 'bonusCard' },
  ])

  const handlePressNext = useCallback(() => {
    if (index === routes.length - 1) {
      if (!isOnboardingFinished) {
        setIsOnboardingFinished(true)
      }
      router.replace('/sign-in')
    } else if (index < routes.length - 1) {
      setIndex((prevIndex) => prevIndex + 1)
    }
  }, [routes, index, isOnboardingFinished, setIsOnboardingFinished])

  if (isOnboardingFinished) {
    // TODO: Uncomment for prod behavior
    // router.replace('/sign-in')
  }

  const buttonLabel = index === routes.length - 1 ? t('getStarted') : t('next')

  return (
    <View className="flex-1">
      <Stack.Screen options={{ headerShown: false }} />

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => <MarketingTabBar {...props} />}
        tabBarPosition="bottom"
        className="pb-5"
        style={{ paddingTop: insets.top }}
      />

      <ContinueButton className="mx-5 mb-5" onPress={handlePressNext}>
        {buttonLabel}
      </ContinueButton>
    </View>
  )
}

export default OnboardingScreen
