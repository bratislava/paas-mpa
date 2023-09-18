import { clsx } from 'clsx'
import { Link } from 'expo-router'
import React, { ReactNode } from 'react'
import { View } from 'react-native'

import Button from '@/components/shared/Button'
import { ContinueProps } from '@/components/shared/Screen'
import { useTranslation } from '@/hooks/useTranslation'

type Props = {
  children: ReactNode
  continueProps?: ContinueProps
  variant?: 'default' | 'center'
  cn?: string
}

const ScreenContent = ({ children, continueProps, variant, cn }: Props) => {
  const t = useTranslation('Navigation')

  return (
    <View
      className={clsx(
        'bg-white p-5 g-5',
        {
          // TODO long Text is not centered horizontally
          'items-center text-center': variant === 'center',
        },
        cn,
      )}
    >
      {children}
      {continueProps ? (
        <Link
          asChild
          className="self-stretch"
          href={continueProps.href}
          disabled={continueProps.isDisabled}
        >
          <Button title={continueProps.label ?? t('continue')} />
        </Link>
      ) : null}
    </View>
  )
}

export default ScreenContent
