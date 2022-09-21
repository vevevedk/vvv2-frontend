import { FormControl, FormErrorMessage, FormLabel, Input, Stack } from "@chakra-ui/react"
import { useEffect, useState } from "react"

export enum InputFieldType {
  text,
  email,
  password,
}

interface Props {
  label?: string
  name?: string
  type?: InputFieldType
  value: string
  isRequired?: boolean
  placeholder?: string
  minLength?: number
  maxLength?: number
  pattern?: string
  displayErrorIfInvalid?: boolean
  errorText?: string
  list?: string[]
  debounce?: number
  onChangeHandler?: (value: string) => void
  onIsValidChangeHandler?: (isValid: boolean) => void
}

const CustomInputField = ({ onChangeHandler, onIsValidChangeHandler, ...props }: Props) => {
  const [value, setValue] = useState<string>(props.value)

  const isValid =
    value.length >= (props.minLength ?? 0) &&
    value.length <= (props.maxLength ?? 9999999) &&
    (!props.pattern || RegExp(props.pattern!).test(value))

  useEffect(() => setValue(props.value), [props.value])
  useEffect(() => onIsValidChangeHandler?.(isValid), [isValid, onIsValidChangeHandler])

  useEffect(() => {
    if (value === props.value) return
    const timeout = setTimeout(() => onChangeHandler?.(value), props.debounce ?? 0)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <>
      <FormControl isInvalid={props.displayErrorIfInvalid && !isValid} isRequired={props.isRequired}>
        {props.label && props.name && <FormLabel htmlFor={props.name}>{props.label}</FormLabel>}

        <Stack>
          {props.list && props.name && (
            <datalist id={props.name}>
              {props.list.map((value, index) => (
                <option key={index} value={value} />
              ))}
            </datalist>
          )}
          <Input
            id={props.name}
            type={InputFieldType[props.type ?? InputFieldType.text]}
            placeholder={props.placeholder}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            list={props.name}
          />
          {props.displayErrorIfInvalid && !isValid && (
            <FormErrorMessage>{props.errorText ?? "Field is invalid"}</FormErrorMessage>
          )}
        </Stack>
      </FormControl>
    </>
  )
}

export default CustomInputField
