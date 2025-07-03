import { ScreenProps } from 'expo-router/build/views/Screen'
import { ReactNode } from 'react'
import { Image, View, ViewProps } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { cn } from '@/utils/cn'

import StackScreenWithHeader from './StackScreenWithHeader'

// eslint-disable-next-line @typescript-eslint/no-var-requires, unicorn/prefer-module
const dottedBackground = require('@/assets/images/dotted-background.png')

export type ScreenViewProps = {
  children: ReactNode
  title?: string
  contentPosition?: 'default' | 'center'
  backgroundVariant?: 'white' | 'dots'
  actionButton?: ReactNode
  /**
   * Whether to show the back button in the header
   * @default true
   */
  hasBackButton?: boolean
  options?: Exclude<ScreenProps['options'], Function>
} & ViewProps

const ScreenView = ({
  children,
  className,
  title,
  contentPosition = 'default',
  backgroundVariant = 'white',
  actionButton,
  hasBackButton = true,
  options,
  ...rest
}: ScreenViewProps) => {
  const insets = useSafeAreaInsets()

  const hasHeader = title || options || hasBackButton

  return (
    <View className="flex-1 bg-white">
      {backgroundVariant === 'dots' && (
        <Image source={dottedBackground} className="absolute h-full w-full" />
      )}

      <View
        className={cn('flex-1', className)}
        style={{
          paddingTop:
            !options?.headerTransparent && options?.headerShown !== false && hasHeader
              ? undefined
              : insets.top,
          paddingBottom: insets.bottom,
        }}
        {...rest}
      >
        {hasHeader ? (
          <StackScreenWithHeader
            options={{
              title,
              headerBackVisible: hasBackButton,
              ...options,
            }}
          />
        ) : null}

        <View
          className={cn('flex-1', {
            'justify-center': contentPosition === 'center',
          })}
        >
          {children}
        </View>

        {actionButton ? (
          <View className="p-5" style={{ paddingBottom: 12 }}>
            {actionButton}
          </View>
        ) : null}
      </View>
    </View>
  )
}

export default ScreenView
