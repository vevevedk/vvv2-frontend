import { Alert, AlertIcon, Box, Stack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import {
  UpdateClientAsync,
  selectUpdateClientState,
  selectClientById,
  selectCreateClientState,
  CreateClientAsync,
} from '../../redux/clientsSlice'
import CustomModal from '../CustomModal'
import CustomInputField, { InputFieldType } from './inputs/CustomInputField'
import CustomSubmitButton from './inputs/CustomSubmitButton'

interface Props {
  isOpen: boolean
  onClose: () => void
  title: string
  content: string
  clientId: number | null // if null, create new client
}
const CreateUpdateClientModal = (props: Props) => {
  const [name, setName] = React.useState('')
  const [nameValidated, setNameValidated] = React.useState(false)
  const [errorMode, setErrorMode] = useState(false)
  const [loadedClientId, setLoadedClientId] = React.useState<number | null>(
    null
  )

  const createState = useAppSelector(selectCreateClientState)
  const updateState = useAppSelector(selectUpdateClientState)
  const clientToUpdate = useAppSelector(selectClientById(props.clientId))
  const dispatch = useAppDispatch()
  const isValid = nameValidated

  useEffect(() => {
    // dont load the same client twice or it will overwrite input fields
    if (clientToUpdate && loadedClientId !== clientToUpdate.id) {
      setLoadedClientId(clientToUpdate.id)
      setName(clientToUpdate.name)
    }
  }, [clientToUpdate, loadedClientId])

  const resetAndClose = () => {
    setName('')
    setErrorMode(false)
    setNameValidated(false)
    props.onClose()
  }

  const handleFormSubmit = () => {
    if (!isValid) {
      setErrorMode(true)
      return
    }

    setErrorMode(false)

    if (!!clientToUpdate)
      dispatch(
        UpdateClientAsync({
          id: clientToUpdate!.id,
          body: { name },
        })
      ).then(
        (value) => value.meta.requestStatus === 'fulfilled' && resetAndClose()
      )
    else
      dispatch(CreateClientAsync({ name })).then(
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
              label="Name"
              name="clientName"
              type={InputFieldType.text}
              onChangeHandler={setName}
              onIsValidChangeHandler={setNameValidated}
              value={name}
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

export default CreateUpdateClientModal
