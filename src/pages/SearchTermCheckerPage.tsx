import { Box, Container, Heading, HStack, Spinner, Stack, StackDivider } from "@chakra-ui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/table-core"
import React from "react"
import { AccountResponse, JobFeatureNameEnum, JobResponse } from "../api/generated"
import { SearchTermResponse } from "../api/generated/models/SearchTermResponse"
import { createNegativeKeywords } from "../api/mutations/keywords/createKeywords"
import { getJobsQueryKey } from "../api/queries/getJobs"
import { getSearchTerms, getSearchTermsQueryKey } from "../api/queries/getSearchTerms"
import ActionMenu from "../components/ActionMenu"
import CustomAlertDialog from "../components/CustomAlertDialog"
import JobsList from "../components/jobs/JobsList"
import GetSearchTermsForm from "../components/searchTermChecker/GetSearchTermsForm"
import DataTable from "../components/table/DataTable"
import DataTableCheckboxColumn from "../components/table/DataTableCheckboxColumn"
import DataTableCheckboxHeader from "../components/table/DataTableCheckboxHeader"
import { useCustomToast } from "../hooks/useCustomToast"
import { useRequireAuth } from "../hooks/useRequireAuth"

const SearchTermCheckerPage = () => {
  useRequireAuth()

  const [modalIsOpen, setModalIsOpen] = React.useState<"createNegativeKeywords">()
  const [selectedRows, setSelectedRows] = React.useState<SearchTermResponse[]>([])
  const [chosenAccount, setChosenAccount] = React.useState<AccountResponse>()
  const toast = useCustomToast()

  const queryClient = useQueryClient()
  const getSearchTermsQuery = useQuery<SearchTermResponse[]>([getSearchTermsQueryKey], getSearchTerms as any, {
    enabled: false,
  })
  const createNegativeKeywordsMutation = useMutation(createNegativeKeywords)

  const columnHelper = createColumnHelper<SearchTermResponse>()
  const columns = [
    columnHelper.accessor((x) => x, {
      header: ({ table }) => <DataTableCheckboxHeader table={table} />,
      cell: ({ row }) => <DataTableCheckboxColumn row={row} />,
      id: "select",
      enableSorting: false,
      enableColumnFilter: false,
      size: 25,
    }),
    columnHelper.accessor((x) => x.campaignName, { header: "Campaign Name", size: 300 }),
    columnHelper.accessor((x) => x.adGroupName, { header: "AdGroup Name", size: 300 }),
    columnHelper.accessor((x) => x.searchTerm, { header: "Search Term", size: 300 }),
    columnHelper.accessor((x) => x.impressions, { header: "Impressions", size: 150 }),
    columnHelper.accessor((x) => x.clicks, { header: "Clicks", size: 150 }),
    columnHelper.accessor((x) => x.conversions, { header: "Conversions", size: 150 }),
    columnHelper.accessor((x) => x.conversionValue, { header: "Conversion Value", size: 150 }),
    columnHelper.accessor((x) => x.costMicros, { header: "Cost Micros", size: 150 }),
  ]

  const handleCreateNegativeKeywords = () => {
    createNegativeKeywordsMutation.mutate(
      {
        googleAdsAccountId: chosenAccount?.googleAdsAccountId!,
        keywords: selectedRows.map((x) => ({
          adGroupId: x.adGroupId,
          keywordText: x.searchTerm,
        })),
      },
      {
        onSuccess: (response) => {
          toast("Jobs was created", "Job is pending in the Jobs list")
          setModalIsOpen(undefined)
          queryClient.setQueryData<JobResponse[]>(
            [getJobsQueryKey, JobFeatureNameEnum.CREATE_NEGATIVE_KEYWORDS],
            (old) => [...old!, response]
          )
        },
      }
    )
  }

  return (
    <Container width={"1500px"} maxW={"100%"}>
      <Stack spacing={10}>
        <HStack justifyContent={"space-between"}>
          <Box>
            <Heading as="h1" size="xl">
              Search Term Checker
            </Heading>
          </Box>
          <Box>
            <JobsList featureName={JobFeatureNameEnum.CREATE_NEGATIVE_KEYWORDS} />
          </Box>
        </HStack>
        <Stack spacing={10} divider={<StackDivider borderColor="gray.500" />}>
          <Box>
            <GetSearchTermsForm chosenAccountChangeHandler={setChosenAccount} />
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
        onSubmit={handleCreateNegativeKeywords}
        isSubmitting={createNegativeKeywordsMutation.isLoading}
      />
    </Container>
  )
}

export default SearchTermCheckerPage
