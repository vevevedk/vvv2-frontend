import { QuestionIcon } from '@chakra-ui/icons'
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Tooltip,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'

interface Props {
  label: string
  name: string
  value: string | null
  isRequired?: boolean
  displayErrorIfInvalid?: boolean
  tooltip?: string
  onChangeHandler: (value: string | null) => void
  onIsValidChangeHandler?: (isValid: boolean) => void
}

const CustomInputDate = ({onChangeHandler, onIsValidChangeHandler, ...props}: Props) => {
  const [date, setDate] = useState(props.value)

  const isValid = !props.isRequired || !!date

  useEffect(() => {
    onChangeHandler(date)
    onIsValidChangeHandler && onIsValidChangeHandler(isValid)
  }, [date, isValid, onChangeHandler, onIsValidChangeHandler])

  return (
    <>
      <FormControl
        isInvalid={props.displayErrorIfInvalid && !isValid}
        isRequired={props.isRequired}
      >
        <FormLabel htmlFor={props.name}>
          {props.label}{' '}
          {props.tooltip && (
            <Tooltip label={props.tooltip}>
              <QuestionIcon />
            </Tooltip>
          )}
        </FormLabel>

        <Input
          id={props.name}
          type={"datetime-local"}
          value={date ? date.replace("Z", "") : ""}
          onChange={(event) => setDate(event.target.value)}
        />
        
        {props.displayErrorIfInvalid && !isValid && (
          <FormErrorMessage>{'Feltet er ugyldigt'}</FormErrorMessage>
        )}
      </FormControl>
    </>
  )
}

export default CustomInputDate
