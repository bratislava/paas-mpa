import clsx from 'clsx'
import React from 'react'
import { Pressable } from 'react-native'

import Icon, { IconName } from '@/components/shared/Icon'
import Typography from '@/components/shared/Typography'

type PressableProps = Omit<React.ComponentProps<typeof Pressable>, 'children'>

type ButtonProps = {
  children: string
  variant?: 'primary' | 'secondary' | 'tertiary' | 'negative' | 'plain' | 'plain-dark'
  startIcon?: IconName
  endIcon?: IconName
  isLoading?: boolean
  loadingText?: string
} & PressableProps

export const buttonClassNames = (
  variant: ButtonProps['variant'],
  pressableProps: PressableProps,
) => {
  const { disabled } = pressableProps

  const isPlainStyle = variant === 'plain' || variant === 'plain-dark'

  const buttonContainerClassNames = clsx(
    'flex flex-row items-center justify-center g-3 active:opacity-70',
    {
      'rounded border p-2.5': !isPlainStyle,
      'border-green bg-green': variant === 'primary',
      'border-green': variant === 'secondary',
      'border-divider': variant === 'tertiary',
      'border-negative bg-negative': variant === 'negative',
      'opacity-50': disabled,
    },
  )

  const buttonTextClassNames = clsx('', {
    'text-white': variant === 'primary' || variant === 'negative',
    'text-dark': variant === 'secondary' || variant === 'tertiary' || variant === 'plain-dark',
    'text-green': variant === 'plain',
  })

  return {
    buttonContainerClassNames,
    buttonTextClassNames,
  }
}

// TODO forwardRef
const Button = ({
  children,
  variant = 'primary',
  startIcon,
  endIcon,
  isLoading,
  loadingText,
  disabled,
  ...restProps
}: ButtonProps) => {
  const rest = { ...restProps, disabled: disabled || isLoading }

  const { buttonContainerClassNames, buttonTextClassNames } = buttonClassNames(variant, rest)

  return isLoading ? (
    <Pressable {...rest} disabled className={clsx(buttonContainerClassNames)}>
      <Icon name="hourglass-top" className={buttonTextClassNames} />
      <Typography variant="button" className={buttonTextClassNames}>
        Loading
      </Typography>
    </Pressable>
  ) : (
    <Pressable {...rest} className={clsx(buttonContainerClassNames)}>
      {startIcon ? <Icon name={startIcon} className={buttonTextClassNames} /> : null}
      <Typography variant="button" className={buttonTextClassNames}>
        {children}
      </Typography>
      {endIcon ? <Icon name={endIcon} className={buttonTextClassNames} /> : null}
    </Pressable>
  )
}

export default Button
