import { clsx } from 'clsx'
import { Link, Stack, useNavigation } from 'expo-router'
import { Href } from 'expo-router/build/link/href'
import { ReactNode } from 'react'
import { Image, View, ViewProps } from 'react-native'

import ContinueButton from '@/components/navigation/ContinueButton'

// eslint-disable-next-line @typescript-eslint/no-var-requires, unicorn/prefer-module
const dottedBackground = require('@/assets/images/dotted-background.png')

type Props = {
  children: ReactNode
  title?: string
  continueProps?: ContinueProps
  variant?: 'default' | 'centered'
  backgroundVariant?: 'white' | 'dots'
} & ViewProps

export type ContinueProps = {
  href: Href
  label?: string
  isDisabled?: boolean
}

const ScreenView = ({
  children,
  title,
  continueProps,
  variant,
  backgroundVariant = 'white',
  className,
  ...rest
}: Props) => {
  const navigation = useNavigation()
  const rootNavigation = navigation.getParent()
  rootNavigation?.setOptions({ headerShown: false })

  return (
    <View className={clsx('flex-1 bg-white', className)} {...rest}>
      <Stack.Screen options={{ title }} />

      {backgroundVariant === 'dots' && (
        <Image source={dottedBackground} className="absolute h-full w-full" />
      )}
      <View
        className={clsx('flex-1', {
          'justify-center': variant === 'centered',
        })}
      >
        {children}
      </View>
      {continueProps ? (
        <View className="p-5 pb-[50px]">
          <Link asChild href={continueProps.href} disabled={continueProps.isDisabled}>
            <ContinueButton>{continueProps.label}</ContinueButton>
          </Link>
        </View>
      ) : null}
    </View>
  )
}

export default ScreenView
