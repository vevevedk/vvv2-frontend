import { ReactNode } from "react"
import { Box, Flex, HStack, Link, IconButton, useDisclosure, useColorModeValue, Stack } from "@chakra-ui/react"
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons"
import { appRoutes } from "../../appRoutes"
import { NavLink } from "react-router-dom"
import AdminMenu from "./AdminMenu"
import ClientImpersonationSelector from "./ClientImpersonationSelector"
import { getDecodedJwtToken } from "../../api/jwtTokenHelper"

const Links: { title: string; route: string; requireAdmin?: boolean }[] = [
  { title: "Home", route: appRoutes.home },
  { title: "Users", route: appRoutes.users },
  { title: "Accounts", route: appRoutes.accounts },
  { title: "Clients", route: appRoutes.clients, requireAdmin: true },
  { title: "Search Term Checker", route: appRoutes.searchTermChecker },
]

const MenuLink = ({ children, to }: { children: ReactNode; to: string }) => (
  <Link
    as={NavLink}
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    _activeLink={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    outline={undefined}
    to={to}
  >
    {children}
  </Link>
)

export default function Header() {
  const jwt = getDecodedJwtToken()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Box as={"header"} bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
            {Links.filter((x) => !x.requireAdmin || jwt?.isAdmin === true).map((link) => (
              <MenuLink to={link.route} key={link.title}>
                {link.title}
              </MenuLink>
            ))}
          </HStack>
          <Box display={{ base: "none", md: "flex" }}>{jwt?.isAdmin && <ClientImpersonationSelector />}</Box>
          {jwt?.isAdmin && <AdminMenu />}
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <MenuLink to={link.route} key={link.title}>
                  {link.title}
                </MenuLink>
              ))}
              <Box display={{ base: "flex", md: "none" }}>{jwt?.isAdmin && <ClientImpersonationSelector />}</Box>
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  )
}
