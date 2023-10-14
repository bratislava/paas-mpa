import axios from 'axios'

import { getAccessTokenOrLogout } from '@/modules/cognito/utils'

export const axiosInstance = axios.create()

// TODO redirect on logout

declare module 'axios' {
  interface AxiosRequestConfig {
    accessToken?: string | null
  }
}

axiosInstance.interceptors.request.use(async (request) => {
  const accessToken = await getAccessTokenOrLogout()

  if (accessToken) {
    request.headers.Authorization = `Bearer ${accessToken}`
  }

  return request
})

axiosInstance.interceptors.response.use(
  (response) => response,
  // (error) => {
  //   if (error.response.status === 401) {
  //     // handle 401 error here
  //     window.location.assign('/auth/signin')
  //   }
  //
  //   return Promise.reject(error)
  // },
)
