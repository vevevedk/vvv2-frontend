import { Container, Heading, Stack, Text } from "@chakra-ui/react"
import { useRequireAuth } from "../hooks/useRequireAuth"

const HomePage = () => {
  useRequireAuth()

  return (
    <Container width={"800px"} maxW={"100%"}>
      <Stack spacing={10}>
        <Heading as="h1" size="xl">
          Veveve React App
        </Heading>
        <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam</Text>
      </Stack>
    </Container>
  )
}

export default HomePage
