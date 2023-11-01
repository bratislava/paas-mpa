import { AxiosResponse, isAxiosError } from 'axios'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { useSnackbar } from '@/components/screen-layout/Snackbar/useSnackbar'
import { useTranslation as useLocalTranslation } from '@/hooks/useTranslation'
import { axiosInstance } from '@/modules/backend/axios-instance'

// https://dev.to/arianhamdi/react-hooks-in-axios-interceptors-3e1h

export const useAxiosResponseInterceptors = () => {
  const snackbar = useSnackbar()
  const t = useLocalTranslation('Errors')
  const { i18n } = useTranslation()
  useEffect(() => {
    const successInterceptor = (response: AxiosResponse) => {
      return response
    }

    const errorInterceptor = (error: unknown) => {
      let snackbarMessage = null
      if (isAxiosError(error)) {
        const { status, data } = error.response ?? {}
        if (status) {
          // eslint-disable-next-line sonarjs/no-small-switch
          switch (status) {
            // eslint-disable-next-line switch-case/no-case-curly
            case 422: {
              const { errorName, message }: { errorName?: string; message?: string } = data
              if (errorName || message) {
                snackbarMessage =
                  errorName && i18n.exists(`'Errors'.${errorName}`) ? t(errorName) : message
              }
              break
            }
            default:
              break
          }
          if (i18n.exists(`'Errors'.${status.toString()}`)) {
            snackbarMessage ??= t(status.toString())
          }
        }
        snackbarMessage ??= t('axiosGeneric')
      }

      snackbarMessage ??= t('generic')
      snackbar.show(snackbarMessage, { variant: 'danger' })

      return Promise.reject(error)
    }

    const interceptor = axiosInstance.interceptors.response.use(
      successInterceptor,
      errorInterceptor,
    )

    return () => axiosInstance.interceptors.response.eject(interceptor)
  }, [t, snackbar, i18n])
}
