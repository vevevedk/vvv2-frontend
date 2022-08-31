import { Button, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react"
import { getDecodedJwtToken } from "../../api/jwtTokenHelper"
import { localStorageAuthUserKey } from "../../api/localStorageAuthUserKey"
import { appRoutes } from "../../appRoutes"

export default function AdminMenu() {
  const jwt = getDecodedJwtToken()

  const logoutHandler = () => {
    localStorage.removeItem(localStorageAuthUserKey)
    window.location.href = appRoutes.login;
  }

  return (
    <Menu>
      <MenuButton as={Button} rounded={"full"} variant={"link"} cursor={"pointer"} minW={0}>
        {jwt?.clientName}
        {" - "}
        {jwt?.fullName}
      </MenuButton>
      <MenuList>
        <MenuItem onClick={logoutHandler}>Log ud</MenuItem>
      </MenuList>
    </Menu>
  )
}
