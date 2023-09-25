import React, { ReactNode } from 'react'
import { View } from 'react-native'

type Props = {
  children: ReactNode
}

const ParkingCardContent = ({ children }: Props) => {
  return <View className="g-3">{children}</View>
}

export default ParkingCardContent
