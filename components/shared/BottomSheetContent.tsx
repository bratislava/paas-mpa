import { BottomSheetView } from '@gorhom/bottom-sheet'
import clsx from 'clsx'
import React, { ComponentProps } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Props = Omit<ComponentProps<typeof BottomSheetView>, 'className'> & {
  cn?: string
  hideSpacer?: boolean
}

const BottomSheetContent = ({ children, cn, hideSpacer }: Props) => {
  const insets = useSafeAreaInsets()

  return (
    <BottomSheetView className={clsx('px-5 py-3', cn)}>
      {children}
      {/* TODO this should be handled by SafeAreaProvider */}
      {/* spacer */}
      {!hideSpacer && <View style={{ height: insets.bottom }} aria-hidden />}
    </BottomSheetView>
  )
}

export default BottomSheetContent
