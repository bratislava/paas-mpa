import clsx from 'clsx'
import { View, ViewProps } from 'react-native'

const ModalContent = ({ className, ...rest }: ViewProps) => {
  return <View {...rest} className={clsx('px-5 py-6 g-4', className)} />
}

export default ModalContent
