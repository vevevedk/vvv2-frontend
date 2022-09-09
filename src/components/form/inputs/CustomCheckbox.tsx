import { QuestionIcon } from "@chakra-ui/icons"
import { Checkbox, FormControl, FormLabel, Tooltip } from "@chakra-ui/react"

interface Props {
  label: string
  name: string
  isChecked?: boolean
  tooltip?: string
  onChangeHandler: (value: boolean) => void
}

const CustomCheckbox = (props: Props) => {
  return (
    <>
      <FormControl>
        <FormLabel htmlFor={props.name}>
          {props.label}{" "}
          {props.tooltip && (
            <Tooltip label={props.tooltip}>
              <QuestionIcon />
            </Tooltip>
          )}
        </FormLabel>
        <Checkbox
          spacing="3"
          name={props.name}
          isChecked={props.isChecked}
          onChange={(e) => props.onChangeHandler(e.target.checked)}
        ></Checkbox>
      </FormControl>
    </>
  )
}

export default CustomCheckbox
