import { Box, Container, Heading, Spinner, Stack } from "@chakra-ui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import React from "react"
import { Column } from "react-table"
import { ClientResponse } from "../api/generated"
import { deleteClient } from "../api/mutations/clients/deleteClient"
import { getClients, getClientsQueryKey } from "../api/queries/getClients"
import CustomAlertDialog from "../components/CustomAlertDialog"
import CustomButton from "../components/CustomButton"
import CreateUpdateClientModal from "../components/form/CreateUpdateClientModal"
import CustomTable, { createDefaultColumn } from "../components/table/CustomTable"

const Clients = () => {
  const [deleteIsOpen, setDeleteIsOpen] = React.useState(false)
  const [createIsOpen, setCreateIsOpen] = React.useState(false)
  const [updateIsOpen, setUpdateIsOpen] = React.useState(false)
  const [clientToDelete, setClientToDelete] = React.useState<ClientResponse | null>(null)
  const [clientIdToUpdate, setClientIdToUpdate] = React.useState<number | null>(null)

  const queryClient = useQueryClient()
  const getClientsQuery = useQuery([getClientsQueryKey], getClients)
  const deleteClientMutation = useMutation(deleteClient)

  const deleteClickHandler = (obj: ClientResponse) => {
    setDeleteIsOpen(true)
    setClientToDelete(obj)
  }

  const updateClickHandler = (obj: ClientResponse) => {
    setUpdateIsOpen(true)
    setClientIdToUpdate(obj.id)
  }

  const deleteSubmitHandler = () => {
    deleteClientMutation.mutate({ id: clientToDelete!.id })
    queryClient.setQueryData<ClientResponse[]>([getClientsQueryKey], (old) => old!.filter((a) => a.id !== clientToDelete!.id))

    setDeleteIsOpen(false)
    setClientToDelete(null)
  }

  const columns: Column<ClientResponse>[] = [
    createDefaultColumn({ header: "Id", accessor: (x) => x.id }),
    createDefaultColumn({ header: "Name", accessor: (x) => x.name }),
    createDefaultColumn({
      header: "Created",
      accessor: (x) => new Date(x.createdDate),
      sortType: "datetime",
      Cell: ({ value }: { value: Date }) => value.toLocaleString(),
    }),
    createDefaultColumn({
      header: "Actions",
      accessor: (x) => x,
      disableSortBy: true,
      Cell: ({ value }) => (
        <>
          <CustomButton title="Edit" color="green" onClickHandler={() => updateClickHandler(value)} />
          <CustomButton title="Delete" color="red" onClickHandler={() => deleteClickHandler(value)} />
        </>
      ),
    }),
  ]

  return (
    <Container paddingTop="150px" maxW={"150ch"}>
      <Stack spacing={10}>
        <Heading as="h1" size="xl">
          Clients
        </Heading>
        <Box>
          <CustomButton title="Create client" onClickHandler={() => setCreateIsOpen(true)} color="green" />
        </Box>
        {getClientsQuery.isLoading && <Spinner size="lg" />}
        <CustomTable columns={columns} data={getClientsQuery.data || []} />
      </Stack>
      <CreateUpdateClientModal
        title="Create a client"
        content={`Create a new client.`}
        isOpen={createIsOpen}
        onClose={() => setCreateIsOpen(false)}
        clientId={null}
      />
      <CreateUpdateClientModal
        title="Update a client"
        content={`Update an existing client.`}
        isOpen={updateIsOpen}
        clientId={clientIdToUpdate}
        onClose={() => setUpdateIsOpen(false)}
      />
      <CustomAlertDialog
        title="Are you sure that you want to delete"
        content={`The client ${clientToDelete?.name} will be deleted. This action cannot be undone.`}
        isOpen={deleteIsOpen}
        onClose={() => setDeleteIsOpen(false)}
        onSubmit={deleteSubmitHandler}
      />
    </Container>
  )
}

export default Clients
