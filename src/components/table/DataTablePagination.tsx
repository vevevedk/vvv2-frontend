import { Box, HStack } from "@chakra-ui/react"
import { PaginationState, OnChangeFn } from "@tanstack/react-table"

export type Props = {
  paginationState: PaginationState
  disablePrevious: boolean
  disableNext: boolean
  pageCount: number
  setPageIndex: OnChangeFn<number>
  setPageSize: OnChangeFn<number>
  previousPage: () => void
  nextPage: () => void
}

export default function DataTablePagination(props: Props) {
  return (
    <HStack>
      <Box>
        <button onClick={() => props.setPageIndex(0)} disabled={props.disablePrevious}>
          {"<<"}
        </button>
      </Box>
      <Box>
        <button onClick={() => props.previousPage()} disabled={props.disablePrevious}>
          {"<"}
        </button>
      </Box>
      <Box>
        <button onClick={() => props.nextPage()} disabled={props.disableNext}>
          {">"}
        </button>
      </Box>
      <Box>
        <button onClick={() => props.setPageIndex(props.pageCount - 1)} disabled={props.disableNext}>
          {">>"}
        </button>
      </Box>
      <Box>
        <span>
          Page{" "}
          <strong>
            {props.paginationState.pageIndex + 1} of {props.pageCount}
          </strong>
        </span>
      </Box>
      <select
        value={props.paginationState.pageSize}
        onChange={(e) => {
          props.setPageSize(Number(e.target.value))
        }}
      >
        {[10, 20, 30, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
    </HStack>
  )
}
