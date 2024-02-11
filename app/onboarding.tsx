import { router, Stack, useFocusEffect } from 'expo-router'
import { useCallback, useRef, useState } from 'react'
import { useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SceneRendererProps, TabView } from 'react-native-tab-view'

import {
  SlideBonusCard,
  SlideBonusCardEN,
  SlideDataSecurity,
  SlideHelpUsPlan,
  SlideParkingCards,
  SlideParkingCardsEN,
  SlideVisitorsFree,
  SlideWelcome,
} from '@/assets/onboarding-slides'
import ContinueButton from '@/components/navigation/ContinueButton'
import MarketingTabBar from '@/components/navigation/MarketingTabBar'
import InfoSlide from '@/components/screen-layout/InfoSlide'
import Button from '@/components/shared/Button'
import FlexRow from '@/components/shared/FlexRow'
import IconButton from '@/components/shared/IconButton'
import { environment } from '@/environment'
import { useIsOnboardingFinished } from '@/hooks/useIsOnboardingFinished'
import { useLocale, useTranslation } from '@/hooks/useTranslation'

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
type OnboardingRoute = {
  key: RouteKeys
  accessibilityLabel: string
}
const MarketingSliderRoute = ({ slide }: MarketingSliderRouteProps) => {
  const t = useTranslation('OnboardingScreen')
  const locale = useLocale()

  const SvgImage = {
    welcome: SlideWelcome,
    dataSecurity: SlideDataSecurity,
    parkingCards: locale === 'en' ? SlideParkingCardsEN : SlideParkingCards,
    helpUsPlan: SlideHelpUsPlan,
    visitorsFree: SlideVisitorsFree,
    bonusCard: locale === 'en' ? SlideBonusCardEN : SlideBonusCard,
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

const routeKeys: RouteKeys[] = [
  'welcome',
  'visitorsFree',
  'bonusCard',
  'parkingCards',
  'dataSecurity',
  // TODO uncomment when we have final wording
  // 'helpUsPlan',
]

const renderScene = ({
  route,
}: SceneRendererProps & {
  route: OnboardingRoute
}) => <MarketingSliderRoute slide={route.key} />

const OnboardingScreen = () => {
  const layout = useWindowDimensions()
  const t = useTranslation('OnboardingScreen')
  const insets = useSafeAreaInsets()
  const [isOnboardingFinished] = useIsOnboardingFinished()

  const jumpToRef = useRef<SceneRendererProps['jumpTo']>()
  const [index, setIndex] = useState(0)
  const [routes] = useState<OnboardingRoute[]>(
    routeKeys.map((key) => ({
      key,
      accessibilityLabel: t(`slideAccessibilityLabel`, {
        title: t(`slides.${key}.title`),
      }),
    })),
  )

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
    <View className="flex-1" style={{ paddingBottom: insets.bottom, paddingTop: insets.top }}>
      <Stack.Screen options={{ headerShown: false }} />
      <FlexRow className="h-[50px] px-5 py-3">
        {index > 0 ? (
          <IconButton
            onPress={() => {
              if (jumpToRef?.current) {
                jumpToRef.current(routes[index - 1].key)
              }
            }}
            accessibilityLabel={t('goBack')}
            name="arrow-back"
          />
        ) : null}
      </FlexRow>

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
      />

      <ContinueButton className="mx-5 mb-2" onPress={handlePressNext}>
        {buttonLabel}
      </ContinueButton>

      {index === routes.length - 1 ? null : (
        <Button className="mb-4 mt-2" variant="plain" onPress={() => router.push('/sign-in')}>
          {t('skip')}
        </Button>
      )}
    </View>
  )
}

export default OnboardingScreen
