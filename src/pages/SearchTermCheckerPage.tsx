import { Box, Container, Heading, Spinner, Stack, StackDivider } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/table-core"
import React from "react"
import { SearchTermResponse } from "../api/generated/models/SearchTermResponse"
import { getSearchTerms, getSearchTermsQueryKey } from "../api/queries/getSearchTerms"
import GetSearchTermsForm from "../components/searchTermChecker/GetSearchTermsForm"
import DataTable from "../components/table/DataTable"
import DataTableCheckboxColumn from "../components/table/DataTableCheckboxColumn"
import DataTableCheckboxHeader from "../components/table/DataTableCheckboxHeader"

const SearchTermCheckerPage = () => {
  const [createIsOpen, setCreateIsOpen] = React.useState(false)
  const [selectedRows, setSelectedRows] = React.useState<SearchTermResponse[]>([])

  const getSearchTermsQuery = useQuery<SearchTermResponse[]>([getSearchTermsQueryKey], getSearchTerms as any, {
    enabled: false,
  })

  const columnHelper = createColumnHelper<SearchTermResponse>()

  const columns = [
    columnHelper.accessor((x) => x, {
      header: ({ table }) => <DataTableCheckboxHeader table={table} />,
      cell: ({ row }) => <DataTableCheckboxColumn row={row} />,
      id: "select",
      enableSorting: false,
    }),
    columnHelper.accessor((x) => x.adGroupName, { cell: (info) => info.getValue(), header: "AdGroup Name" }),
    columnHelper.accessor((x) => x.campaignName, { cell: (info) => info.getValue(), header: "Campaign Name" }),
    columnHelper.accessor((x) => x.searchTerm, { cell: (info) => info.getValue(), header: "Search Term" }),
  ]

  return (
    <Container maxW={"150ch"}>
      <Stack spacing={10}>
        <Box>
          <Heading as="h1" size="xl">
            Search Term Checker
          </Heading>
        </Box>
        <Stack spacing={10} divider={<StackDivider borderColor="gray.500" />}>
          <Box>
            <GetSearchTermsForm />
          </Box>
          <Stack spacing={5}>
            <Box></Box>
            <Box>
              {getSearchTermsQuery?.isFetching && <Spinner size="lg" />}
              {!getSearchTermsQuery?.isFetching && !!getSearchTermsQuery?.data && (
                <DataTable
                  columns={columns}
                  data={getSearchTermsQuery.data || []}
                  onRowSelectionChange={setSelectedRows}
                />
              )}
            </Box>
          </Stack>
        </Stack>
      </Stack>
      {/* <CreateUpdateClientModal
        title="Create a client"
        content={`Create a new client.`}
        isOpen={createIsOpen}
        onClose={() => setCreateIsOpen(false)}
        clientId={null}
      /> */}
    </Container>
  )
}

export default SearchTermCheckerPage
