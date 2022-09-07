import { Spinner } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { Select } from "chakra-react-select"
import { getAccounts, getAccountsQueryKey } from "../../../api/queries/getAccounts"

interface Props{
  onChange: (id?: string) => void
  selectedId?: string
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
          value={props.selectedId as any}
          options={accountsQuery.data.map((c) => ({
            label: c.googleAdsAccountName,
            value: c.googleAdsAccountId,
          }))}
          onChange={(e) => props.onChange(e?.value)}
        />
      )}
    </>
  )
}
