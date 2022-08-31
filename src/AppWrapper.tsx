import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'

interface Props {
  children: React.ReactNode
}
const AppWrapper = (props: Props) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1
      },
      mutations: {
        retry: 0,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <BrowserRouter>{props.children}</BrowserRouter>
      </ChakraProvider>
    </QueryClientProvider>
  )
}
export default AppWrapper
