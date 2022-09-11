import { Box, Container, Heading, Spinner, Stack } from "@chakra-ui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/table-core"
import React from "react"
import { ClientResponse } from "../api/generated"
import { deleteClient } from "../api/mutations/clients/deleteClient"
import { getClients, getClientsQueryKey } from "../api/queries/getClients"
import ActionMenu from "../components/ActionMenu"
import CustomAlertDialog from "../components/CustomAlertDialog"
import CustomButton from "../components/CustomButton"
import CreateUpdateClientModal from "../components/form/CreateUpdateClientModal"
import DataTable from "../components/table/DataTable"
import { useRequireAuth } from "../hooks/useRequireAuth"

const ClientsPage = () => {
  useRequireAuth()

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
    queryClient.setQueryData<ClientResponse[]>([getClientsQueryKey], (old) =>
      old!.filter((a) => a.id !== clientToDelete!.id)
    )

    setDeleteIsOpen(false)
    setClientToDelete(null)
  }

  const columnHelper = createColumnHelper<ClientResponse>()
  const columns = [
    columnHelper.accessor((x) => x.id, { header: "Id" }),
    columnHelper.accessor((x) => x.name, { header: "Name" }),
    columnHelper.accessor((x) => new Date(x.createdDate), {
      cell: (info) => info.getValue().toLocaleString(),
      header: "Created",
      sortingFn: (a, b) => {
        const aDate = new Date(a.original.createdDate)
        const bDate = new Date(b.original.createdDate)
        return aDate.getTime() - bDate.getTime()
      },
    }),
    columnHelper.accessor((x) => x, {
      cell: (info) => (
        <ActionMenu
          title="Actions"
          actions={[
            { name: "Edit", onClick: () => updateClickHandler(info.getValue()) },
            { name: "Delete", onClick: () => deleteClickHandler(info.getValue()) },
          ]}
        />
      ),
      enableSorting: false,
      header: "Actions",
    }),
  ]

  return (
    <Container maxW={"150ch"}>
      <Stack spacing={10}>
        <Heading as="h1" size="xl">
          Clients
        </Heading>
        <Box>
          <CustomButton title="Create client" onClickHandler={() => setCreateIsOpen(true)} color="green" />
        </Box>
        {getClientsQuery.isLoading && <Spinner size="lg" />}
        <DataTable columns={columns} data={getClientsQuery.data || []} />
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

export default ClientsPage
