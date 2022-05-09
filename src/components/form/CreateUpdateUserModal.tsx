import { Alert, AlertIcon, Box, Stack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { selectJwtIsAdmin } from '../../redux/loginSlice'
import {
  UpdateUserAsync,
  selectUpdateUserState,
  selectUserById,
  selectCreateUserState,
  CreateUserAsync,
} from '../../redux/usersSlice'
import CustomModal from '../CustomModal'
import CustomCheckbox from './inputs/CustomCheckbox'
import CustomInputField, { InputFieldType } from './inputs/CustomInputField'
import CustomSubmitButton from './inputs/CustomSubmitButton'

interface Props {
  isOpen: boolean
  onClose: () => void
  title: string
  content: string
  userId: number | null // if null, create new account
}
const CreateUpdateUserModal = (props: Props) => {
  const [fullName, setFullName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [isAdmin, setIsAdmin] = React.useState(false)
  const [fullNameValidated, setFullNameValidated] = React.useState(false)
  const [emailValidated, setEmailValidated] = React.useState(false)
  const [errorMode, setErrorMode] = useState(false)
  const [loadedUserId, setLoadedUserId] = React.useState<number | null>(null)

  const createState = useAppSelector(selectCreateUserState)
  const updateState = useAppSelector(selectUpdateUserState)
  const isCurrentUserAdmin = useAppSelector(selectJwtIsAdmin) || false
  const userToUpdate = useAppSelector(selectUserById(props.userId))
  const dispatch = useAppDispatch()
  const isValid = fullNameValidated && emailValidated

  useEffect(() => {
    // dont load the same account twice or it will overwrite input fields
    if (userToUpdate && loadedUserId !== userToUpdate.id) {
      setLoadedUserId(userToUpdate.id)
      setEmail(userToUpdate.email)
      setFullName(userToUpdate.fullName || '')
    }
  }, [userToUpdate, loadedUserId])

  const resetAndClose = () => {
    setEmail('')
    setFullName('')
    setIsAdmin(false)
    setErrorMode(false)
    setFullNameValidated(false)
    setEmailValidated(false)
    props.onClose()
  }

  const handleFormSubmit = () => {
    if (!isValid) {
      setErrorMode(true)
      return
    }

    setErrorMode(false)

    if (!!userToUpdate)
      dispatch(
        UpdateUserAsync({
          id: userToUpdate!.id,
          body: { email, fullName, isAdmin },
        })
      ).then(
        (value) => value.meta.requestStatus === 'fulfilled' && resetAndClose()
      )
    else
      dispatch(CreateUserAsync({ email, fullName, isAdmin })).then(
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
              label="Fullname"
              name="userFullName"
              type={InputFieldType.text}
              onChangeHandler={setFullName}
              onIsValidChangeHandler={setFullNameValidated}
              value={fullName}
              placeholder="Donald Trump"
              displayErrorIfInvalid={errorMode}
              minLength={2} // TODO use openapi generated object
            />

            <CustomInputField
              label="Email"
              name="userEmail"
              type={InputFieldType.email}
              onChangeHandler={setEmail}
              onIsValidChangeHandler={setEmailValidated}
              value={email}
              placeholder="donald@trump.com"
              displayErrorIfInvalid={errorMode}
            />

            {isCurrentUserAdmin && (
              <CustomCheckbox
                label="Administrator"
                name="isAdmin"
                tooltip="If true, the user will be able to log in as an administrator and manage all clients."
                onChangeHandler={setIsAdmin}
                isChecked={isAdmin}
              />
            )}

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

export default CreateUpdateUserModal
