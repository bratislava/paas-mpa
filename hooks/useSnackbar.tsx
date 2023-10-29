import { useCallback, useMemo } from 'react'
import { useToast } from 'react-native-toast-notifications'
import { ToastOptions, ToastProps } from 'react-native-toast-notifications/lib/typescript/toast'

import Snackbar, { SnackbarTypes } from '@/components/actions/Snackbar'

export const useToastProviderProps = (): Partial<ToastProps> =>
  useMemo(
    () => ({
      renderToast: (toast) => (
        <Snackbar {...toast} {...toast.data} variant={toast.type as SnackbarTypes} />
      ),
    }),
    [],
  )

type SnackbarOptions = {
  variant?: SnackbarTypes
  actionText?: string
  onActionPress?: () => void
} & Pick<
  ToastOptions,
  'id' | 'duration' | 'placement' | 'animationDuration' | 'animationType' | 'onClose'
>

export const useSnackbar = () => {
  const toast = useToast()
  const show = useCallback(
    (message: string, options?: SnackbarOptions) => {
      const toastOptions: ToastOptions = { ...options }
      if (options) {
        toastOptions.type = options.variant
        toastOptions.data = {
          actionText: options.actionText,
          onActionPress: options.onActionPress,
        }
      }
      toast.show(message, toastOptions)
    },
    [toast],
  )

  return { show }
}
