import React, { createContext } from 'react'

export const ModalDialogContentContext = createContext({
    modalDialogContent: undefined,
    setModalDialogContent: () => {}
})
