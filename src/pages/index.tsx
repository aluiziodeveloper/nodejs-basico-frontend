import { useContext } from 'react'
import { Flex, Button, Stack, Text } from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Input } from '../components/Form/Input'
import { AuthContext } from '../contexts/AuthContext'

type SignInFormData = {
  email: string
  password: string
}

const signInFormSchema = yup.object().shape({
  email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
  password: yup.string().required('Senha obrigatória'),
})

export default function SignIn() {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(signInFormSchema),
  })
  const { errors } = formState
  const { signIn } = useContext(AuthContext)

  const handleSignIn: SubmitHandler<SignInFormData> = async values => {
    const data = {
      email: values.email,
      password: values.password,
    }
    await signIn(data)
  }

  return (
    <Flex w="100vw" h="100vh" align="center" justify="center">
      <Flex
        as="form"
        width="100%"
        maxWidth={360}
        bg="gray.800"
        p="8"
        borderRadius={8}
        flexDir="column"
        onSubmit={handleSubmit(handleSignIn)}
      >
        <Text
          fontSize={['2xl', '3xl']}
          p="8"
          fontWeight="bold"
          letterSpacing="tight"
          align="center"
        >
          Sign-In
        </Text>
        <Stack spacing="4">
          <Input
            name="email"
            type="email"
            label="E-mail"
            error={errors.email}
            {...register('email')}
          />
          <Input
            name="password"
            type="password"
            label="Senha"
            error={errors.password}
            {...register('password')}
          />
        </Stack>

        <Button
          type="submit"
          mt="6"
          colorScheme="blue"
          size="lg"
          isLoading={formState.isSubmitting}
        >
          Entrar
        </Button>
      </Flex>
    </Flex>
  )
}
