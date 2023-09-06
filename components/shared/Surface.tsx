import React, { PropsWithChildren } from 'react'
import { TouchableOpacity, View } from 'react-native'

type Props = {
  touchable?: boolean
  surfaceClassName?: string
}

const Surface = ({ touchable = false, surfaceClassName, children }: PropsWithChildren<Props>) => {
  // eslint-disable-next-line const-case/uppercase
  const className = `rounded bg-soft p-4 ${surfaceClassName ?? ''}`

  return touchable ? (
    <TouchableOpacity className={className}>{children}</TouchableOpacity>
  ) : (
    <View className={className}>{children}</View>
  )
}

export default Surface
