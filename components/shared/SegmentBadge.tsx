import React from 'react'
import { Text, View } from 'react-native'

type Props = {
  label: string
}

const SegmentBadge = ({ label }: Props) => {
  return (
    <View className="self-center rounded bg-green-light px-2">
      <Text className="text-[16px] text-green">{label}</Text>
    </View>
  )
}

export default SegmentBadge
