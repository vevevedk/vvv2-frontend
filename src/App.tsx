import { Route, Routes } from "react-router-dom"
import { appRoutes } from "./appRoutes"
import Header from "./components/header/Header"
import ForgotLoginPassword from "./pages/ForgotLoginPassword"
import Home from "./pages/Home"
import Login from "./pages/Login"
import UpdateLoginPassword from "./pages/UpdateLoginPassword"
import Accounts from "./pages/Accounts"
import Clients from "./pages/Clients"
import { getDecodedJwtToken } from "./api/jwtTokenHelper"
import SearchTermChecker from "./pages/SearchTermChecker"
import Users from "./pages/Users"

function App() {
  const isLoggedIn = !!getDecodedJwtToken()?.exp && new Date().getTime() < getDecodedJwtToken()!.exp * 1000

  return (
    <div>
      {isLoggedIn && <Header />}
      <Routes>
        <Route path={appRoutes.home} element={<Home />} />
        <Route path={appRoutes.users} element={<Users />} />
        <Route path={appRoutes.accounts} element={<Accounts />} />
        <Route path={appRoutes.clients} element={<Clients />} />
        <Route path={appRoutes.login} element={<Login />} />
        <Route path={appRoutes.forgotLoginPassword} element={<ForgotLoginPassword />} />
        <Route path={appRoutes.updateLoginPassword} element={<UpdateLoginPassword />} />
        <Route path={appRoutes.searchTermChecker} element={<SearchTermChecker />} />
      </Routes>
    </div>
  )
}

export default App
