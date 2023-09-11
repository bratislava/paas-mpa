import { clsx } from 'clsx'
import React from 'react'
import { View } from 'react-native'

type Props = {
  dividerClassname?: string
}

const Divider = ({ dividerClassname }: Props) => {
  return <View aria-hidden className={clsx('h-0.5 bg-divider', dividerClassname)} />
}

export default Divider
