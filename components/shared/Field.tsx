import { ReactNode } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'

import Typography, { TypographyProps } from '@/components/shared/Typography'
import { cn } from '@/utils/cn'

export type FieldProps = {
  label: string
  labelInsertArea?: ReactNode
  children: ReactNode
  helptext?: string
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
  helptext,
  errorMessage,
  variant = 'default-bold',
  style,
  className,
}: FieldProps) => {
  return (
    <View className={cn('g-1', className)} style={style}>
      <View className="flex-row g-6">
        <Typography variant={variant} className="grow" nativeID={nativeID}>
          {label}
        </Typography>
        {labelInsertArea || null}
      </View>
      {helptext ? <Typography>{helptext}</Typography> : null}
      {children}
      {errorMessage ? <Typography className="text-negative">{errorMessage}</Typography> : null}
    </View>
  )
}

export default Field
