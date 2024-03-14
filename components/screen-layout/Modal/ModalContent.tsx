import { View, ViewProps } from 'react-native'

import { cn } from '@/utils/cn'

const ModalContent = ({ className, ...rest }: ViewProps) => {
  return <View {...rest} className={cn('px-5 py-6 g-4', className)} />
}

export default ModalContent
