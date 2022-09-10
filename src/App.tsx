import { Route, Routes } from "react-router-dom"
import { appRoutes } from "./appRoutes"
import Header from "./components/header/Header"
import ForgotLoginPasswordPage from "./pages/ForgotLoginPasswordPage"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import UpdateLoginPasswordPage from "./pages/UpdateLoginPasswordPage"
import AccountsPage from "./pages/AccountsPage"
import ClientsPage from "./pages/ClientsPage"
import { getDecodedJwtToken } from "./api/jwtTokenHelper"
import SearchTermCheckerPage from "./pages/SearchTermCheckerPage"
import UsersPage from "./pages/UsersPage"
import { Container } from "@chakra-ui/react"

function App() {
  const isLoggedIn = !!getDecodedJwtToken()?.exp && new Date().getTime() < getDecodedJwtToken()!.exp * 1000

  return (
    <div>
      {isLoggedIn && <Header />}
      <Container paddingTop={"100px"} paddingBottom={"100px"} maxWidth="100%">
        <Routes>
          <Route path={appRoutes.home} element={<HomePage />} />
          <Route path={appRoutes.users} element={<UsersPage />} />
          <Route path={appRoutes.accounts} element={<AccountsPage />} />
          <Route path={appRoutes.clients} element={<ClientsPage />} />
          <Route path={appRoutes.login} element={<LoginPage />} />
          <Route path={appRoutes.forgotLoginPassword} element={<ForgotLoginPasswordPage />} />
          <Route path={appRoutes.updateLoginPassword} element={<UpdateLoginPasswordPage />} />
          <Route path={appRoutes.searchTermChecker} element={<SearchTermCheckerPage />} />
        </Routes>
      </Container>
    </div>
  )
}

export default App
