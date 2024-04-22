import React, { createContext } from 'react'

export const LoggedUserDataContext = createContext({
    loggedUserData: undefined,
    setLoggedUserData: () => {}
})
