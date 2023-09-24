import { BottomSheetView } from '@gorhom/bottom-sheet'
import clsx from 'clsx'
import React, { ComponentProps } from 'react'
import { View } from 'react-native'

type Props = Omit<ComponentProps<typeof BottomSheetView>, 'className'> & {
  cn?: string
  hideSpacer?: boolean
}

const BottomSheetContent = ({ children, cn, hideSpacer }: Props) => {
  return (
    <BottomSheetView className={clsx('px-5 py-3', cn)}>
      {children}
      {/* TODO this should be handled by SafeAreaProvider */}
      {/* spacer */}
      {!hideSpacer && <View className="h-[29px]" aria-hidden />}
    </BottomSheetView>
  )
}

export default BottomSheetContent
