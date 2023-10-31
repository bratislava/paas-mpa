import clsx from 'clsx'
import { useCallback } from 'react'
import { View } from 'react-native'
import { Shadow } from 'react-native-shadow-2'
import { ToastProps } from 'react-native-toast-notifications/lib/typescript/toast'

import FlexRow from '@/components/shared/FlexRow'
import Icon, { IconName } from '@/components/shared/Icon'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'

export type SnackbarTypes = 'danger' | 'warning' | 'success' | 'info'

const iconProps: Record<SnackbarTypes, { name: IconName }> = {
  danger: { name: 'error' },
  warning: { name: 'warning' },
  success: { name: 'check-circle' },
  info: { name: 'info' },
}

export type SnackbarProps = {
  variant: SnackbarTypes
  actionText?: string
  onActionPress?: () => void
} & Omit<ToastProps, 'type' | 'data'>

const Snackbar = ({
  message,
  onHide,
  variant = 'info',
  actionText,
  onActionPress,
}: SnackbarProps) => {
  const t = useTranslation('Common')

  const handlePress = useCallback(() => {
    onActionPress?.()
    onHide()
  }, [onActionPress, onHide])

  return (
    <View className="w-full px-5 py-2">
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <Shadow style={{ width: '100%' }} offset={[0, 2]}>
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <FlexRow className="w-full items-center bg-white px-4" style={{ borderRadius: 8 }}>
          <Icon
            {...iconProps[variant]}
            className={clsx(
              variant === 'danger' && 'text-negative',
              variant === 'warning' && 'text-warning',
              variant === 'success' && 'text-green',
              variant === 'info' && 'text-green',
            )}
          />
          <Typography numberOfLines={2} className="flex-1 py-2">
            {message}
          </Typography>
          <PressableStyled className="px-2 py-4" onPress={handlePress}>
            <Typography className="uppercase" variant="default-bold">
              {actionText ?? t('hide')}
            </Typography>
          </PressableStyled>
        </FlexRow>
      </Shadow>
    </View>
  )
}

export default Snackbar
