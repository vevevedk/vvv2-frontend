import { FormControl, FormLabel, Spinner } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { Select } from "chakra-react-select"
import { AccountResponse } from "../../../api/generated"
import { getAccounts, getAccountsQueryKey } from "../../../api/queries/getAccounts"

interface Props {
  label: string
  name: string
  isRequired?: boolean
  displayErrorIfInvalid?: boolean
  onChange: (value?: AccountResponse) => void
  value?: AccountResponse
}

export default function AccountSelector(props: Props) {
  const accountsQuery = useQuery([getAccountsQueryKey], getAccounts)

  return (
    <FormControl isRequired={props.isRequired}>
      <FormLabel htmlFor={props.name}>{props.label}</FormLabel>
      {!!accountsQuery.isFetching && <Spinner size="sm" />}
      {!accountsQuery.isFetching && !!accountsQuery.data && (
        <Select
          chakraStyles={{
            control: (provided, state) => ({
              ...provided,
              width: "200px",
              height: "40px",
            }),
          }}
          id={props.name}
          isRequired={props.isRequired}
          isInvalid={props.displayErrorIfInvalid && !props.value && props.isRequired}
          size="sm"
          value={{ label: props.value?.googleAdsAccountName, value: props.value }}
          options={accountsQuery.data.map((x) => ({ label: x.googleAdsAccountName, value: x }))}
          onChange={(e) => props.onChange(e?.value)}
        />
      )}
    </FormControl>
  )
}
