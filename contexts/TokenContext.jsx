import React, { createContext } from 'react'

export const TokenContext = createContext({
    token: "",
    setToken: () => {}
})
