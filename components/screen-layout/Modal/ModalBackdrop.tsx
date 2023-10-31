import clsx from 'clsx'
import { View, ViewProps } from 'react-native'

const ModalBackdrop = ({ className, ...rest }: ViewProps) => {
  return (
    <View
      {...rest}
      className={clsx('flex-1 items-center justify-center bg-dark/50 p-5', className)}
    />
  )
}

export default ModalBackdrop
