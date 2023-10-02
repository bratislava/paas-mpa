import { clsx } from 'clsx'
import { Link } from 'expo-router'
import React, { ReactNode } from 'react'
import { View } from 'react-native'

import Button from '@/components/shared/Button'
import { ContinueProps } from '@/components/shared/ScreenView'
import { useTranslation } from '@/hooks/useTranslation'
import { ViewStyleProps } from '@/utils/types'

type Props = {
  children: ReactNode
  continueProps?: ContinueProps
  variant?: 'default' | 'center'
  cn?: string
} & ViewStyleProps

const ScreenContent = ({ children, continueProps, variant, cn, ...rest }: Props) => {
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
      {...rest}
    >
      {children}
      {continueProps ? (
        <Link
          asChild
          className="self-stretch"
          href={continueProps.href}
          disabled={continueProps.isDisabled}
        >
          <Button>{continueProps.label ?? t('continue')}</Button>
        </Link>
      ) : null}
    </View>
  )
}

export default ScreenContent
