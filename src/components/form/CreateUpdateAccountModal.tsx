import { Alert, AlertIcon, Box, Stack } from "@chakra-ui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
import { AccountResponse } from "../../api/generated"
import { createAccount } from "../../api/mutations/accounts/createAccount"
import { updateAccount } from "../../api/mutations/accounts/updateAccount"
import { getAccounts, getAccountsQueryKey } from "../../api/queries/getAccounts"
import CustomModal from "../CustomModal"
import CustomInputField, { InputFieldType } from "./inputs/CustomInputField"
import CustomSubmitButton from "./inputs/CustomSubmitButton"

interface Props {
  isOpen: boolean
  onClose: () => void
  title: string
  content: string
  accountId: number | null // if null, create new account
}
const CreateUpdateAccountModal = (props: Props) => {
  const [googleAdsAccountId, setGoogleAdsAccountId] = React.useState("")
  const [googleAdsAccountName, setGoogleAdsAccountName] = React.useState("")
  const [googleAdsAccountIdValidated, setGoogleAdsAccountIdValidated] = React.useState(false)
  const [googleAdsAccountNameValidated, setGoogleAdsAccountNameValidated] = React.useState(false)

  const requestBody = {
    googleAdsAccountId,
    googleAdsAccountName,
  }

  const [errorMode, setErrorMode] = useState(false)
  const [loadedAccountId, setLoadedAccountId] = React.useState<number | null>(null)

  const queryClient = useQueryClient()
  const updateAccountMutation = useMutation(updateAccount)
  const createAccountMutation = useMutation(createAccount)

  const accountToUpdate = useQuery([getAccountsQueryKey], getAccounts).data?.find((a) => a.id === props.accountId)
  const isValid = googleAdsAccountIdValidated && googleAdsAccountNameValidated

  useEffect(() => {
    // dont load the same account twice or it will overwrite input fields
    if (accountToUpdate && loadedAccountId !== accountToUpdate.id) {
      setLoadedAccountId(accountToUpdate.id)
      setGoogleAdsAccountId(accountToUpdate.googleAdsAccountId || "")
      setGoogleAdsAccountName(accountToUpdate.googleAdsAccountName || "")
    }
  }, [accountToUpdate, loadedAccountId])

  const resetAndClose = () => {
    setGoogleAdsAccountId("")
    setGoogleAdsAccountName("")
    setGoogleAdsAccountIdValidated(false)
    setGoogleAdsAccountNameValidated(false)
    setErrorMode(false)
    setLoadedAccountId(null)
    props.onClose()
  }

  const handleFormSubmit = () => {
    if (!isValid) {
      setErrorMode(true)
      return
    }

    setErrorMode(false)

    if (!!accountToUpdate)
      updateAccountMutation.mutate(
        {
          id: accountToUpdate!.id,
          body: requestBody,
        },
        {
          onSuccess: (response) => {
            queryClient.setQueryData<AccountResponse[]>([getAccountsQueryKey], (oldData) =>
              oldData!.map((acc) => (acc.id === response.id ? response : acc))
            )
            resetAndClose()
          },
        }
      )
    else
      createAccountMutation.mutate(requestBody, {
        onSuccess: (response) => {
          queryClient.setQueryData<AccountResponse[]>([getAccountsQueryKey], (old) => [...old!, response])
          resetAndClose()
        },
      })
  }

  const SubmitButton = (
    <CustomSubmitButton
      disabled={errorMode && !isValid}
      submitting={createAccountMutation.isLoading || updateAccountMutation.isLoading}
      title="Save"
      onClickHandler={handleFormSubmit}
    />
  )

  return (
    <CustomModal isOpen={props.isOpen} onClose={props.onClose} title={props.title} content={props.content} submitButton={SubmitButton}>
      <Box>
        <form>
          <Stack spacing={3}>
            <CustomInputField
              label="GoogleAds AccountId"
              name="googleAdsAccountId"
              type={InputFieldType.text}
              onChangeHandler={setGoogleAdsAccountId}
              onIsValidChangeHandler={setGoogleAdsAccountIdValidated}
              value={googleAdsAccountId}
              placeholder="Test"
              displayErrorIfInvalid={errorMode}
              minLength={2} // TODO use openapi generated object
            />

            <CustomInputField
              label="GoogleAds AccountName"
              name="googleAdsAccountName"
              type={InputFieldType.text}
              onChangeHandler={setGoogleAdsAccountName}
              onIsValidChangeHandler={setGoogleAdsAccountNameValidated}
              value={googleAdsAccountName}
              placeholder="Test"
              displayErrorIfInvalid={errorMode}
              minLength={2} // TODO use openapi generated object
            />

            {(createAccountMutation.isError || updateAccountMutation.isError) && (
              <Alert status="error">
                <AlertIcon />
                {(createAccountMutation.error as Error)?.message ?? (updateAccountMutation.error as Error).message}
              </Alert>
            )}
          </Stack>
        </form>
      </Box>
    </CustomModal>
  )
}

export default CreateUpdateAccountModal
