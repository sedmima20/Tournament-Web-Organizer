import React, { useEffect, useRef } from 'react'

export default function ModalDialog(props) {
    const dialogRef = useRef(undefined)

    function handleModalDialogClose() {
        if (props.onClose) {
            props.onClose()
        }
    }

    useEffect(() => {
        // Automatické otevření vanilla HTML/JS modálního dialogového okna při vyrenderování komponenty
        dialogRef.current.showModal()

        // Zachytávání události zavření dialogového okna pro případ, že k tomu dojde jiným způsobem, než destrukcí komponenty (např. zmáčknutím klávesy Esc). Nadřazená komponenta tuto událost zachytí a destrukci může provést dodatečně.
        dialogRef.current.addEventListener('close', handleModalDialogClose)

        return () => {
            if (dialogRef.current) {
                dialogRef.current.removeEventListener('close', handleModalDialogClose)
            }
        }
    }, [])

    return (
        <dialog ref={dialogRef}>
            {props.children}
        </dialog>
    )
}
