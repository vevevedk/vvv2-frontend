import { Box, Container, Heading, Spinner, Stack } from "@chakra-ui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/table-core"
import React from "react"
import { UserResponse } from "../api/generated"
import { deleteUser } from "../api/mutations/users/deleteUser"
import { getUsers, getUsersQueryKey } from "../api/queries/getUsers"
import ActionMenu from "../components/ActionMenu"
import CustomAlertDialog from "../components/CustomAlertDialog"
import CustomButton from "../components/CustomButton"
import CreateUpdateUserModal from "../components/form/CreateUpdateUserModal"
import DataTable from "../components/table/DataTable"
import { useRequireAuth } from "../hooks/useRequireAuth"

const UsersPage = () => {
  useRequireAuth()

  const [deleteIsOpen, setDeleteIsOpen] = React.useState(false)
  const [createIsOpen, setCreateIsOpen] = React.useState(false)
  const [updateIsOpen, setUpdateIsOpen] = React.useState(false)
  const [userToDelete, setUserToDelete] = React.useState<UserResponse | null>(null)
  const [userIdToUpdate, setUserIdToUpdate] = React.useState<number | null>(null)

  const queryClient = useQueryClient()
  const getUsersQuery = useQuery([getUsersQueryKey], getUsers)
  const deleteUserMutation = useMutation(deleteUser)

  const deleteClickHandler = (obj: UserResponse) => {
    setDeleteIsOpen(true)
    setUserToDelete(obj)
  }

  const updateClickHandler = (obj: UserResponse) => {
    setUpdateIsOpen(true)
    setUserIdToUpdate(obj.id)
  }

  const deleteSubmitHandler = () => {
    deleteUserMutation.mutate({ id: userToDelete!.id })
    queryClient.setQueryData<UserResponse[]>([getUsersQueryKey], (old) => old!.filter((a) => a.id !== userToDelete!.id))
    setDeleteIsOpen(false)
    setUserToDelete(null)
  }

  const columnHelper = createColumnHelper<UserResponse>()

  const columns = [
    columnHelper.accessor((x) => x.id, { header: "Id" }),
    columnHelper.accessor((x) => x.email, { header: "Email" }),
    columnHelper.accessor((x) => x.fullName, { header: "Fullname" }),
    columnHelper.accessor((x) => x.isAdmin, { cell: (info) => (info.getValue() ? "Yes" : "No"), header: "IsAdmin" }),
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
          Users
        </Heading>
        <Box>
          <CustomButton title="Create user" onClickHandler={() => setCreateIsOpen(true)} color="green" />
        </Box>
        {getUsersQuery.isLoading && <Spinner size="lg" />}
        <DataTable columns={columns} data={getUsersQuery.data || []} />
      </Stack>
      <CreateUpdateUserModal
        title="Create a user"
        content={`Create a new user. This will create a new user in the system and send an invitation email to the provided email-address.`}
        isOpen={createIsOpen}
        onClose={() => setCreateIsOpen(false)}
        userId={null}
      />
      <CreateUpdateUserModal
        title="Update a user"
        content={`Update an existing user.`}
        isOpen={updateIsOpen}
        userId={userIdToUpdate}
        onClose={() => setUpdateIsOpen(false)}
      />
      <CustomAlertDialog
        title="Are you sure that you want to delete"
        content={`The user ${userToDelete?.fullName} will be deleted. This action cannot be undone.`}
        isOpen={deleteIsOpen}
        onClose={() => setDeleteIsOpen(false)}
        onSubmit={deleteSubmitHandler}
      />
    </Container>
  )
}

export default UsersPage
