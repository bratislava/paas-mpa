import React from 'react'
import { View } from 'react-native'

import Typography from '@/components/shared/Typography'

type Props = {
  label: string
}

const SegmentBadge = ({ label }: Props) => {
  return (
    <View className="self-center rounded-sm bg-green-light px-2">
      <Typography className="text-green">{label}</Typography>
    </View>
  )
}

export default SegmentBadge
