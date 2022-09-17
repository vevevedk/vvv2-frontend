import { Box, Container, Heading, Spinner, Stack } from "@chakra-ui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/react-table"
import React from "react"
import { AccountResponse } from "../api/generated"
import { deleteAccount } from "../api/mutations/accounts/deleteAccount"
import { getAccounts, getAccountsQueryKey } from "../api/queries/getAccounts"
import ActionMenu from "../components/ActionMenu"
import CustomAlertDialog from "../components/CustomAlertDialog"
import CustomButton from "../components/CustomButton"
import CreateUpdateAccountModal from "../components/form/CreateUpdateAccountModal"
import DataTable from "../components/table/DataTable"
import { useRequireAuth } from "../hooks/useRequireAuth"

const AccountsPage = () => {
  useRequireAuth()

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
    deleteAccountMutation.mutate(
      { id: accountToDelete!.id },
      {
        onSuccess: () =>
          queryClient.setQueryData<AccountResponse[]>([getAccountsQueryKey], (old) =>
            old!.filter((a) => a.id !== accountToDelete!.id)
          ),
      }
    )
    setDeleteIsOpen(false)
    setAccountToDelete(null)
  }

  const columnHelper = createColumnHelper<AccountResponse>()

  const columns = [
    columnHelper.accessor((x) => x.id, { cell: (info) => info.getValue(), header: "Id" }),
    columnHelper.accessor((x) => x.googleAdsAccountId, { header: "GoogleAds AccountId" }),
    columnHelper.accessor((x) => x.googleAdsAccountName, { header: "GoogleAds AccountName" }),
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
    <Container width={"1500px"} maxW={"100%"}>
      <Stack spacing={10}>
        <Heading as="h1" size="xl">
          Accounts
        </Heading>
        <Box>
          <CustomButton title="Create account" onClickHandler={() => setCreateIsOpen(true)} color="green" />
        </Box>
        {getAccountsQuery.isLoading && <Spinner size="lg" />}
        <DataTable columns={columns} data={getAccountsQuery.data || []} />
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

export default AccountsPage
