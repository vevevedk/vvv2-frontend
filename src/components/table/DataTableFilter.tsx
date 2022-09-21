import { Column, Table } from "@tanstack/react-table"
import { useMemo } from "react"
import CustomInputField from "../form/inputs/CustomInputField"

export default function Filter({ column, table }: { column: Column<any, unknown>; table: Table<any> }) {
  const columnFilterValue = column.getFilterValue()

  const uniqueValues = column.getFacetedUniqueValues() as Map<string, number>
  const sortedUniqueValues = useMemo(() => Array.from(uniqueValues.keys()).sort(), [uniqueValues])

  return (
    <CustomInputField
      value={(columnFilterValue ?? "") as string}
      onChangeHandler={(value) => column.setFilterValue(value)}
      placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
      debounce={500}
      list={sortedUniqueValues.slice(0, 5000)}
      name={column.id + "_list"}
    />
  )
}
