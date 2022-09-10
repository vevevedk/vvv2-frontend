import { Table } from "@tanstack/react-table"
import CustomInputCheckbox from "../form/inputs/CustomInputCheckbox"

export interface Props<T> {
  table: Table<T>
}

const DataTableCheckboxHeader = <T extends object>({ table }: Props<T>) => {
  return (
    <CustomInputCheckbox
      onChangeHandler={(value) => {
        table.toggleAllRowsSelected(value === "checked")
      }}
      value={table.getIsAllRowsSelected() ? "checked" : table.getIsSomeRowsSelected() ? "indeterminate" : "unchecked"}
    />
  )
}

export default DataTableCheckboxHeader