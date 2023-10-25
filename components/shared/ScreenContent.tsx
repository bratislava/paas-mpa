import { clsx } from 'clsx'
import { Link } from 'expo-router'
import React, { ReactNode } from 'react'
import { View } from 'react-native'

import ContinueButton from '@/components/navigation/ContinueButton'
import { ContinueProps } from '@/components/shared/ScreenView'
import { ViewStyleProps } from '@/utils/types'

type Props = {
  children: ReactNode
  continueProps?: ContinueProps
  variant?: 'default' | 'center'
  cn?: string
} & ViewStyleProps

const ScreenContent = ({ children, continueProps, variant, cn, ...rest }: Props) => {
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
        <Link asChild href={continueProps.href} disabled={continueProps.isDisabled}>
          <ContinueButton>{continueProps.label}</ContinueButton>
        </Link>
      ) : null}
    </View>
  )
}

export default ScreenContent
