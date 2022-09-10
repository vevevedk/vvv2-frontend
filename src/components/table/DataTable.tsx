import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons"
import { chakra, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"
import React from "react"
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  ColumnDef,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table"

export type Props<Data extends object> = {
  data: Data[]
  columns: ColumnDef<Data, any>[]
  onRowSelectionChange?: (selectedRows: Data[]) => void
}

export default function DataTable<Data extends object>({ data, columns, onRowSelectionChange }: Props<Data>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    // enableFilters: true,
    // getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      rowSelection,
    },
  })

  React.useEffect(
    () => onRowSelectionChange?.(Object.keys(rowSelection).map((key) => data[parseInt(key)])),
    [data, onRowSelectionChange, rowSelection]
  )

  // var data = React.useMemo(() => props.data, [props.data])
  // var columns = React.useMemo(() => props.columns, [props.columns])

  // const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useReactTable(
  //   { columns, data, autoResetFilters: false },
  //   useFilters,
  //   useSortBy
  // )

  return (
    <Table>
      <Thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <Tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
              const meta: any = header.column.columnDef.meta
              return (
                <Th key={header.id} onClick={header.column.getToggleSortingHandler()} isNumeric={meta?.isNumeric}>
                  {/* <div style={{ position: "absolute", marginTop: "-20px" }}>{header.canFilter ? header.render("Filter") : null}</div> */}
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {/* <span {...header.getHeaderProps(header.getSortByToggleProps())}>{header.render("Header")}</span> */}

                  <chakra.span pl="4">
                    {header.column.getIsSorted() ? (
                      header.column.getIsSorted() === "desc" ? (
                        <TriangleDownIcon aria-label="sorted descending" />
                      ) : (
                        <TriangleUpIcon aria-label="sorted ascending" />
                      )
                    ) : null}
                  </chakra.span>
                </Th>
              )
            })}
          </Tr>
        ))}
      </Thead>
      <Tbody>
        {table.getRowModel().rows.map((row) => (
          <Tr key={row.id}>
            {row.getVisibleCells().map((cell) => {
              // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
              const meta: any = cell.column.columnDef.meta
              return (
                <Td key={cell.id} isNumeric={meta?.isNumeric}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              )
            })}
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

// export function createDefaultColumn<T extends object>({
//   header,
//   accessor,
//   disableSortBy,
//   sortType,
//   filter,
//   Filter,
//   Cell,
// }: {
//   header: string
//   accessor: (x: T) => any
//   disableSortBy?: boolean
//   sortType?: "string" | "datetime"
//   filter?: "includes"
//   Filter?: Renderer<FilterProps<any>>
//   Cell?: Renderer<CellProps<T, any>>
// }): Column<T> {
//   var obj: Column<T> = {
//     Header: header,
//     accessor: accessor,
//     disableFilters: !filter,
//     filter: filter,
//     Filter: Filter,
//     disableSortBy: disableSortBy ?? false,
//   }

//   if (sortType) obj.sortType = sortType

//   if (Cell)
//     // never set Cell to undefined or the tabel is fucked
//     obj.Cell = Cell
//   return obj
// }
