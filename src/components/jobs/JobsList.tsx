import { Box, Button, Container, Heading, HStack, Spinner, Text } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { JobFeatureNameEnum, JobStatusEnum } from "../../api/generated"
import { getJobs, getJobsQueryKey } from "../../api/queries/getJobs"
import CustomPopover from "../CustomPopover"
import JobListPopoverBody from "./JobListPopoverBody"

interface Props {
  featureName: JobFeatureNameEnum
}

const JobsList = (props: Props) => {
  const getJobsQuery = useQuery([getJobsQueryKey, props.featureName], () => getJobs(props.featureName), {
    refetchInterval: 3000,
  })

  const jobs = getJobsQuery.data || []
  const pendingJobs = jobs.filter((x) => x.jobStatus === JobStatusEnum.PENDING)
  const runningJobs = jobs.filter((x) => x.jobStatus === JobStatusEnum.RUNNING)
  const completedJobsPastWeek = jobs.filter(
    (x) =>
      x.jobStatus === JobStatusEnum.DONE &&
      new Date(x.lastModifiedDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  )

  return (
    <Container>
      <HStack justifyContent={"space-between"}>
        <Heading size="sm">Jobs list</Heading>

        <CustomPopover
          header="All jobs"
          trigger={
            <Button size={"xs"} variant={"ghost"}>
              View all
            </Button>
          }
          body={<JobListPopoverBody jobs={jobs} />}
        />
      </HStack>

      <Box>
        {getJobsQuery?.isLoading && <Spinner size="sm" />}
        {!getJobsQuery?.isLoading && !!getJobsQuery.data && (
          <>
            <Text fontStyle="italic" fontSize={"smaller"}>
              {pendingJobs.length} jobs pending
            </Text>
            <HStack>
              <Text fontStyle="italic" fontSize={"smaller"}>
                {runningJobs.length} jobs running
              </Text>
              {runningJobs.length > 0 && <Spinner size={"xs"} colorScheme="blue" />}
            </HStack>
            <Text fontStyle="italic" fontSize={"smaller"}>
              {completedJobsPastWeek.length} jobs completed past week
            </Text>
          </>
        )}
      </Box>
    </Container>
  )
}

export default JobsList
