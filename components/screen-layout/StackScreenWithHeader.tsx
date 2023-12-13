import { Stack } from 'expo-router'

import { stackHeaderBackButton } from '@/utils/stackHeaderBackButton'

type Props = (typeof Stack.Screen)['prototype']['props']

/**
 * Component that wraps Stack.Screen and adds some default options
 */
const StackScreenWithHeader = ({ options, ...passingProps }: Props) => {
  return (
    <Stack.Screen
      options={{
        headerShown: true,
        headerLeft: stackHeaderBackButton,
        headerShadowVisible: false,
        ...options,
      }}
      {...passingProps}
    />
  )
}

export default StackScreenWithHeader
