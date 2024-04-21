import React, { useEffect, useRef, useState } from 'react'
import { AlertContentContext } from './AlertContentContext.jsx'

export const AlertContentProvider = ({ children }) => {
    const [alertContent, setAlertContent] = useState(undefined)
    const timeoutRef = useRef(undefined)

    // Skrytí alertu po 20 sekundách
    useEffect(() => {
        if (alertContent !== undefined) {
            timeoutRef.current = setTimeout(() => {
                setAlertContent(undefined)
            }, 20000)
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
                timeoutRef.current = undefined
            }
        }
    }, [alertContent])

    return (
        <AlertContentContext.Provider value={{ alertContent, setAlertContent }}>
            {children}
        </AlertContentContext.Provider>
    )
}
