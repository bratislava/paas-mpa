import { router, Stack } from 'expo-router'

import { useTranslation } from '@/hooks/useTranslation'

import IconButton from '../shared/IconButton'

type Props = (typeof Stack.Screen)['prototype']['props']

/**
 * Component that wraps Stack.Screen and adds some default options
 */
const StackScreenWithHeader = ({ options, ...passingProps }: Props) => {
  const t = useTranslation('Common')

  return (
    <Stack.Screen
      options={{
        headerShown: true,
        headerLeft: ({ canGoBack }) =>
          canGoBack ? (
            <IconButton onPress={router.back} accessibilityLabel={t('goBack')} name="arrow-back" />
          ) : null,
        headerShadowVisible: false,
        ...options,
      }}
      {...passingProps}
    />
  )
}

export default StackScreenWithHeader
