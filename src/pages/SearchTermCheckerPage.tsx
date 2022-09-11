import { Box, Container, Heading, Spinner, Stack, StackDivider, useToast } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/table-core"
import React from "react"
import { SearchTermResponse } from "../api/generated/models/SearchTermResponse"
import { getSearchTerms, getSearchTermsQueryKey } from "../api/queries/getSearchTerms"
import ActionMenu from "../components/ActionMenu"
import CustomAlertDialog from "../components/CustomAlertDialog"
import GetSearchTermsForm from "../components/searchTermChecker/GetSearchTermsForm"
import DataTable from "../components/table/DataTable"
import DataTableCheckboxColumn from "../components/table/DataTableCheckboxColumn"
import DataTableCheckboxHeader from "../components/table/DataTableCheckboxHeader"
import { useRequireAuth } from "../hooks/useRequireAuth"

const SearchTermCheckerPage = () => {
  useRequireAuth()

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
    columnHelper.accessor((x) => x.adGroupName, { header: "AdGroup Name" }),
    columnHelper.accessor((x) => x.campaignName, { header: "Campaign Name" }),
    columnHelper.accessor((x) => x.searchTerm, { header: "Search Term" }),
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
              {!getSearchTermsQuery?.isFetching && !!getSearchTermsQuery?.data && (
                <ActionMenu
                  title="Actions"
                  actions={[
                    {
                      disabled: selectedRows.length === 0,
                      name: "Create Negative Keywords",
                      onClick: () => setModalIsOpen("createNegativeKeywords"),
                    },
                  ]}
                />
              )}
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
            description: "Nothing happened",
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
