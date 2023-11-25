import { AxiosResponse, isAxiosError } from 'axios'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { useSnackbar } from '@/components/screen-layout/Snackbar/useSnackbar'
import { useTranslation as useLocalTranslation } from '@/hooks/useTranslation'
import { axiosInstance } from '@/modules/backend/axios-instance'

// https://dev.to/arianhamdi/react-hooks-in-axios-interceptors-3e1h

const successInterceptor = (response: AxiosResponse) => {
  return response
}

export const useAxiosResponseInterceptors = () => {
  const snackbar = useSnackbar()
  const t = useLocalTranslation('Errors')
  const { i18n } = useTranslation()

  const errorInterceptor = (error: unknown) => {
    let snackbarMessage = null
    if (isAxiosError(error)) {
      const { status, data } = error.response ?? {}
      const { errorName, message }: { errorName?: string; message?: string } = data

      // eslint-disable-next-line sonarjs/no-small-switch
      switch (status) {
        case 422:
          break
        case 424:
          if (errorName || message) {
            snackbarMessage =
              errorName && i18n.exists(`'Errors'.${errorName}`) ? t(errorName) : message
          }
          break

        default:
          if (status && i18n.exists(`'Errors'.${status?.toString()}`)) {
            snackbarMessage ??= t(status.toString())
          }

          snackbarMessage ??= t('axiosGeneric')
          break
      }
    } else snackbarMessage ??= t('generic')

    if (snackbarMessage) snackbar.show(snackbarMessage, { variant: 'danger' })

    return Promise.reject(error)
  }

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      successInterceptor,
      errorInterceptor,
    )

    return () => axiosInstance.interceptors.response.eject(interceptor)
  }, [])
}
