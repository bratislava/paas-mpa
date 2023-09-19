import { clsx } from 'clsx'
import { Link, Stack } from 'expo-router'
import React, { ReactNode } from 'react'
import { View } from 'react-native'

import Button from '@/components/shared/Button'
import { useTranslation } from '@/hooks/useTranslation'

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

const Screen = ({
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
        'flex-1 bg-white',
        {
          'bg-white': backgroundVariant === 'white',
          // TODO add dots background
          'bg-divider': backgroundVariant === 'dots',
        },
        cn,
      )}
    >
      <Stack.Screen options={{ title }} />
      <View
        className={clsx({
          'grow justify-center': variant === 'centered',
        })}
      >
        {children}
      </View>
      {continueProps ? (
        <View className="p-5 pb-[50px]">
          <Link asChild href={continueProps.href} disabled={continueProps.isDisabled}>
            <Button title={continueProps.label ?? t('continue')} />
          </Link>
        </View>
      ) : null}
    </View>
  )
}

export default Screen
