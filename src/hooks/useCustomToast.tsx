import { useToast } from "@chakra-ui/react"

export const useCustomToast = () => {
  const toast = useToast()

  return (
    title: string,
    description?: string,
    status?: "success" | "error" | "warning" | "info",
    duration?: number,
    isCloseable?: boolean
  ) => {
    toast({
      title,
      description,
      status: status || "success",
      duration: duration || 9000,
      isClosable: isCloseable || true,
    })
  }
}
