import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import { chakra, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import React from 'react'

import { Column, useReactTable } from '@tanstack/react-table'


interface Props {
  columns: Column<any>[] // must be the same as the type of data
  data: any[]
}

export default function CustomTable(props: Props) {
  var data = React.useMemo(() => props.data, [props.data])
  var columns = React.useMemo(() => props.columns, [props.columns])

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useReactTable({ columns, data, autoResetFilters: false }, useFilters, useSortBy)

  return (
    <Table {...getTableProps()}>
      <Thead>
        {headerGroups.map((headerGroup) => (
          <Tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <Th key={column.id}>
                <div style={{ position: 'absolute', marginTop: '-20px' }}>
                  {column.canFilter ? column.render('Filter') : null}
                </div>
                <span {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                </span>
                <chakra.span pl="4">
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <TriangleDownIcon aria-label="sorted descending" />
                    ) : (
                      <TriangleUpIcon aria-label="sorted ascending" />
                    )
                  ) : null}
                </chakra.span>
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row)
          return (
            <Tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <Td
                  {...cell.getCellProps()}
                  // isNumeric={cell.column.isNumeric}
                >
                  {cell.render('Cell')}
                </Td>
              ))}
            </Tr>
          )
        })}
      </Tbody>
    </Table>
  )
}

export function createDefaultColumn<T extends object>({
  header,
  accessor,
  disableSortBy,
  sortType,
  filter,
  Filter,
  Cell,
}: {
  header: string
  accessor: (x: T) => any
  disableSortBy?: boolean
  sortType?: 'string' | 'datetime'
  filter?: 'includes'
  Filter?: Renderer<FilterProps<any>>
  Cell?: Renderer<CellProps<T, any>>
}): Column<T> {
  var obj: Column<T> = {
    Header: header,
    accessor: accessor,
    disableFilters: !filter,
    filter: filter,
    Filter: Filter,
    disableSortBy: disableSortBy ?? false,
  }

  if (sortType) obj.sortType = sortType

  if (Cell)
    // never set Cell to undefined or the tabel is fucked
    obj.Cell = Cell
  return obj
}
