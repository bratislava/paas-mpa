import React from 'react'
import { View } from 'react-native'

import Typography from '@/components/shared/Typography'
import { cn } from '@/utils/cn'

type Props = {
  label: string
  isActive?: boolean
  chipClassName?: string
}

const Chip = ({ label, isActive, chipClassName }: Props) => {
  return (
    <View
      className={cn(
        'h-[48px] flex-1 items-center justify-center rounded border',
        isActive ? 'border-dark bg-dark' : 'border-divider bg-white',
        chipClassName,
      )}
    >
      <Typography variant="small-bold" className={cn(isActive ? 'text-white' : 'text-dark')}>
        {label}
      </Typography>
    </View>
  )
}

export default Chip
