import React, { ReactNode } from 'react'
import { View } from 'react-native'

import Typography from '@/components/shared/Typography'

type Props = {
  label: string
  labelInsertArea?: ReactNode
  children: ReactNode
  errorMessage?: string
}
// TODO associate control with with label

const Field = ({ label, children, labelInsertArea, errorMessage }: Props) => {
  return (
    <View className="g-1">
      <View className="flex-row g-6">
        <Typography variant="default-bold" className="grow">
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
