import { BottomSheetView } from '@gorhom/bottom-sheet'
import { ComponentProps } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { cn } from '@/utils/cn'

type Props = ComponentProps<typeof BottomSheetView> & {
  hideSpacer?: boolean
  isDynamic?: boolean
}

const BottomSheetContent = ({ children, className, hideSpacer, isDynamic }: Props) => {
  const insets = useSafeAreaInsets()

  return (
    <BottomSheetView className={cn('px-5 py-3', { 'min-h-[80px]': !isDynamic }, className)}>
      {children}
      {/* TODO this should be handled by SafeAreaProvider */}
      {/* spacer */}
      {!hideSpacer && <View style={{ height: insets.bottom }} aria-hidden />}
    </BottomSheetView>
  )
}

export default BottomSheetContent
