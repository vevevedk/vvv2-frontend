import { Box, Container, Heading, Stack } from "@chakra-ui/react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import React from "react"
import { AccountResponse } from "../api/generated"
import { getAccounts, getAccountsQueryKey } from "../api/queries/getAccounts"
import AccountSelector from "../components/form/inputs/AccountSelector"

const SearchTermChecker = () => {
  const [createIsOpen, setCreateIsOpen] = React.useState(false)

  const [chosenAccount, setChosenAccount] = React.useState<AccountResponse>()

  const queryClient = useQueryClient()
  const getAccountsQuery = useQuery([getAccountsQueryKey], getAccounts)

  // const columns: Column<ClientResponse>[] = [
  //   createDefaultColumn({ header: "Id", accessor: (x) => x.id }),
  //   createDefaultColumn({ header: "Name", accessor: (x) => x.name }),
  //   createDefaultColumn({
  //     header: "Created",
  //     accessor: (x) => new Date(x.createdDate),
  //     sortType: "datetime",
  //     Cell: ({ value }: { value: Date }) => value.toLocaleString(),
  //   }),
  //   createDefaultColumn({
  //     header: "Actions",
  //     accessor: (x) => x,
  //     disableSortBy: true,
  //     Cell: ({ value }) => (
  //       <>
  //         <CustomButton title="Edit" color="green" onClickHandler={() => updateClickHandler(value)} />
  //         <CustomButton title="Delete" color="red" onClickHandler={() => deleteClickHandler(value)} />
  //       </>
  //     ),
  //   }),
  // ]

  return (
    <Container paddingTop="150px" maxW={"150ch"}>
      <Stack spacing={10}>
        <Heading as="h1" size="xl">
          Search Term Checker
        </Heading>
        <Box>
          <AccountSelector value={chosenAccount} onChange={setChosenAccount} />
        </Box>
        {/* {getClientsQuery.isLoading && <Spinner size="lg" />} */}
        {/* <CustomTable columns={columns} data={getClientsQuery.data || []} /> */}
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

export default SearchTermChecker
