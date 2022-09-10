import { Button } from "@chakra-ui/react"

interface Props {
  title: string
  submitting: boolean
  loadingText?: string
  disabled: boolean
  colorScheme?: "green" | "blue"
  onClickHandler?: () => void
}

function CustomSubmitButton(props: Props) {
  return (
    <Button
      isLoading={props.submitting}
      loadingText={props.loadingText || "Sending.."}
      colorScheme={props.colorScheme || "green"}
      variant="solid"
      isDisabled={props.disabled}
      type="submit"
      onClick={props.onClickHandler}
    >
      {props.title}
    </Button>
  )
}

export default CustomSubmitButton
