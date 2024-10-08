import { ReactNode } from 'react'
import { View, ViewProps } from 'react-native'

import AvatarCircle from '@/components/info/AvatarCircle'
import ModalContent from '@/components/screen-layout/Modal/ModalContent'
import Button from '@/components/shared/Button'
import Typography from '@/components/shared/Typography'

type PrimaryActionProps =
  | {
      primaryActionOnPress: () => void
      primaryActionLabel: string
    }
  | {
      primaryActionOnPress?: never
      primaryActionLabel?: never
    }

type SecondaryActionProps =
  | {
      secondaryActionOnPress: () => void
      secondaryActionLabel: string
    }
  | {
      secondaryActionOnPress?: never
      secondaryActionLabel?: never
    }

type ModalContentWithActionsProps = {
  title: string
  text?: string
  variant?: 'success' | 'error'
  hideAvatar?: boolean
  customAvatarComponent?: ReactNode
  isLoading?: boolean
} & PrimaryActionProps &
  SecondaryActionProps &
  ViewProps

const ModalContentWithActions = ({
  title,
  text,
  className,
  children,
  variant,
  hideAvatar,
  customAvatarComponent,
  primaryActionOnPress,
  primaryActionLabel,
  secondaryActionOnPress,
  secondaryActionLabel,
  isLoading,
  ...rest
}: ModalContentWithActionsProps) => {
  return (
    <ModalContent {...rest} className="g-6">
      <View className="items-center">
        {hideAvatar ? null : (customAvatarComponent ?? <AvatarCircle variant={variant} />)}
      </View>
      <View className="g-2">
        <Typography variant="h1" className="text-center">
          {title}
        </Typography>
        {text ? <Typography className="text-center">{text}</Typography> : null}
      </View>
      {children}

      {primaryActionLabel || secondaryActionLabel ? (
        <View className="g-2">
          {primaryActionLabel ? (
            <Button
              testID={primaryActionLabel}
              variant={variant === 'error' ? 'negative' : 'primary'}
              onPress={primaryActionOnPress}
              loading={isLoading}
            >
              {primaryActionLabel}
            </Button>
          ) : null}
          {secondaryActionLabel ? (
            <Button variant="tertiary" onPress={secondaryActionOnPress}>
              {secondaryActionLabel}
            </Button>
          ) : null}
        </View>
      ) : null}
    </ModalContent>
  )
}

export default ModalContentWithActions
