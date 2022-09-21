import { createContext, ReactNode, useEffect, useState } from 'react'
import Router from 'next/router'
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import { api } from '../services/apiClient'

export type User = {
  id: string
  name: string
  email: string
  isAdmin: boolean
  avatar: string | null
  avatar_url: string | null
  created_at: string
}

type SignInCredentials = {
  email: string
  password: string
}

type AuthContextData = {
  signIn: (credentials: SignInCredentials) => Promise<void>
  signOut: () => void
  user: User
  isAuthenticated: boolean
}

type AuthProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextData)

let authChannel: BroadcastChannel

export function signOut() {
  destroyCookie(undefined, 'myapp.accessToken')
  destroyCookie(undefined, 'myapp.refreshToken')
  authChannel.postMessage('signOut')
  Router.push('/')
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>()
  const isAuthenticated = !!user

  useEffect(() => {
    authChannel = new BroadcastChannel('auth')
    authChannel.onmessage = message => {
      switch (message.data) {
        case 'signOut':
          signOut()
          break
        default:
          break
      }
    }
  }, [])

  useEffect(() => {
    const { 'myapp.accessToken': token } = parseCookies()
    if (token) {
      api
        .get('/users/profile')
        .then(response => {
          const { user } = response.data
          setUser(user)
        })
        .catch(() => {
          signOut()
        })
    }
  }, [])

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post('/users/login', {
        email,
        password,
      })
      const { accessToken, refreshToken, user } = response.data
      setCookie(undefined, 'myapp.accessToken', accessToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        path: '/',
      })
      setCookie(undefined, 'myapp.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        path: '/',
      })
      setUser(user)
      api.defaults.headers['Authorization'] = `Bearer ${accessToken}`
      Router.push('/dashboard')
    } catch (err) {
      signOut()
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  )
}
