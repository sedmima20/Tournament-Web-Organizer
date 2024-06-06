import React, { useState } from 'react'
import { ModalDialogContentContext } from './ModalDialogContentContext.jsx'

export const ModalDialogContentProvider = ({ children }) => {
    const [modalDialogContent, setModalDialogContent] = useState(undefined)

    return (
        <ModalDialogContentContext.Provider value={{ modalDialogContent, setModalDialogContent }}>
            {children}
        </ModalDialogContentContext.Provider>
    )
}
