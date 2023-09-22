import { BottomSheetView } from '@gorhom/bottom-sheet'
import clsx from 'clsx'
import React, { ComponentProps } from 'react'
import { View } from 'react-native'

type Props = Omit<ComponentProps<typeof BottomSheetView>, 'className'> & {
  cn?: string
}

const BottomSheetContent = ({ children, cn }: Props) => {
  return (
    <BottomSheetView className={clsx('px-5 py-3', cn)}>
      {children}
      {/* spacer */}
      <View className="h-[29px]" aria-hidden />
    </BottomSheetView>
  )
}

export default BottomSheetContent
