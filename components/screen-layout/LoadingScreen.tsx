import clsx from 'clsx'
import { ActivityIndicator, View, ViewProps } from 'react-native'

import ScreenView from '@/components/screen-layout/ScreenView'

type LoadingScreenProps = {
  asScreenView?: boolean
} & ViewProps

const LoadingScreen = ({ asScreenView, className, ...rest }: LoadingScreenProps) => {
  if (asScreenView) {
    return (
      <ScreenView
        className={clsx('flex-1 items-center justify-center', className)}
        contentPosition="center"
        backgroundVariant="dots"
        {...rest}
      >
        <ActivityIndicator size="large" />
      </ScreenView>
    )
  }

  return (
    <View className={clsx('flex-1 items-center justify-center', className)} {...rest}>
      <ActivityIndicator size="large" />
    </View>
  )
}

export default LoadingScreen
