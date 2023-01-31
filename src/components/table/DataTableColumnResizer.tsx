import { Box, Container } from "@chakra-ui/react"

export interface Props {
  resizeHandler: (event: unknown) => void
  isResizing: boolean
}

export default function DataTableColumnResizer(props: Props) {

  return (
    <Container
      role="group" // This is needed for _groupHover to work
      height="100%"
      paddingRight={0}
    >
      <Box
        onMouseDown={props.resizeHandler}
        onTouchStart={props.resizeHandler}
        height="100%"
        width="5px"
        background={props.isResizing ? "blue" : "rgba(0, 0, 0, 0.5)"}
        opacity={props.isResizing ? 1 : 0}
        cursor="col-resize"
        userSelect="none"
        

        style={{
          touchAction: "none",
        }}
        _groupHover={{
          opacity: 1,
        }}
      />
    </Container>
  )
}
