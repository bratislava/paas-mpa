import { forwardRef } from 'react'
import { Pressable, PressableProps, View } from 'react-native'

import Icon, { IconName } from '@/components/shared/Icon'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/utils/cn'

type PressablePropsOmitted = Omit<PressableProps, 'children'>

export type ButtonProps = {
  children: string
  variant?: 'primary' | 'secondary' | 'tertiary' | 'negative' | 'plain' | 'plain-dark'
  startIcon?: IconName
  endIcon?: IconName
  loading?: boolean
  loadingText?: string
  loadingTextEllipsis?: boolean
} & PressablePropsOmitted

export const buttonClassNames = (
  variant: ButtonProps['variant'],
  pressableProps: PressablePropsOmitted,
) => {
  const { disabled, className } = pressableProps

  const isPlainStyle = variant === 'plain' || variant === 'plain-dark'

  const buttonContainerClassNames = cn(
    'flex flex-row items-center justify-center g-3 active:opacity-70',
    className,
    {
      'rounded border p-2.5': !isPlainStyle,
      'border-green bg-green': variant === 'primary',
      'border-green': variant === 'secondary',
      'border-divider': variant === 'tertiary',
      'border-negative bg-negative': variant === 'negative',
      'opacity-50': disabled,
    },
  )

  const buttonTextClassNames = cn('', {
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
    const { t } = useTranslation()
    const rest = { ...restProps, disabled: loading || disabled }
    const { buttonContainerClassNames, buttonTextClassNames } = buttonClassNames(variant, rest)

    // Loading check needs to be separated, because when used within Pressable it can trigger onPress when the button is pressed quickly before loading ends or right after loading starts
    return loading ? (
      <View className={cn(buttonContainerClassNames)}>
        <Icon name="hourglass-top" className={buttonTextClassNames} />
        <Typography variant="button" className={buttonTextClassNames}>
          {`${loadingText || t('Common.loading')}${loadingTextEllipsis ? '…' : ''}`}
        </Typography>
      </View>
    ) : (
      <Pressable ref={ref} hitSlop={4} {...rest} className={cn(buttonContainerClassNames)}>
        {startIcon ? <Icon name={startIcon} className={buttonTextClassNames} /> : null}
        <Typography variant="button" className={buttonTextClassNames}>
          {children}
        </Typography>
        {endIcon ? <Icon name={endIcon} className={buttonTextClassNames} /> : null}
      </Pressable>
    )
  },
)

export default Button
