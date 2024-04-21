import React, { createContext } from 'react'

export const AlertContentContext = createContext({
    alertContent: undefined,
    setAlertContent: () => {}
})
