import { ChakraProvider } from '@chakra-ui/react'
import { QueryClientProvider } from 'react-query'
import { AuthProvider } from '../contexts/AuthContext'
import { theme } from '../styles/theme'
import { SidebarDrawerProvider } from '../contexts/SidebarDrawerContext'
import { queryClient } from '../services/queryClient'

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <SidebarDrawerProvider>
            <Component {...pageProps} />
          </SidebarDrawerProvider>
        </AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
  )
}

export default MyApp
