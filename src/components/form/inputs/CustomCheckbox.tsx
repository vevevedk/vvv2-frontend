import { QuestionIcon } from '@chakra-ui/icons'
import { Checkbox, FormControl, FormLabel, Tooltip } from '@chakra-ui/react'
import { useState } from 'react'

interface Props {
  label: string
  name: string
  isChecked?: boolean
  tooltip?: string
  onChangeHandler: (value: boolean) => void
}

const CustomCheckbox = (props: Props) => {
  const [isChecked, setIsChecked] = useState(props.isChecked ?? false)

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked)
    props.onChangeHandler(event.target.checked)
  }

  return (
    <>
      <FormControl>
        <FormLabel htmlFor={props.name}>
          {props.label}{' '}
          {props.tooltip && (
            <Tooltip label={props.tooltip}>
              <QuestionIcon />
            </Tooltip>
          )}
        </FormLabel>
        <Checkbox
          spacing="3"
          name={props.name}
          isChecked={isChecked}
          onChange={changeHandler}
        ></Checkbox>
      </FormControl>
    </>
  )
}

export default CustomCheckbox
