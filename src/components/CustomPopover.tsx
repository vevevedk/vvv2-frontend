import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverCloseButton,
  PopoverBody,
  PopoverArrow,
  Box,
} from "@chakra-ui/react"

interface Props {
  trigger: React.ReactNode
  body: React.ReactNode
  header: string
}

export default function CustomPopover(props: Props) {
  return (
    <Popover>
      <PopoverTrigger>{props.trigger}</PopoverTrigger>
      <PopoverContent color="white" bg="blue.900" borderColor="blue.900" overflow={"auto"} maxHeight={400} width={400}>
        <PopoverArrow />
        <PopoverHeader fontWeight="bold" border="0">
          <Box borderBottom={"1px solid white"} paddingBottom={2}>
            {props.header}
          </Box>
        </PopoverHeader>
        <PopoverCloseButton />
        <PopoverBody>{props.body}</PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
