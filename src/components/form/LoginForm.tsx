import { Alert, AlertIcon, Box, Stack } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import React, { FormEvent, useEffect, useState } from "react"
import { login } from "../../api/mutations/login/login"
import { appRoutes } from "../../appRoutes"
import CustomInputField, { InputFieldType } from "./inputs/CustomInputField"
import CustomSubmitButton from "./inputs/CustomSubmitButton"

const LoginForm = () => {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [emailValidated, setEmailValidated] = React.useState(false)
  const [passwordValidated, setPasswordValidated] = React.useState(false)
  const [errorMode, setErrorMode] = useState(false)
  const [tempLockout, setTempLockout] = useState(false)

  const loginMutation = useMutation(login)

  useEffect(() => {
    if (tempLockout === false) return
    let timeout = setTimeout(() => setTempLockout(false), 3000)
    return () => clearTimeout(timeout)
  }, [tempLockout])

  const isValid = emailValidated && passwordValidated
  const isEligible = !tempLockout && !loginMutation.isLoading

  let handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isValid) {
      setErrorMode(true)
      return
    }

    setErrorMode(false)
    setTempLockout(true)
    loginMutation.mutate({ email, password }, { onSuccess: () => (window.location.href = appRoutes.home) })
  }

  return (
    <Box>
      <form onSubmit={handleFormSubmit}>
        <Stack spacing={3}>
          <CustomInputField
            label="Email"
            name="email"
            type={InputFieldType.email}
            onChangeHandler={setEmail}
            onIsValidChangeHandler={setEmailValidated}
            value={email}
            placeholder="donald@trump.com"
            displayErrorIfInvalid={errorMode}
            minLength={2} // TODO use object
          />
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

          <CustomSubmitButton disabled={!isEligible} submitting={loginMutation.isLoading} title="Login" />

          {loginMutation.isError && (
            <Alert status="error">
              <AlertIcon />
              {(loginMutation.error as any).message}
            </Alert>
          )}
        </Stack>
      </form>
    </Box>
  )
}

export default LoginForm
