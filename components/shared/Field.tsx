import { ReactNode } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'

import Typography, { TypographyProps } from '@/components/shared/Typography'
import { clsx } from '@/utils/clsx'

export type FieldProps = {
  label: string
  labelInsertArea?: ReactNode
  children: ReactNode
  errorMessage?: string
  variant?: TypographyProps['variant']
  className?: string
  style?: StyleProp<ViewStyle>
  nativeID?: string
}

const Field = ({
  label,
  children,
  labelInsertArea,
  nativeID,
  errorMessage,
  variant = 'default-bold',
  style,
  className,
}: FieldProps) => {
  return (
    <View className={clsx('g-1', className)} style={style}>
      <View className="flex-row g-6">
        <Typography variant={variant} className="grow" nativeID={nativeID}>
          {label}
        </Typography>
        {labelInsertArea || null}
      </View>
      {children}
      {errorMessage ? <Typography className="text-negative">{errorMessage}</Typography> : null}
    </View>
  )
}

export default Field
