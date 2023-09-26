import clsx from 'clsx'
import React, { forwardRef } from 'react'
import { Pressable, View } from 'react-native'

import Icon, { IconName } from '@/components/shared/Icon'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'

type PressableProps = Omit<React.ComponentProps<typeof Pressable>, 'children'>

type ButtonProps = {
  children: string
  variant?: 'primary' | 'secondary' | 'tertiary' | 'negative' | 'plain' | 'plain-dark'
  startIcon?: IconName
  endIcon?: IconName
  loading?: boolean
  loadingText?: string
  loadingTextEllipsis?: boolean
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

const Button = forwardRef<View, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      startIcon,
      endIcon,
      loading,
      loadingText,
      loadingTextEllipsis = true,
      disabled,
      ...restProps
    },
    ref,
  ) => {
    const t = useTranslation('Common')

    const rest = { ...restProps, disabled: disabled ?? loading }
    const { buttonContainerClassNames, buttonTextClassNames } = buttonClassNames(variant, rest)

    return (
      <Pressable ref={ref} hitSlop={4} {...rest} className={clsx(buttonContainerClassNames)}>
        {loading ? (
          <>
            <Icon name="hourglass-top" className={buttonTextClassNames} />
            <Typography variant="button" className={buttonTextClassNames}>
              {`${loadingText || t('loading')}${loadingTextEllipsis ? '…' : ''}`}
            </Typography>
          </>
        ) : (
          <>
            {startIcon ? <Icon name={startIcon} className={buttonTextClassNames} /> : null}
            <Typography variant="button" className={buttonTextClassNames}>
              {children}
            </Typography>
            {endIcon ? <Icon name={endIcon} className={buttonTextClassNames} /> : null}
          </>
        )}
      </Pressable>
    )
  },
)

export default Button
