import { clsx } from 'clsx'
import { Link, Stack } from 'expo-router'
import React, { ReactNode } from 'react'
import { View, Image } from 'react-native'

import Button from '@/components/shared/Button'
import { useTranslation } from '@/hooks/useTranslation'

const dottedBackground = require('@/assets/images/dotted-background.png')

type Props = {
  children: ReactNode
  title?: string
  continueProps?: ContinueProps
  variant?: 'default' | 'centered'
  backgroundVariant?: 'white' | 'dots'
  cn?: string
}

export type ContinueProps = {
  href: string
  label?: string
  isDisabled?: boolean
}

const ScreenView = ({
  children,
  title,
  continueProps,
  variant,
  backgroundVariant = 'white',
  cn,
}: Props) => {
  const t = useTranslation('Navigation')

  return (
    <View
      className={clsx(
        'flex-1',
        {
          'bg-white': backgroundVariant === 'white' || backgroundVariant === 'dots',
          // TODO add dots background
        },
        cn,
      )}
    >
      {backgroundVariant === 'dots' && (
        <Image
          source={dottedBackground}
          style={{ width: '100%', height: '100%', position: 'absolute' }}
        />
      )}
      <Stack.Screen options={{ title }} />
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
            <Button>{continueProps.label ?? t('continue')}</Button>
          </Link>
        </View>
      ) : null}
    </View>
  )
}

export default ScreenView
