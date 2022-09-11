import React from "react"
import { useNavigate } from "react-router-dom"
import { getDecodedJwtToken } from "../api/jwtTokenHelper"
import { localStorageAuthUserKey } from "../api/localStorageAuthUserKey"
import { appRoutes } from "../appRoutes"

export const useRequireAuth = () => {
  const navigate = useNavigate()

  React.useEffect(() => {
    var token = getDecodedJwtToken()

    // if token is expired or smaller than now + 5 minutes, remove token from local storage
    if (token && token.exp < Date.now() / 1000 + 300) {
      localStorage.removeItem(localStorageAuthUserKey)
      navigate(appRoutes.login)
    }

    if (!token) navigate(appRoutes.login)
  }, [navigate])
}
