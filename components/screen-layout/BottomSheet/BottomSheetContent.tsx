import { BottomSheetView } from '@gorhom/bottom-sheet'
import React, { ComponentProps } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { clsx } from '@/utils/clsx'

type Props = Omit<ComponentProps<typeof BottomSheetView>, 'className'> & {
  cn?: string
  hideSpacer?: boolean
}

const BottomSheetContent = ({ children, cn, hideSpacer }: Props) => {
  const insets = useSafeAreaInsets()

  return (
    // TODO added "min-h-[80] flex-[0]" as quickfix for zero height bottom sheet: https://github.com/gorhom/react-native-bottom-sheet/issues/1573
    // 80 is height of one action row
    <BottomSheetView className={clsx('min-h-[80px] flex-[0] px-5 py-3', cn)}>
      {children}
      {/* TODO this should be handled by SafeAreaProvider */}
      {/* spacer */}
      {!hideSpacer && <View style={{ height: insets.bottom }} aria-hidden />}
    </BottomSheetView>
  )
}

export default BottomSheetContent
