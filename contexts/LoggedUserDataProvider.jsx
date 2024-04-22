import React, { useState } from 'react'
import { LoggedUserDataContext } from './LoggedUserDataContext.jsx'

export const LoggedUserDataProvider = ({ children }) => {
    const [loggedUserData, setLoggedUserData] = useState(undefined)

    return (
        <LoggedUserDataContext.Provider value={{ loggedUserData, setLoggedUserData }}>
            {children}
        </LoggedUserDataContext.Provider>
    )
}
