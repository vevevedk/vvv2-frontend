import { ChevronDownIcon } from "@chakra-ui/icons"
import { Button, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react"

interface Props {
  title: string
  actions: { disabled?: boolean; onClick: () => void; name: string }[]
}

export default function ActionMenu(props: Props) {
  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        {props.title}
      </MenuButton>
      <MenuList>
        {props.actions.map((action) => (
          <MenuItem key={action.name} isDisabled={action.disabled} onClick={action.onClick}>
            {action.name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}
