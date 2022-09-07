import { Box, Container, Heading, Spinner, Stack } from "@chakra-ui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import React from "react"
import { Column } from "react-table"
import { ClientResponse } from "../api/generated"
import { deleteClient } from "../api/mutations/clients/deleteClient"
import { getAccounts, getAccountsQueryKey } from "../api/queries/getAccounts"
import { getClients, getClientsQueryKey } from "../api/queries/getClients"
import CustomAlertDialog from "../components/CustomAlertDialog"
import CustomButton from "../components/CustomButton"
import CreateUpdateClientModal from "../components/form/CreateUpdateClientModal"
import AccountSelector from "../components/form/inputs/AccountSelector"
import CustomTable, { createDefaultColumn } from "../components/table/CustomTable"

const SearchTermChecker = () => {
  const [createIsOpen, setCreateIsOpen] = React.useState(false)

  const [chosenAccountId, setChosenAccountId] = React.useState<string>()

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
          <AccountSelector selectedId={chosenAccountId} onChange={setChosenAccountId}/>
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
