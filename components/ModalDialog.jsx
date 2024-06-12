import React, { useEffect, useRef } from 'react'

export default function ModalDialog(props) {
    const dialogRef = useRef(undefined)

    // Zachytávání události zavření dialogového okna pro případ, že k tomu dojde jiným způsobem, než destrukcí komponenty (např. zmáčknutím klávesy Esc). Nadřazená komponenta tuto událost zachytí a destrukci může provést dodatečně.
    function handleModalDialogClose() {
        if (props.onClose) {
            props.onClose()
        }
    }

    // Automatické otevření vanilla HTML/JS modálního dialogového okna při vyrenderování komponenty
    useEffect(() => {
        dialogRef.current.showModal()
    }, [])

    return (
        <dialog ref={dialogRef} onClose={handleModalDialogClose}>
            {props.children}
        </dialog>
    )
}
