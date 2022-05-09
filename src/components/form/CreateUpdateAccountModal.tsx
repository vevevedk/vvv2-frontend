import { Alert, AlertIcon, Box, Stack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import {
  UpdateAccountAsync,
  selectUpdateAccountState,
  selectAccountById,
  selectCreateAccountState,
  CreateAccountAsync,
} from '../../redux/accountsSlice'
import CustomModal from '../CustomModal'
import CustomInputField, { InputFieldType } from './inputs/CustomInputField'
import CustomSubmitButton from './inputs/CustomSubmitButton'

interface Props {
  isOpen: boolean
  onClose: () => void
  title: string
  content: string
  accountId: number | null // if null, create new account
}
const CreateUpdateAccountModal = (props: Props) => {
  const [googleAdsAccountId, setGoogleAdsAccountId] = React.useState('')
  const [googleAdsAccountName, setGoogleAdsAccountName] = React.useState('')
  const [googleAdsAccountIdValidated, setGoogleAdsAccountIdValidated] = React.useState(false)
  const [googleAdsAccountNameValidated, setGoogleAdsAccountNameValidated] = React.useState(false)

  const [errorMode, setErrorMode] = useState(false)
  const [loadedAccountId, setLoadedAccountId] = React.useState<number | null>(null)

  const createState = useAppSelector(selectCreateAccountState)
  const updateState = useAppSelector(selectUpdateAccountState)
  const accountToUpdate = useAppSelector(selectAccountById(props.accountId))
  const dispatch = useAppDispatch()
  const isValid = googleAdsAccountIdValidated && googleAdsAccountNameValidated

  useEffect(() => {
    // dont load the same account twice or it will overwrite input fields
    if (accountToUpdate && loadedAccountId !== accountToUpdate.id) {
      setLoadedAccountId(accountToUpdate.id)
      setGoogleAdsAccountId(accountToUpdate.googleAdsAccountId || '')
      setGoogleAdsAccountName(accountToUpdate.googleAdsAccountName || '')
    }
  }, [accountToUpdate, loadedAccountId])

  const resetAndClose = () => {
    setGoogleAdsAccountId('')
    setGoogleAdsAccountName('')
    setErrorMode(false)
    setGoogleAdsAccountIdValidated(false)
    setGoogleAdsAccountNameValidated(false)
    props.onClose()
  }

  const handleFormSubmit = () => {
    if (!isValid) {
      setErrorMode(true)
      return
    }

    setErrorMode(false)

    if (!!accountToUpdate)
      dispatch(
        UpdateAccountAsync({
          id: accountToUpdate!.id,
          body: { googleAdsAccountId: googleAdsAccountId!, googleAdsAccountName },
        })
      ).then(
        (value) => value.meta.requestStatus === 'fulfilled' && resetAndClose()
      )
    else
      dispatch(
        CreateAccountAsync({ googleAdsAccountId: googleAdsAccountId!, googleAdsAccountName })
      ).then(
        (value) => value.meta.requestStatus === 'fulfilled' && resetAndClose()
      )
  }

  const SubmitButton = (
    <CustomSubmitButton
      disabled={errorMode && !isValid}
      submitting={
        createState.status === 'loading' || updateState.status === 'loading'
      }
      title="Save"
      onClickHandler={handleFormSubmit}
    />
  )

  return (
    <CustomModal
      isOpen={props.isOpen}
      onClose={props.onClose}
      title={props.title}
      content={props.content}
      submitButton={SubmitButton}
    >
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

            {(createState.status === 'failed' ||
              updateState.status === 'failed') && (
              <Alert status="error">
                <AlertIcon />
                {createState.errorMessage ?? updateState.errorMessage}
              </Alert>
            )}
          </Stack>
        </form>
      </Box>
    </CustomModal>
  )
}

export default CreateUpdateAccountModal
