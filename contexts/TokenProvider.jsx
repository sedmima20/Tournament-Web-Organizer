import React from 'react'
import useLocalStorageState from '/hooks/useLocalStorageState.jsx'
import { TokenContext } from './TokenContext.jsx'

export const TokenProvider = ({ children }) => {
    const [token, setToken] = useLocalStorageState('authToken', '')

    return (
        <TokenContext.Provider value={{ token, setToken }}>
            {children}
        </TokenContext.Provider>
    )
}
