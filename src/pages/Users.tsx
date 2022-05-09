import {
  Box,
  Container,
  Heading,
  Spinner,
  Stack,
} from '@chakra-ui/react'
import React from 'react'
import { Column } from 'react-table'
import { UserResponse } from '../api/generated'
import CustomAlertDialog from '../components/CustomAlertDialog'
import CustomButton from '../components/CustomButton'
import CreateUpdateUserModal from '../components/form/CreateUpdateUserModal'
import CustomTable, {
  createDefaultColumn,
} from '../components/table/CustomTable'
import { useAppDispatch, useRequireAuth } from '../hooks/hooks'
import { DeleteUserAsync, useUsers } from '../redux/usersSlice'

const Users = () => {
  const [deleteIsOpen, setDeleteIsOpen] = React.useState(false)
  const [createIsOpen, setCreateIsOpen] = React.useState(false)
  const [updateIsOpen, setUpdateIsOpen] = React.useState(false)
  const [userToDelete, setUserToDelete] = React.useState<UserResponse | null>(
    null
  )
  const [userIdToUpdate, setUserIdToUpdate] = React.useState<number | null>(
    null
  )

  useRequireAuth()
  const dispatch = useAppDispatch()
  const { users, status: usersStatus } = useUsers()

  const deleteClickHandler = (obj: UserResponse) => {
    setDeleteIsOpen(true)
    setUserToDelete(obj)
  }

  const updateClickHandler = (obj: UserResponse) => {
    setUpdateIsOpen(true)
    setUserIdToUpdate(obj.id)
  }

  const deleteSubmitHandler = () => {
    dispatch(DeleteUserAsync(userToDelete!.id))
    setDeleteIsOpen(false)
    setUserToDelete(null)
  }

  const columns: Column<UserResponse>[] = [
    createDefaultColumn({ header: 'Id', accessor: (x) => x.id }),
    createDefaultColumn({ header: 'Email', accessor: (x) => x.email }),
    createDefaultColumn({ header: 'Fullname', accessor: (x) => x.fullName }),
    createDefaultColumn({ header: 'IsAdmin', accessor: (x) => (x.isAdmin ? 'Yes' : 'No') }),

    createDefaultColumn({
      header: 'Created',
      accessor: (x) => new Date(x.createdDate),
      sortType: 'datetime',
      Cell: ({ value }: { value: Date }) => value.toLocaleString(),
    }),
    createDefaultColumn({
      header: 'Actions',
      accessor: (x) => x,
      disableSortBy: true,
      Cell: ({ value }) => (
        <>
          <CustomButton
            title="Edit"
            color="green"
            onClickHandler={() => updateClickHandler(value)}
          />
          <CustomButton
            title="Delete"
            color="red"
            onClickHandler={() => deleteClickHandler(value)}
          />
        </>
      ),
    }),
  ]

  return (
    <Container paddingTop="150px" maxW={'150ch'}>
      <Stack spacing={10}>
        <Heading as="h1" size="xl">
          Users
        </Heading>
        <Box>
          <CustomButton
            title="Create user"
            onClickHandler={() => setCreateIsOpen(true)}
            color="green"
          />
        </Box>
        {usersStatus === 'loading' && <Spinner size="lg" />}
        <CustomTable columns={columns} data={users} />
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

export default Users
