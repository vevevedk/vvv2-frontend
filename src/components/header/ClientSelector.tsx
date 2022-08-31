import { Spinner } from "@chakra-ui/react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Select } from "chakra-react-select"
import { getDecodedJwtToken } from "../../api/jwtTokenHelper"
import { assumeClient } from "../../api/mutations/clients/assumeClient"
import { getClients, getClientsQueryKey } from "../../api/queries/getClients"

export default function ClientSelector() {
  const token = getDecodedJwtToken()
  const clientsQuery = useQuery([getClientsQueryKey], getClients)
  const assumeClientMutation = useMutation(assumeClient, { onSuccess: () => window.location.reload() })

  return (
    <>
      {!!clientsQuery.isFetching || !token || !clientsQuery.data ? (
        <Spinner size="sm" />
      ) : (
        <Select
          chakraStyles={{
            container: (provided, state) => ({
              ...provided,
              width: "200px",
            }),
          }}
          size="sm"
          defaultValue={{ label: token.clientName, value: token.clientId }}
          options={clientsQuery.data.map((c) => ({
            label: c.name,
            value: c.id,
          }))}
          onChange={(e) => {
            e?.value && assumeClientMutation.mutate({ id: e.value })
          }}
        />
      )}
    </>
  )
}
