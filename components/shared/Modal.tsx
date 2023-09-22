import { clsx } from 'clsx'
import React, { ReactNode } from 'react'
import { Modal as ModalRN, ModalProps, View, ViewProps } from 'react-native'

import AvatarCircle from '@/components/info/AvatarCircle'
import Button from '@/components/shared/Button'
import Icon from '@/components/shared/Icon'
import Typography from '@/components/shared/Typography'

export const ModalBackdrop = ({ className, ...rest }: ViewProps) => {
  return (
    <View
      {...rest}
      className={clsx('flex-1 items-center justify-center bg-dark/50 p-5', className)}
    />
  )
}

type ModalContainerProps = {
  onRequestClose: ModalProps['onRequestClose']
} & ViewProps

export const ModalContainer = ({
  className,
  onRequestClose,
  children,
  ...rest
}: ModalContainerProps) => {
  return (
    <View {...rest} className={clsx('w-full overflow-hidden rounded bg-white', className)}>
      {children}
      <Icon
        name="close"
        // TODO translation
        // TODO add option to hide this button
        aria-label="Close dialog"
        className="absolute right-4 top-4"
        onPress={onRequestClose}
      />
    </View>
  )
}

export const ModalContent = ({ className, ...rest }: ViewProps) => {
  return <View {...rest} className={clsx('px-5 py-6 g-4', className)} />
}

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

type ConfirmModalProps = {
  title: string
  text?: string
  variant?: 'success' | 'error'
  hideAvatar?: boolean
  customAvatarComponent?: ReactNode
} & PrimaryActionProps &
  SecondaryActionProps &
  ViewProps

export const ModalContentWithActions = ({
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
  ...rest
}: ConfirmModalProps) => {
  return (
    <ModalContent {...rest} className="g-6">
      {hideAvatar ? null : customAvatarComponent ?? <AvatarCircle variant={variant} />}
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
              variant={variant === 'error' ? 'negative' : 'primary'}
              onPress={primaryActionOnPress}
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

const Modal = ({ children, ...props }: ModalProps) => {
  return (
    <ModalRN transparent animationType="fade" {...props}>
      <ModalBackdrop>
        <ModalContainer onRequestClose={props.onRequestClose}>{children}</ModalContainer>
      </ModalBackdrop>
    </ModalRN>
  )
}

export default Modal
