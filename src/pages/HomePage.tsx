import { Container, Heading, Stack, Text } from "@chakra-ui/react"

const HomePage = () => {
  return (
    <Container maxW={"90ch"}>
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
