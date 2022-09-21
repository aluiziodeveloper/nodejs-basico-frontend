import axios, { AxiosError } from 'axios'
import { parseCookies, setCookie } from 'nookies'
import { signOut } from '../contexts/AuthContext'

let isRefreshing = false
let failedRequestsQueue = []

export function setupAPIClient(ctx = undefined) {
  let cookies = parseCookies(ctx)
  const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
      Authorization: `Bearer ${cookies['myapp.accessToken']}`,
    },
  })

  api.interceptors.response.use(
    response => {
      return response
    },
    (error: AxiosError) => {
      if (error.response.status === 401) {
        if (error.response.data?.code === 'token.expired') {
          cookies = parseCookies(ctx)
          const { 'myapp.refreshToken': refreshToken } = cookies
          const originalConfig = error.config
          if (!isRefreshing) {
            isRefreshing = true
            api
              .post('/users/refresh_token', {
                refresh_token: refreshToken,
              })
              .then(response => {
                const { accessToken, refreshToken } = response.data
                setCookie(ctx, 'myapp.accessToken', accessToken, {
                  maxAge: 60 * 60 * 24 * 30, // 30 dias
                  path: '/',
                })
                setCookie(ctx, 'myapp.refreshToken', refreshToken, {
                  maxAge: 60 * 60 * 24 * 30, // 30 dias
                  path: '/',
                })
                api.defaults.headers['Authorization'] = `Bearer ${accessToken}`
                failedRequestsQueue.forEach(request =>
                  request.onSuccess(accessToken),
                )
                failedRequestsQueue = []
              })
              .catch(err => {
                failedRequestsQueue.forEach(request => request.onFailure(err))
                failedRequestsQueue = []
                signOut()
              })
              .finally(() => {
                isRefreshing = false
              })
          }

          return new Promise((resolve, reject) => {
            failedRequestsQueue.push({
              onSuccess: (token: string) => {
                originalConfig.headers['Authorization'] = `Bearer ${token}`
                resolve(api(originalConfig))
              },
              onFailure: (err: AxiosError) => {
                reject(err)
              },
            })
          })
        } else {
          signOut()
        }
      }

      return Promise.reject(error)
    },
  )

  return api
}
