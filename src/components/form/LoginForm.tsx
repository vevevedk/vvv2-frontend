import { Alert, AlertIcon, Box, Stack } from '@chakra-ui/react'
import React, { FormEvent, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { loginAsync, selectLoginState } from '../../redux/loginSlice'
import CustomInputField, { InputFieldType } from './inputs/CustomInputField'
import CustomSubmitButton from './inputs/CustomSubmitButton'

const LoginForm = () => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [emailValidated, setEmailValidated] = React.useState(false)
  const [passwordValidated, setPasswordValidated] = React.useState(false)
  const [errorMode, setErrorMode] = useState(false)
  const [tempLockout, setTempLockout] = useState(false)

  const loginState = useAppSelector(selectLoginState)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (tempLockout === false) return
    let timeout = setTimeout(() => setTempLockout(false), 3000)
    return () => clearTimeout(timeout)
  }, [tempLockout])

  const isValid = emailValidated && passwordValidated
  const isEligible = !tempLockout && loginState.status !== 'loading'

  let handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isValid) {
      setErrorMode(true)
      return
    }

    setErrorMode(false)
    setTempLockout(true)
    dispatch(loginAsync({ email, password }))
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

          <CustomSubmitButton
            disabled={!isEligible}
            submitting={loginState.status === 'loading'}
            title="Login"
          />

          {loginState.status === 'failed' && (
            <Alert status="error">
              <AlertIcon />
              {loginState.errorMessage}
            </Alert>
          )}
        </Stack>
      </form>
    </Box>
  )
}

export default LoginForm
