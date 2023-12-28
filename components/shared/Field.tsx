import { ReactNode } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'

import Typography, { TypographyProps } from '@/components/shared/Typography'

type Props = {
  label: string
  labelInsertArea?: ReactNode
  children: ReactNode
  errorMessage?: string
  variant?: TypographyProps['variant']
  style?: StyleProp<ViewStyle>
}
// TODO associate control with label

const Field = ({
  label,
  children,
  labelInsertArea,
  errorMessage,
  variant = 'default-bold',
  style,
}: Props) => {
  return (
    // A passed className magically does not work!
    <View className="g-1" style={style}>
      <View className="flex-row g-6">
        <Typography variant={variant} className="grow">
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
