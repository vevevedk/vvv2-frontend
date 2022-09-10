import { Alert, AlertIcon, Box, Stack } from "@chakra-ui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
import { UserResponse } from "../../api/generated"
import { getDecodedJwtToken } from "../../api/jwtTokenHelper"
import { createUser } from "../../api/mutations/users/createUser"
import { updateUser } from "../../api/mutations/users/updateUser"
import { getUsers, getUsersQueryKey } from "../../api/queries/getUsers"
import CustomModal from "../CustomModal"
import CustomInputCheckbox from "./inputs/CustomInputCheckbox"
import CustomInputField, { InputFieldType } from "./inputs/CustomInputField"
import CustomSubmitButton from "./inputs/CustomSubmitButton"

interface Props {
  isOpen: boolean
  onClose: () => void
  title: string
  content: string
  userId: number | null // if null, create new account
}
const CreateUpdateUserModal = (props: Props) => {
  const [fullName, setFullName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [isAdmin, setIsAdmin] = React.useState(false)
  const [fullNameValidated, setFullNameValidated] = React.useState(false)
  const [emailValidated, setEmailValidated] = React.useState(false)
  const [errorMode, setErrorMode] = useState(false)
  const [loadedUserId, setLoadedUserId] = React.useState<number | null>(null)

  const requestBody = { email, fullName, isAdmin }

  const queryClient = useQueryClient()
  const createUserMutation = useMutation(createUser)
  const updateUserMutation = useMutation(updateUser)
  const userToUpdate = useQuery([getUsersQueryKey], getUsers).data?.find((a) => a.id === props.userId)

  const token = getDecodedJwtToken()
  const isCurrentUserAdmin = token?.isAdmin === true
  const isValid = fullNameValidated && emailValidated

  useEffect(() => {
    // dont load the same account twice or it will overwrite input fields
    if (userToUpdate && loadedUserId !== userToUpdate.id) {
      setLoadedUserId(userToUpdate.id)
      setEmail(userToUpdate.email)
      setFullName(userToUpdate.fullName || "")
      setIsAdmin(userToUpdate.isAdmin)
    }
  }, [userToUpdate, loadedUserId])

  const resetAndClose = () => {
    setFullName("")
    setEmail("")
    setIsAdmin(false)
    setFullNameValidated(false)
    setEmailValidated(false)
    setErrorMode(false)
    setLoadedUserId(null)
    props.onClose()
  }

  const handleFormSubmit = () => {
    if (!isValid) {
      setErrorMode(true)
      return
    }

    setErrorMode(false)

    if (!!userToUpdate)
      updateUserMutation.mutate(
        {
          id: userToUpdate!.id,
          body: requestBody,
        },
        {
          onSuccess: (response) => {
            queryClient.setQueryData<UserResponse[]>([getUsersQueryKey], (oldData) =>
              oldData!.map((user) => (user.id === response.id ? response : user))
            )
            resetAndClose()
          },
        }
      )
    else
      createUserMutation.mutate(requestBody, {
        onSuccess: (response) => {
          queryClient.setQueryData<UserResponse[]>([getUsersQueryKey], (old) => [...old!, response])
          resetAndClose()
        },
      })
  }

  const SubmitButton = (
    <CustomSubmitButton
      disabled={errorMode && !isValid}
      submitting={createUserMutation.isLoading || updateUserMutation.isLoading}
      title="Save"
      colorScheme="blue"
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
              minLength={2}
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
              <CustomInputCheckbox
                label="Administrator"
                name="isAdmin"
                tooltip="If true, the user will be able to log in as an administrator and manage all clients."
                onChangeHandler={(value) => setIsAdmin(value === "checked")}
                value={isAdmin === true ? "checked" : "unchecked"}
              />
            )}

            {(createUserMutation.isError || updateUserMutation.isError) && (
              <Alert status="error">
                <AlertIcon />
                {(createUserMutation.error as Error)?.message ?? (updateUserMutation.error as Error).message}
              </Alert>
            )}
          </Stack>
        </form>
      </Box>
    </CustomModal>
  )
}

export default CreateUpdateUserModal
