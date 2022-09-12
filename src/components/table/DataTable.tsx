import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons"
import { chakra, Flex, Stack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"
import React from "react"
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  ColumnDef,
  SortingState,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table"
import DataTablePagination from "./DataTablePagination"

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
    getPaginationRowModel: getPaginationRowModel(),
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

  return (
    <Stack spacing={10}>
      <Table>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                const meta: any = header.column.columnDef.meta
                return (
                  <Th key={header.id} onClick={header.column.getToggleSortingHandler()} isNumeric={meta?.isNumeric}>
                    {flexRender(header.column.columnDef.header, header.getContext())}

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

      <Flex justifyContent={"center"}>
        <DataTablePagination
          disableNext={!table.getCanNextPage()}
          disablePrevious={!table.getCanPreviousPage()}
          nextPage={() => table.nextPage()}
          previousPage={() => table.previousPage()}
          setPageIndex={(pageIndex) => table.setPageIndex(pageIndex)}
          setPageSize={(pageSize) => table.setPageSize(pageSize)}
          pageCount={table.getPageCount()}
          paginationState={table.getState().pagination}
        />
      </Flex>
    </Stack>
  )
}
