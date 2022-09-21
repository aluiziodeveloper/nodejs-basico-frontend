import { useContext, useEffect } from 'react'
import { Box, Flex, SimpleGrid, Text } from '@chakra-ui/react'
import { Header } from '../components/Header'
import { Sidebar } from '../components/Sidebar'
import { AuthContext, signOut } from '../contexts/AuthContext'
import { api } from '../services/apiClient'

export default function Dashboard() {
  const { user } = useContext(AuthContext)

  useEffect(() => {
    api
      .get('/users/profile')
      .then(response => console.log(response))
      .catch(() => {
        signOut()
      })
  }, [])

  return (
    <Flex direction="column" h="100vh">
      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />
        <SimpleGrid flex="1" gap="4" minChildWidth="320px">
          <Box p={['6', '8']} bg="gray.800" borderRadius={8} pb="4" h="300">
            <Text fontSize="lg" mb="4">
              Bem-vindo(a) {user?.name}!
            </Text>
          </Box>
          <Box p={['6', '8']} bg="gray.800" borderRadius={8} pb="4" h="300">
            <Text fontSize="lg" mb="4">
              Indicadores
            </Text>
          </Box>
          <Box p={['6', '8']} bg="gray.800" borderRadius={8} pb="4" h="300">
            <Text fontSize="lg" mb="4">
              Notícias
            </Text>
          </Box>
          <Box p={['6', '8']} bg="gray.800" borderRadius={8} pb="4" h="300">
            <Text fontSize="lg" mb="4">
              Métricas
            </Text>
          </Box>
          <Box p={['6', '8']} bg="gray.800" borderRadius={8} pb="4" h="300">
            <Text fontSize="lg" mb="4">
              Avisos
            </Text>
          </Box>
          <Box p={['6', '8']} bg="gray.800" borderRadius={8} pb="4" h="300">
            <Text fontSize="lg" mb="4">
              Cronograma
            </Text>
          </Box>
        </SimpleGrid>
      </Flex>
    </Flex>
  )
}
