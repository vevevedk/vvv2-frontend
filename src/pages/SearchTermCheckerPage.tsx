import { Box, Container, Heading, Spinner, Stack, StackDivider, useToast } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/table-core"
import React from "react"
import { SearchTermResponse } from "../api/generated/models/SearchTermResponse"
import { getSearchTerms, getSearchTermsQueryKey } from "../api/queries/getSearchTerms"
import CustomAlertDialog from "../components/CustomAlertDialog"
import CustomButton from "../components/CustomButton"
import GetSearchTermsForm from "../components/searchTermChecker/GetSearchTermsForm"
import DataTable from "../components/table/DataTable"
import DataTableCheckboxColumn from "../components/table/DataTableCheckboxColumn"
import DataTableCheckboxHeader from "../components/table/DataTableCheckboxHeader"

const SearchTermCheckerPage = () => {
  const [modalIsOpen, setModalIsOpen] = React.useState<"createNegativeKeywords">()
  const [selectedRows, setSelectedRows] = React.useState<SearchTermResponse[]>([])
  const toast = useToast()

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
            <Box>
              <CustomButton
                disabled={selectedRows.length === 0}
                title="Create negative keywords"
                color="green"
                onClickHandler={() => setModalIsOpen("createNegativeKeywords")}
              />
            </Box>
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
      <CustomAlertDialog
        title="Create negative keywords"
        content={`${selectedRows.length} negative keyword(s) will be created.`}
        isOpen={modalIsOpen === "createNegativeKeywords"}
        onClose={() => setModalIsOpen(undefined)}
        onSubmit={() =>
          toast({
            title: "TODO",
            description: "Nothing a happened",
            status: "success",
            duration: 9000,
            isClosable: true,
          })
        }
      />
    </Container>
  )
}

export default SearchTermCheckerPage
