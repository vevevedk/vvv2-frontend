import { Spinner } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { ChakraStylesConfig, Select } from 'chakra-react-select'
import { AssumeClientAsync, useClients } from '../../redux/clientsSlice'
import { selectJwtClient } from '../../redux/loginSlice'

export default function ClientSelector() {
  const dispatch = useAppDispatch()
  const client = useAppSelector(selectJwtClient)
  const { clients, status } = useClients()

  const chakraStyles: ChakraStylesConfig = {
    container: (provided, state) => ({
      ...provided,
      width: "200px"
    })
  };

  return (
    <>
      {status === 'loading' || client === undefined ? (
        <Spinner size="sm" />
      ) : (
        <Select
          chakraStyles={chakraStyles}
          size="sm"
          defaultValue={{label: client?.clientName, value: client?.clientId}}
          options={clients.map((c) => ({
            label: c.name,
            value: c.id,
          }))}
          onChange={(e: any) => {
            e?.value && dispatch(AssumeClientAsync(e.value))
          }}
        />
      )}
    </>
  )
}
