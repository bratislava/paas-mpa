import { View } from 'react-native'

import { cn } from '@/utils/cn'

type Props = {
  dividerClassname?: string
}

const Divider = ({ dividerClassname }: Props) => {
  return <View aria-hidden className={cn('h-0.5 bg-divider', dividerClassname)} />
}

export default Divider
