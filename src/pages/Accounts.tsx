import { Box, Container, Heading, Spinner, Stack } from "@chakra-ui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import React from "react"
import { Column } from "react-table"
import { AccountResponse } from "../api/generated"
import { deleteAccount } from "../api/mutations/accounts/deleteAccount"
import { getAccounts, getAccountsQueryKey } from "../api/queries/getAccounts"
import CustomAlertDialog from "../components/CustomAlertDialog"
import CustomButton from "../components/CustomButton"
import CreateUpdateAccountModal from "../components/form/CreateUpdateAccountModal"
import CustomTable, { createDefaultColumn } from "../components/table/CustomTable"

const Accounts = () => {
  const [deleteIsOpen, setDeleteIsOpen] = React.useState(false)
  const [createIsOpen, setCreateIsOpen] = React.useState(false)
  const [updateIsOpen, setUpdateIsOpen] = React.useState(false)
  const [accountToDelete, setAccountToDelete] = React.useState<AccountResponse | null>(null)
  const [accountIdToUpdate, setAccountIdToUpdate] = React.useState<number | null>(null)

  const queryClient = useQueryClient()
  const getAccountsQuery = useQuery([getAccountsQueryKey], getAccounts)
  const deleteAccountMutation = useMutation(deleteAccount)

  const deleteClickHandler = (obj: AccountResponse) => {
    setDeleteIsOpen(true)
    setAccountToDelete(obj)
  }

  const updateClickHandler = (obj: AccountResponse) => {
    setUpdateIsOpen(true)
    setAccountIdToUpdate(obj.id)
  }

  const deleteSubmitHandler = () => {
    deleteAccountMutation.mutate({ id: accountToDelete!.id })
    queryClient.setQueryData<AccountResponse[]>([getAccountsQueryKey], (old) => old!.filter((a) => a.id !== accountToDelete!.id))
    setDeleteIsOpen(false)
    setAccountToDelete(null)
  }

  const columns: Column<AccountResponse>[] = [
    createDefaultColumn({ header: "Id", accessor: (x) => x.id }),
    createDefaultColumn({ header: "GoogleAds AccountId", accessor: (x) => x.googleAdsAccountId }),
    createDefaultColumn({ header: "GoogleAds AccountName", accessor: (x) => x.googleAdsAccountName }),
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
          Accounts
        </Heading>
        <Box>
          <CustomButton title="Create account" onClickHandler={() => setCreateIsOpen(true)} color="green" />
        </Box>
        {getAccountsQuery.isLoading && <Spinner size="lg" />}
        <CustomTable columns={columns} data={getAccountsQuery.data || []} />
      </Stack>
      <CreateUpdateAccountModal
        title="Create a account"
        content={`Create a new account.`}
        isOpen={createIsOpen}
        onClose={() => setCreateIsOpen(false)}
        accountId={null}
      />
      <CreateUpdateAccountModal
        title="Update a account"
        content={`Update an existing account.`}
        isOpen={updateIsOpen}
        accountId={accountIdToUpdate}
        onClose={() => setUpdateIsOpen(false)}
      />
      <CustomAlertDialog
        title="Are you sure that you want to delete"
        content={`The account ${accountToDelete?.googleAdsAccountName} will be deleted. This action cannot be undone.`}
        isOpen={deleteIsOpen}
        onClose={() => setDeleteIsOpen(false)}
        onSubmit={deleteSubmitHandler}
      />
    </Container>
  )
}

export default Accounts
