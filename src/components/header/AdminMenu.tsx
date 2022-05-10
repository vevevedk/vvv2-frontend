import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { logout, selectJwtDecoded } from '../../redux/loginSlice'

export default function AdminMenu() {
  const dispatch = useAppDispatch()
  const jwt = useAppSelector(selectJwtDecoded)
  return <Menu>
    <MenuButton
      as={Button}
      rounded={'full'}
      variant={'link'}
      cursor={'pointer'}
      minW={0}
    >
      {jwt?.clientName}
      {' - '}
      {jwt?.fullName}
    </MenuButton>
    <MenuList>
      <MenuItem onClick={() => dispatch(logout())}>Log ud</MenuItem>
    </MenuList>
  </Menu>
}
