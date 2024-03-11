import axios from 'axios'

import { getAccessToken } from '@/modules/cognito/utils'

export const axiosInstance = axios.create()

// TODO redirect on logout

declare module 'axios' {
  interface AxiosRequestConfig {
    accessToken?: string | null
  }
}

axiosInstance.interceptors.request.use(async (request) => {
  const accessToken = await getAccessToken()

  if (accessToken) {
    request.headers.Authorization = `Bearer ${accessToken.toString()}`
  }

  console.log('fetching:', request.url)

  return request
})
