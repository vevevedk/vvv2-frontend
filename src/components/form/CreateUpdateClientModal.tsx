import { Alert, AlertIcon, Box, Stack } from "@chakra-ui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
import { ClientResponse } from "../../api/generated"
import { createClient } from "../../api/mutations/clients/createClient"
import { updateClient } from "../../api/mutations/clients/updateClient"
import { getClients, getClientsQueryKey } from "../../api/queries/getClients"
import CustomModal from "../CustomModal"
import CustomInputField, { InputFieldType } from "./inputs/CustomInputField"
import CustomSubmitButton from "./inputs/CustomSubmitButton"

interface Props {
  isOpen: boolean
  onClose: () => void
  title: string
  content: string
  clientId: number | null // if null, create new client
}
const CreateUpdateClientModal = (props: Props) => {
  const [name, setName] = React.useState("")
  const [nameValidated, setNameValidated] = React.useState(false)
  const [errorMode, setErrorMode] = useState(false)
  const [loadedClientId, setLoadedClientId] = React.useState<number | null>(null)

  const requstBody = { name }

  const queryClient = useQueryClient()
  const createClientMutation = useMutation(createClient)
  const updateClientMutation = useMutation(updateClient)
  const clientToUpdate = useQuery([getClientsQueryKey], getClients).data?.find((a) => a.id === props.clientId)

  const isValid = nameValidated

  useEffect(() => {
    // dont load the same client twice or it will overwrite input fields
    if (clientToUpdate && loadedClientId !== clientToUpdate.id) {
      setLoadedClientId(clientToUpdate.id)
      setName(clientToUpdate.name)
    }
  }, [clientToUpdate, loadedClientId])

  const resetAndClose = () => {
    setName("")
    setNameValidated(false)
    setErrorMode(false)
    setLoadedClientId(null)
    props.onClose()
  }

  const handleFormSubmit = () => {
    if (!isValid) {
      setErrorMode(true)
      return
    }

    setErrorMode(false)

    if (!!clientToUpdate)
      updateClientMutation.mutate(
        {
          id: clientToUpdate!.id,
          body: requstBody,
        },
        {
          onSuccess: (response) => {
            queryClient.setQueryData<ClientResponse[]>([getClientsQueryKey], (oldData) =>
              oldData!.map((client) => (client.id === response.id ? response : client))
            )
            resetAndClose()
          },
        }
      )
    else
      createClientMutation.mutate(requstBody, {
        onSuccess: (response) => {
          queryClient.setQueryData<ClientResponse[]>([getClientsQueryKey], (old) => [...old!, response])
          resetAndClose()
        },
      })
  }

  const SubmitButton = (
    <CustomSubmitButton
      disabled={errorMode && !isValid}
      submitting={createClientMutation.isLoading || updateClientMutation.isLoading}
      title="Save"
      colorScheme="blue"
      onClickHandler={handleFormSubmit}
    />
  )

  return (
    <CustomModal isOpen={props.isOpen} onClose={props.onClose} title={props.title} content={props.content} submitButton={SubmitButton}>
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
              minLength={2}
            />

            {(createClientMutation.isError || updateClientMutation.isError) && (
              <Alert status="error">
                <AlertIcon />
                {(createClientMutation.error as Error)?.message ?? (updateClientMutation.error as Error)?.message}
              </Alert>
            )}
          </Stack>
        </form>
      </Box>
    </CustomModal>
  )
}

export default CreateUpdateClientModal
