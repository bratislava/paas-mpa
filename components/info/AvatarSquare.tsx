import { ApplePayIcon, GooglePayIcon, MasterCardIcon, VisaIcon } from 'assets/payment-options-icons'
import { ComponentProps } from 'react'
import { View } from 'react-native'

import Icon from '@/components/shared/Icon'
import { cn } from '@/utils/cn'

export type AvatarSquareProps = {
  variant: 'visitor-card' | 'payment-card' | 'apple-pay' | 'google-pay' | 'visa' | 'mastercard'
}

const StyledIcon = ({ name }: ComponentProps<typeof Icon>) => (
  <Icon name={name} className="text-white" size={20} />
)

const AvatarSquare = ({ variant }: AvatarSquareProps) => {
  const icon = {
    'google-pay': <GooglePayIcon />,
    'apple-pay': <ApplePayIcon />,
    visa: <VisaIcon />,
    mastercard: <MasterCardIcon />,
    'visitor-card': <StyledIcon name="people" />,
    'payment-card': <StyledIcon name="payment" />,
  }

  return (
    <View
      className={cn('flex h-10 w-10 items-center justify-center rounded p-2.5', {
        'bg-dark': variant === 'payment-card',
        'bg-visitorCard': variant === 'visitor-card',
        'bg-black': variant === 'apple-pay',
        'bg-white': variant === 'google-pay',
      })}
    >
      {icon[variant] || <StyledIcon name="payment" />}
    </View>
  )
}

export default AvatarSquare
