import { Button, HStack, Spinner, Stack, Text, VStack } from "@chakra-ui/react"
import React from "react"
import { JobResponse, JobStatusEnum } from "../../api/generated"

interface Props {
  jobs: JobResponse[]
}

const JobListPopoverBody = (props: Props) => {
  const [mode, setMode] = React.useState<"pending" | "running" | "completed">("running")

  const pendingJobs = props.jobs.filter((x) => x.jobStatus === JobStatusEnum.PENDING)
  const runningJobs = props.jobs.filter((x) => x.jobStatus === JobStatusEnum.RUNNING)
  const completedJobsPastWeek = props.jobs.filter((x) => x.jobStatus === JobStatusEnum.DONE)

  const jobsToDisplay = (
    mode === "pending" ? pendingJobs : mode === "running" ? runningJobs : completedJobsPastWeek
  ).sort((a, b) => new Date(b.lastModifiedDate).getTime() - new Date(a.lastModifiedDate).getTime())

  return (
    <Stack spacing={3}>
      <HStack spacing={3}>
        <Button
          size={"xs"}
          colorScheme={"orange"}
          variant={mode === "running" ? "solid" : "outline"}
          onClick={() => setMode("running")}
        >
          Running ({runningJobs.length})
        </Button>
        <Button
          size={"xs"}
          colorScheme={"orange"}
          variant={mode === "pending" ? "solid" : "outline"}
          onClick={() => setMode("pending")}
        >
          Pending ({pendingJobs.length})
        </Button>
        <Button
          size={"xs"}
          colorScheme={"orange"}
          variant={mode === "completed" ? "solid" : "outline"}
          onClick={() => setMode("completed")}
        >
          Completed ({completedJobsPastWeek.length})
        </Button>
      </HStack>

      {jobsToDisplay.length === 0 && <Text>No jobs found</Text>}
      {jobsToDisplay.map((job) => (
        <HStack key={job.id} justifyContent={"space-between"} alignItems={"flex-start"}>
          <Stack spacing={0}>
            <Text fontWeight={"semibold"}>{job.featureName}</Text>
            <Text fontSize={"xs"}>Created: {new Date(job.createdDate).toLocaleString()}</Text>
          </Stack>
          {job.jobStatus === JobStatusEnum.PENDING && (
            <Text fontSize={"smaller"} fontStyle={"italic"}>
              Pending
            </Text>
          )}
          {job.jobStatus === JobStatusEnum.RUNNING && (
            <VStack spacing={0} alignItems={"flex-end"}>
              <HStack>
                <Spinner size={"sm"} colorScheme="white" />
                <Text fontSize={"smaller"} fontStyle={"italic"}>
                  Running
                </Text>
              </HStack>
              <Text fontSize={"xs"} fontStyle={"italic"}>
                ({Math.round((new Date().getTime() - new Date(job.lastModifiedDate).getTime()) / 60000)} min)
              </Text>
            </VStack>
          )}
        </HStack>
      ))}
    </Stack>
  )
}

export default JobListPopoverBody
