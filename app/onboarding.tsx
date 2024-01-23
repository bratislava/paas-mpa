import { router, Stack, useFocusEffect } from 'expo-router'
import { useCallback, useRef, useState } from 'react'
import { useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SceneRendererProps, TabView } from 'react-native-tab-view'

import {
  SlideBonusCard,
  SlideDataSecurity,
  SlideHelpUsPlan,
  SlideParkingCards,
  SlideVisitorsFree,
  SlideWelcome,
} from '@/assets/onboarding-slides'
import ContinueButton from '@/components/navigation/ContinueButton'
import MarketingTabBar from '@/components/navigation/MarketingTabBar'
import InfoSlide from '@/components/screen-layout/InfoSlide'
import Button from '@/components/shared/Button'
import { environment } from '@/environment'
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
  const SvgImage = {
    welcome: SlideWelcome,
    dataSecurity: SlideDataSecurity,
    parkingCards: SlideParkingCards,
    helpUsPlan: SlideHelpUsPlan,
    visitorsFree: SlideVisitorsFree,
    bonusCard: SlideBonusCard,
  }[slide]

  return (
    <InfoSlide
      className="flex-1"
      title={t(`slides.${slide}.title`)}
      text={t(`slides.${slide}.text`)}
      SvgImage={SvgImage}
    />
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
  const [isOnboardingFinished] = useIsOnboardingFinished()

  const jumpToRef = useRef<SceneRendererProps['jumpTo']>()
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
      router.push('/sign-in')
    } else if (index < routes.length - 1 && jumpToRef.current) {
      jumpToRef.current(routes[index + 1].key)
    }
  }, [routes, index])

  useFocusEffect(() => {
    if (isOnboardingFinished && environment.deployment !== 'development') {
      router.replace('/sign-in')
    }
  })

  const buttonLabel = index === routes.length - 1 ? t('getStarted') : t('next')

  return (
    <View className="flex-1" style={{ paddingBottom: insets.bottom }}>
      <Stack.Screen options={{ headerShown: false }} />

      <TabView
        navigationState={{ index, routes }}
        renderScene={(props) => {
          if (!jumpToRef.current) {
            jumpToRef.current = props.jumpTo
          }

          return renderScene(props)
        }}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => <MarketingTabBar {...props} />}
        tabBarPosition="bottom"
        className="pb-5"
        style={{ paddingTop: insets.top }}
      />

      <ContinueButton className="mx-5 mb-2" onPress={handlePressNext}>
        {buttonLabel}
      </ContinueButton>

      {index === routes.length - 1 ? null : (
        <Button className="mb-4" variant="plain" onPress={() => router.push('/sign-in')}>
          {t('skip')}
        </Button>
      )}
    </View>
  )
}

export default OnboardingScreen
