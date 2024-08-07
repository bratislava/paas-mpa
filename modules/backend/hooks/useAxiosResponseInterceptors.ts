import { AxiosResponse, isAxiosError } from 'axios'
import { Dispatch, useEffect } from 'react'
import { useTranslation as useTranslationI18n } from 'react-i18next'

import { useSnackbar } from '@/components/screen-layout/Snackbar/useSnackbar'
import { useTranslation } from '@/hooks/useTranslation'
import { axiosInstance } from '@/modules/backend/axios-instance'

const NETWORK_ERROR_CODES = new Set(['ERR_BAD_RESPONSE', 'ERR_NETWORK'])

// https://dev.to/arianhamdi/react-hooks-in-axios-interceptors-3e1h

export const useAxiosResponseInterceptors = (setServerConnectionError: Dispatch<boolean>) => {
  const snackbar = useSnackbar()
  const { t } = useTranslation()
  const { i18n } = useTranslationI18n()

  useEffect(() => {
    const errorInterceptor = (error: unknown) => {
      let snackbarMessage = null

      if (isAxiosError(error) && NETWORK_ERROR_CODES.has(error.code || '')) {
        setServerConnectionError(true)
      } else if (isAxiosError(error)) {
        const { status, data } = error.response ?? {}
        const { errorName, message }: { errorName?: string; message?: string } = data

        // eslint-disable-next-line sonarjs/no-small-switch
        switch (status) {
          case 422:
            // the 422 errors are handled locally
            break
          case 424:
            if (errorName || message) {
              // TODO translation
              snackbarMessage =
                errorName && i18n.exists(`Errors.${errorName}`) ? t(errorName) : message
            }
            break

          default:
            // TODO translation
            if (status && i18n.exists(`Errors.${status?.toString()}`)) {
              snackbarMessage ??= t(status.toString())
            }

            snackbarMessage ??= t('Errors.axiosGeneric')
            break
        }
      } else {
        snackbarMessage ??= t('Errors.generic')
      }

      if (snackbarMessage) {
        snackbar.show(snackbarMessage, { variant: 'danger' })
      }

      return Promise.reject(error)
    }

    const successInterceptor = (response: AxiosResponse) => {
      return response
    }

    const interceptor = axiosInstance.interceptors.response.use(
      successInterceptor,
      errorInterceptor,
    )

    return () => axiosInstance.interceptors.response.eject(interceptor)
  }, [i18n, snackbar, t, setServerConnectionError])
}
