import axios from 'axios'

export const axiosInstance = axios.create()

// TODO token

// declare module 'axios' {
//   interface AxiosRequestConfig {
//     accessToken?: string | null
//   }
// }

axiosInstance.interceptors.request.use(async (request) => {
  // const session = await getSession()
  //
  // if (session) {
  //   request.headers.Authorization = `Bearer ${session.accessToken}`
  // }

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
