import { View } from 'react-native'

import { cn } from '@/utils/cn'

type Props = {
  className?: string
}

const Divider = ({ className }: Props) => {
  return <View aria-hidden className={cn('h-0.5 bg-divider', className)} />
}

export default Divider
