import { Row } from "@tanstack/react-table"
import CustomInputCheckbox from "../form/inputs/CustomInputCheckbox"

export interface Props<T> {
  row: Row<T>
}

const DataTableCheckboxColumn = <T extends object>({ row }: Props<T>) => {
  return (
    <CustomInputCheckbox
      onChangeHandler={(value) => {
        row.toggleSelected(value === "checked")
      }}
      value={row.getIsSelected() ? "checked" : "unchecked"}
    />
  )
}

export default DataTableCheckboxColumn
