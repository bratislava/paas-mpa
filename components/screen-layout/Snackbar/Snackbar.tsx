import { useCallback } from 'react'
import { View } from 'react-native'
import { Shadow } from 'react-native-shadow-2'
import { ToastProps } from 'react-native-toast-notifications/lib/typescript/toast'

import FlexRow from '@/components/shared/FlexRow'
import Icon, { IconName } from '@/components/shared/Icon'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/utils/cn'

export type SnackbarTypes = 'danger' | 'warning' | 'success' | 'info'

const iconProps: Record<SnackbarTypes, { name: IconName }> = {
  danger: { name: 'error' },
  warning: { name: 'warning' },
  success: { name: 'check-circle' },
  info: { name: 'info' },
}

export type SnackbarProps = {
  variant: SnackbarTypes
  actionLabel?: string
  onActionPress?: () => void
} & Omit<ToastProps, 'type' | 'data'>

const Snackbar = ({
  message,
  onHide,
  variant = 'info',
  actionLabel,
  onActionPress,
}: SnackbarProps) => {
  const { t } = useTranslation()

  const handlePress = useCallback(() => {
    onActionPress?.()
    onHide()
  }, [onActionPress, onHide])

  return (
    <View className="w-full px-5 py-2">
      <Shadow style={{ width: '100%' }} offset={[0, 2]}>
        <FlexRow className="w-full items-center rounded bg-white px-4">
          <Icon
            {...iconProps[variant]}
            className={cn({
              'text-negative': variant === 'danger',
              'text-warning': variant === 'warning',
              'text-green': variant === 'success' || variant === 'info',
            })}
          />
          <Typography numberOfLines={3} className="flex-1 py-2">
            {message}
          </Typography>
          <PressableStyled className="px-2 py-4" onPress={handlePress}>
            <Typography className="uppercase" variant="default-bold">
              {actionLabel ?? t('Common.hide')}
            </Typography>
          </PressableStyled>
        </FlexRow>
      </Shadow>
    </View>
  )
}

export default Snackbar
