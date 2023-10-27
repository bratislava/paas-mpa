import { clsx } from 'clsx'
import React from 'react'
import { View } from 'react-native'

import Typography from '@/components/shared/Typography'

type Props = {
  label: string
  isActive?: boolean
  chipClassName?: string
}

const Chip = ({ label, isActive, chipClassName }: Props) => {
  return (
    <View
      className={clsx(
        'h-[48px] flex-1 items-center justify-center rounded border',
        isActive ? 'border-dark bg-dark' : 'border-divider bg-white',
        chipClassName,
      )}
    >
      <Typography variant="small-bold" className={clsx(isActive ? 'text-white' : 'text-dark')}>
        {label}
      </Typography>
    </View>
  )
}

export default Chip
