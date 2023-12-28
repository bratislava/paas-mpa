import { clsx } from 'clsx'
import { useNavigation } from 'expo-router'
import { ReactNode, useEffect } from 'react'
import { Image, View, ViewProps } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import StackScreenWithHeader from './StackScreenWithHeader'

// eslint-disable-next-line @typescript-eslint/no-var-requires, unicorn/prefer-module
const dottedBackground = require('@/assets/images/dotted-background.png')

export type ScreenViewProps = {
  children: ReactNode
  title?: string
  contentPosition?: 'default' | 'center'
  backgroundVariant?: 'white' | 'dots'
  actionButton?: ReactNode
  hasBackButton?: boolean
} & ViewProps

const ScreenView = ({
  children,
  className,
  title,
  contentPosition = 'default',
  backgroundVariant = 'white',
  actionButton,
  hasBackButton,
  ...rest
}: ScreenViewProps) => {
  const navigation = useNavigation()
  useEffect(() => {
    // This is our problem: https://github.com/expo/expo/issues/24553#issuecomment-1749261475
    // but the solution provided does not work
    // Here we are hiding the header for the root navigation when the nested navigator is rendered
    // this keeps the back button working as expected and the title is also correctly displayed
    const rootNavigation = navigation.getParent()
    rootNavigation?.setOptions({ headerShown: false })
  }, [navigation])

  const insets = useSafeAreaInsets()

  return (
    <View className={clsx('flex-1 bg-white', className)} {...rest}>
      {title?.length ? (
        <StackScreenWithHeader
          options={{
            title,
            headerBackVisible: hasBackButton,
          }}
        />
      ) : null}

      {backgroundVariant === 'dots' && (
        <Image source={dottedBackground} className="absolute h-full w-full" />
      )}
      <View
        className={clsx('flex-1', {
          'justify-center': contentPosition === 'center',
        })}
      >
        {children}
      </View>

      {actionButton ? (
        <View className="p-5" style={{ paddingBottom: insets.bottom + 12 }}>
          {actionButton}
        </View>
      ) : null}
    </View>
  )
}

export default ScreenView
