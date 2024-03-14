import { forwardRef } from 'react'
import { Pressable, PressableProps, View } from 'react-native'

import Icon, { IconName } from '@/components/shared/Icon'
import { cn } from '@/utils/cn'

type Props = {
  name: IconName
  accessibilityLabel: string
  variant?: 'unstyled' | 'white-raised' | 'white-raised-small' | 'dark' | 'dark-small'
} & Omit<PressableProps, 'children' | 'accessibilityLabel'>

const IconButton = forwardRef<View, Props>(
  ({ name, accessibilityLabel, variant = 'unstyled', hitSlop, className, ...rest }, ref) => {
    return (
      <Pressable
        ref={ref}
        {...rest}
        hitSlop={hitSlop ?? 12}
        accessibilityLabel={accessibilityLabel}
        className={cn(
          'self-start rounded-full',
          {
            'p-3': variant === 'dark' || variant === 'white-raised',
            'p-2.5': variant.includes('small'),
            'bg-white shadow': variant.startsWith('white'),
            'bg-dark active:bg-dark/50': variant.startsWith('dark'),
            'bg-dark/50': rest.disabled && variant.startsWith('dark'),
          },
          className,
        )}
      >
        {({ pressed }) => (
          <Icon
            name={name}
            className={cn({
              'text-white': variant.startsWith('dark'),
              'text-dark': variant.startsWith('white'),
              'text-dark/50': (rest.disabled || pressed) && variant.startsWith('white'),
            })}
          />
        )}
      </Pressable>
    )
  },
)

export default IconButton
