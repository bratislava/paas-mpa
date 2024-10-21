import React from 'react'
import { View } from 'react-native'

import Typography from '@/components/shared/Typography'

type Props = {
  label: string
}

const ZoneBadge = ({ label }: Props) => {
  return (
    <View testID={label} className="rounded-sm bg-green-light px-2">
      <Typography variant="default-bold" className="text-green">
        {label}
      </Typography>
    </View>
  )
}

export default ZoneBadge
