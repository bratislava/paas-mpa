import { useMMKVBoolean } from 'react-native-mmkv'

export const useIsOnboardingFinished = () => {
  const [isOnboardingFinished, setIsOnboardingFinished] = useMMKVBoolean('is-onboarding-finished')

  return [isOnboardingFinished, setIsOnboardingFinished] as const
}
