import { View, ViewProps } from 'react-native'

import { cn } from '@/utils/cn'

const FlexRow = ({ className, ...rest }: ViewProps) => {
  return <View className={cn('flex-row justify-between g-4', className)} {...rest} />
}

export default FlexRow
