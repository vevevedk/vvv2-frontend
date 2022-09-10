import { FormControl, FormLabel, Spinner } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { Select } from "chakra-react-select"
import { AccountResponse } from "../../../api/generated"
import { getAccounts, getAccountsQueryKey } from "../../../api/queries/getAccounts"

interface Props {
  label: string
  name: string
  isRequired?: boolean
  onChange: (value?: AccountResponse) => void
  value?: AccountResponse
}

export default function AccountSelector(props: Props) {
  const accountsQuery = useQuery([getAccountsQueryKey], getAccounts)

  return (
    <FormControl isRequired={props.isRequired}>
      <FormLabel htmlFor={props.name}>{props.label}</FormLabel>
      {!!accountsQuery.isLoading || !accountsQuery.data ? (
        <Spinner size="sm" />
      ) : (
        <Select
          chakraStyles={{
            container: (provided, state) => ({
              ...provided,
              width: "200px",
            }),
          }}
          id={props.name}
          size="sm"
          value={{ label: props.value?.googleAdsAccountName, value: props.value }}
          options={accountsQuery.data.map((x) => ({ label: x.googleAdsAccountName, value: x }))}
          onChange={(e) => props.onChange(e?.value)}
        />
      )}
    </FormControl>
  )
}
