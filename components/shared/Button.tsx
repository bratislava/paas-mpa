import { Button as RneButton, ButtonProps } from '@rneui/themed'
import React from 'react'

type CustomButtonProps = Omit<ButtonProps, 'radius' | 'raised' | 'size' | 'color' | 'type'> & {
  variant?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'negative'
    | 'floating'
    | 'plain-primary'
    | 'plain-secondary'
}

// TODO forwardRef
const Button = ({ variant = 'primary', ...props }: CustomButtonProps) => {
  const transformedProps: Partial<ButtonProps> = {
    primary: { color: 'primary', type: 'solid' } as const,
    secondary: { type: 'outline' } as const,
    tertiary: { type: 'outline' } as const,
    negative: { color: 'error', type: 'solid' } as const,
    floating: { type: 'solid', color: 'secondary', raised: true, radius: 100 } as const,
    'plain-primary': { type: 'clear' } as const,
    'plain-secondary': { color: 'secondary', type: 'clear' } as const,
  }[variant]

  return <RneButton {...props} {...transformedProps} />
}

export default Button
