import { clsx } from 'clsx'
import React from 'react'
import { TouchableOpacity } from 'react-native'

import Typography from '@/components/shared/Typography'

type Props = {
  label: string
  isActive?: boolean
  chipClassName?: string
}

const Chip = ({ label, isActive, chipClassName }: Props) => {
  return (
    <TouchableOpacity
      className={clsx(
        'rounded border p-3',
        isActive ? 'border-dark bg-dark' : 'border-divider bg-transparent',
        chipClassName,
      )}
    >
      <Typography variant="small-semibold" className={clsx(isActive ? 'text-white' : 'text-dark')}>
        {label}
      </Typography>
    </TouchableOpacity>
  )
}

export default Chip
