import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons"
import { Box, chakra, Flex, Stack, Table as ChakraTable, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import React from "react"

import { rankItem } from "@tanstack/match-sorter-utils"
import Filter from "./DataTableFilter"
import DataTablePagination from "./DataTablePagination"

export type Props<Data extends object> = {
  data: Data[]
  columns: ColumnDef<Data, any>[]
  onRowSelectionChange?: (selectedRows: Data[]) => void
}

export default function DataTable<Data extends object>({ data, columns, onRowSelectionChange }: Props<Data>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
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
      <ChakraTable>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                const meta: any = header.column.columnDef.meta
                return (
                  <Th key={header.id} isNumeric={meta?.isNumeric}>
                    <Box onClick={header.column.getToggleSortingHandler()}>
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
                    </Box>

                    {header.column.getCanFilter() && (
                      <Box maxWidth={"250px"}>
                        <Filter column={header.column} table={table} />
                      </Box>
                    )}
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
                  <Td key={cell.id} isNumeric={meta?.isNumeric} wordBreak={"break-word"}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                )
              })}
            </Tr>
          ))}
        </Tbody>
      </ChakraTable>

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

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank,
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}
