import { OnboardingRouteKey } from '@/app/onboarding'
import { useTranslation } from '@/hooks/useTranslation'

export const useOnboardingTranslation = () => {
  const { t } = useTranslation()

  return {
    welcome: {
      title: t('OnboardingScreen.slides.welcome.title'),
      text: t('OnboardingScreen.slides.welcome.text'),
    },
    dataSecurity: {
      title: t('OnboardingScreen.slides.dataSecurity.title'),
      text: t('OnboardingScreen.slides.dataSecurity.text'),
    },
    parkingCards: {
      title: t('OnboardingScreen.slides.parkingCards.title'),
      text: t('OnboardingScreen.slides.parkingCards.text'),
    },
    visitorsFree: {
      title: t('OnboardingScreen.slides.visitorsFree.title'),
      text: t('OnboardingScreen.slides.visitorsFree.text'),
    },
    bonusCard: {
      title: t('OnboardingScreen.slides.bonusCard.title'),
      text: t('OnboardingScreen.slides.bonusCard.text'),
    },
  } satisfies Record<OnboardingRouteKey, { title: string; text: string }>
}
