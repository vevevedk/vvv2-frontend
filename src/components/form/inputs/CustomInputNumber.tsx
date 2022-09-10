import { FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react"
import { useEffect } from "react"

interface Props {
  label: string
  name: string
  value?: number
  isRequired?: boolean
  placeholder?: string
  displayErrorIfInvalid?: boolean
  errorText?: string
  onChangeHandler: (value?: number) => void
  onIsValidChangeHandler?: (isValid: boolean) => void
}

const CustomInputNumber = ({ onChangeHandler, onIsValidChangeHandler, ...props }: Props) => {
  const isValid = props.value !== undefined || !props.isRequired
  useEffect(() => onIsValidChangeHandler && onIsValidChangeHandler(isValid), [isValid, onIsValidChangeHandler])

  return (
    <>
      <FormControl isInvalid={props.displayErrorIfInvalid && !isValid} isRequired={props.isRequired}>
        <FormLabel htmlFor={props.name}>{props.label}</FormLabel>
        <Input
          id={props.name}
          type={"number"}
          placeholder={props.placeholder}
          value={props.value ?? ""}
          onChange={(event) => onChangeHandler(event.target.valueAsNumber)}
        />
        {props.displayErrorIfInvalid && !isValid && <FormErrorMessage>{props.errorText ?? "Field is invalid"}</FormErrorMessage>}
      </FormControl>
    </>
  )
}

export default CustomInputNumber
