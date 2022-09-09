import { Spinner } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { Select } from "chakra-react-select"
import { AccountResponse } from "../../../api/generated"
import { getAccounts, getAccountsQueryKey } from "../../../api/queries/getAccounts"

interface Props {
  onChange: (value?: AccountResponse) => void
  value?: AccountResponse
}

export default function AccountSelector(props: Props) {
  const accountsQuery = useQuery([getAccountsQueryKey], getAccounts)

  return (
    <>
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
          size="sm"
          value={{ label: props.value?.googleAdsAccountName, value: props.value }}
          options={accountsQuery.data.map((x) => ({ label: x.googleAdsAccountName, value: x }))}
          onChange={(e) => props.onChange(e?.value)}
        />
      )}
    </>
  )
}
