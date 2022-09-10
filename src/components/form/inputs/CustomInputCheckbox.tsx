import { QuestionIcon } from "@chakra-ui/icons"
import { Checkbox, FormControl, FormLabel, Tooltip } from "@chakra-ui/react"

type CheckboxValue = "checked" | "unchecked" | "indeterminate"
interface Props {
  label?: string
  name?: string
  value?: CheckboxValue
  tooltip?: string
  onChangeHandler?: (value: CheckboxValue) => void
}

const CustomInputCheckbox = (props: Props) => {
  return (
    <>
      <FormControl>
        {props.label && (
          <FormLabel htmlFor={props.name}>
            {props.label}{" "}
            {props.tooltip && (
              <Tooltip label={props.tooltip}>
                <QuestionIcon />
              </Tooltip>
            )}
          </FormLabel>
        )}
        <Checkbox
          spacing="3"
          name={props.name}
          isIndeterminate={props.value === "indeterminate"}
          isChecked={props.value === "checked"}
          onChange={(event) => props.onChangeHandler?.(event.target.checked ? "checked" : "unchecked")}
        ></Checkbox>
      </FormControl>
    </>
  )
}

export default CustomInputCheckbox
