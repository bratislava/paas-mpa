import clsx from 'clsx'
import { ReactNode } from 'react'
import { View } from 'react-native'

import Typography, { TypographyProps } from '@/components/shared/Typography'

type Props = {
  label: string
  labelInsertArea?: ReactNode
  children: ReactNode
  errorMessage?: string
  variant?: TypographyProps['variant']
}
// TODO associate control with label

const Field = ({
  label,
  children,
  labelInsertArea,
  errorMessage,
  variant = 'default-bold',
}: Props) => {
  return (
    <View className={clsx('g-1', children === null && 'pb-1')}>
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
