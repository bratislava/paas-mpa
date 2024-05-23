import { router, Stack, useFocusEffect } from 'expo-router'
import { useCallback, useRef, useState } from 'react'
import { useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SceneRendererProps, TabView } from 'react-native-tab-view'

import {
  ImageBonusCard,
  ImageBonusCardEN,
  ImageDataSecurity,
  ImageParkingCards,
  ImageParkingCardsEN,
  ImageVisitorsFree,
  ImageWelcome,
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

type RouteKeys = 'welcome' | 'dataSecurity' | 'parkingCards' | 'visitorsFree' | 'bonusCard'
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
    welcome: ImageWelcome,
    dataSecurity: ImageDataSecurity,
    parkingCards: locale === 'en' ? ImageParkingCardsEN : ImageParkingCards,
    visitorsFree: ImageVisitorsFree,
    bonusCard: locale === 'en' ? ImageBonusCardEN : ImageBonusCard,
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
    <View
      className="flex-1 bg-white"
      style={{ paddingBottom: insets.bottom, paddingTop: insets.top }}
    >
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
        ) : (
          <View />
        )}

        {index === routes.length - 1 ? null : (
          <Button variant="plain-dark" onPress={() => router.push('/sign-in')}>
            {t('skip')}
          </Button>
        )}
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

      <ContinueButton className="mx-5 my-4" onPress={handlePressNext}>
        {buttonLabel}
      </ContinueButton>
    </View>
  )
}

export default OnboardingScreen
