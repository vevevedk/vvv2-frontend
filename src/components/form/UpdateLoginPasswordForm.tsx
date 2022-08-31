import { Alert, AlertIcon, Box, Stack } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import React, { FormEvent, useEffect, useState } from "react"
import { updateLoginPassword } from "../../api/mutations/login/updateLoginPassword"
import CustomInputField, { InputFieldType } from "./inputs/CustomInputField"
import CustomSubmitButton from "./inputs/CustomSubmitButton"

interface Props {
  resetPasswordToken: string
}

const UpdateLoginPasswordForm = (props: Props) => {
  const [password, setPassword] = React.useState("")
  const [passwordValidated, setPasswordValidated] = React.useState(false)
  const [errorMode, setErrorMode] = useState(false)
  const [tempLockout, setTempLockout] = useState(false)

  const updateLoginPasswordMutation = useMutation(updateLoginPassword)

  useEffect(() => {
    if (tempLockout === false) return
    let timeout = setTimeout(() => setTempLockout(false), 3000)
    return () => clearTimeout(timeout)
  }, [tempLockout])

  const isValid = passwordValidated
  const isEligible = !tempLockout && updateLoginPasswordMutation.isLoading

  let handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isValid) {
      setErrorMode(true)
      return
    }

    setErrorMode(false)
    setTempLockout(true)
    updateLoginPasswordMutation.mutate({
      password,
      resetPasswordToken: props.resetPasswordToken,
    })
  }

  return (
    <Box>
      <form onSubmit={handleFormSubmit}>
        <Stack spacing={3}>
          <CustomInputField
            label="Password"
            name="password"
            type={InputFieldType.password}
            onChangeHandler={setPassword}
            onIsValidChangeHandler={setPasswordValidated}
            value={password}
            placeholder="testpassword"
            displayErrorIfInvalid={errorMode}
            minLength={2}
          />

          <CustomSubmitButton disabled={!isEligible} submitting={updateLoginPasswordMutation.isLoading} title="Update Password" />

          {updateLoginPasswordMutation.isError && (
            <Alert status="error">
              <AlertIcon />
              {(updateLoginPasswordMutation.error as Error).message}
            </Alert>
          )}

          {updateLoginPasswordMutation.isSuccess && (
            <Alert status="success">
              <AlertIcon />
              Your password has been updated. Please login again.
            </Alert>
          )}
        </Stack>
      </form>
    </Box>
  )
}

export default UpdateLoginPasswordForm
