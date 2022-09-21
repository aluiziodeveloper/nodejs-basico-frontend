import { Avatar, Box, Flex, Text } from '@chakra-ui/react'
import { useContext, useEffect, useState } from 'react'
import { AuthContext, User } from '../../contexts/AuthContext'
import { api } from '../../services/apiClient'

interface ProfileProps {
  showProfileData?: boolean
}

export function Profile({ showProfileData = true }: ProfileProps) {
  const [user, setUser] = useState<User>()
  const { signOut } = useContext(AuthContext)

  useEffect(() => {
    api
      .get('/users/profile')
      .then(response => {
        setUser(response.data)
      })
      .catch(() => {
        signOut()
      })
  }, [])

  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>{user?.name}</Text>
          <Text color="gray.300" fontSize="small">
            {user?.email}
          </Text>
        </Box>
      )}
      <Avatar
        size="md"
        name={user?.name}
        src={user?.avatar_url}
        onClick={signOut}
      />
    </Flex>
  )
}
