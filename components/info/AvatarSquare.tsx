import { ApplePayIcon, GooglePayIcon } from 'assets/payment-options-icons'
import { clsx } from 'clsx'
import { View } from 'react-native'

import Icon, { IconName } from '@/components/shared/Icon'

type Props = {
  variant: 'visitor-card' | 'payment-card' | 'apple-pay' | 'google-pay'
}

const AvatarSquare = ({ variant }: Props) => {
  /* Apple Pay & Google Pay variants are handled manually */
  const iconName: IconName | 'apple-pay' | 'google-pay' =
    (
      {
        'visitor-card': 'people',
        'payment-card': 'payment',
        'apple-pay': 'apple-pay',
        'google-pay': 'google-pay',
      } as const
    )[variant] ?? 'info'

  return (
    <View
      className={clsx('flex h-10 w-10 items-center justify-center rounded p-2.5', {
        'bg-dark': variant === 'payment-card',
        'bg-visitorCard': variant === 'visitor-card',
        'bg-black': variant === 'apple-pay',
        'bg-white': variant === 'google-pay',
      })}
    >
      {iconName === 'apple-pay' ? (
        <ApplePayIcon />
      ) : iconName === 'google-pay' ? (
        <GooglePayIcon />
      ) : (
        <Icon name={iconName} className="text-white" size={20} />
      )}
    </View>
  )
}

export default AvatarSquare
