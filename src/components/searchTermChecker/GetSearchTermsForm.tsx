import { Box, FormLabel, HStack, Stack } from "@chakra-ui/react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import React from "react"
import { AccountResponse } from "../../api/generated"
import { getSearchTerms, getSearchTermsQueryKey } from "../../api/queries/getSearchTerms"
import AccountSelector from "../form/inputs/AccountSelector"
import CustomInputNumber from "../form/inputs/CustomInputNumber"
import CustomSubmitButton from "../form/inputs/CustomSubmitButton"

const GetSearchTermsForm = () => {
  const [chosenAccount, setChosenAccount] = React.useState<AccountResponse>()
  const [lookbackDays, setLookbackDays] = React.useState<number>()
  const [errorMode, setErrorMode] = React.useState(false)

  const isValidForSubmit = !!chosenAccount && !!lookbackDays

  const getSearchTermsQuery = useQuery(
    [getSearchTermsQueryKey],
    () => getSearchTerms(chosenAccount!.googleAdsAccountId, lookbackDays!),
    { enabled: false, staleTime: 0 }
  )

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isValidForSubmit) {
      setErrorMode(false)
      getSearchTermsQuery.refetch()
    } else {
      setErrorMode(true)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <HStack spacing={5} alignItems="flex-start">
        <Box>
          <AccountSelector
            label="Account"
            name="account"
            isRequired={true}
            value={chosenAccount}
            displayErrorIfInvalid={errorMode}
            onChange={setChosenAccount}
          />
        </Box>
        <Box>
          <CustomInputNumber
            label="Lookback days"
            name="lookbackDays"
            isRequired={true}
            displayErrorIfInvalid={errorMode}
            value={lookbackDays}
            onChangeHandler={setLookbackDays}
          />
        </Box>
        <Box alignSelf={"flex-end"}>
          <CustomSubmitButton
            disabled={errorMode && !isValidForSubmit}
            submitting={getSearchTermsQuery.isFetching}
            colorScheme="blue"
            title="Fetch Search Terms"
            loadingText="Fetching..."
          />
        </Box>
      </HStack>
    </form>
  )
}

export default GetSearchTermsForm
