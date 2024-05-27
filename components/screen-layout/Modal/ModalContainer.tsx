import { ModalProps, View, ViewProps } from 'react-native'

import IconButton from '@/components/shared/IconButton'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/utils/cn'

type ModalContainerProps = {
  onRequestClose: ModalProps['onRequestClose']
} & ViewProps

const ModalContainer = ({ className, onRequestClose, children, ...rest }: ModalContainerProps) => {
  const { t } = useTranslation()

  return (
    <View {...rest} className={cn('w-full overflow-hidden rounded bg-white', className)}>
      {children}

      {onRequestClose ? (
        // TODO add option to hide this button
        <IconButton
          name="close"
          accessibilityLabel={t('ModalContainer.closeDialog')}
          className="absolute right-4 top-4"
          onPress={onRequestClose}
        />
      ) : null}
    </View>
  )
}

export default ModalContainer
