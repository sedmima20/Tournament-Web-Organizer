import React, { useEffect, useRef } from 'react'

export default function DialogBox(props) {
    const dialogRef = useRef(null)

    // Automatické otevření a zavření vanilla HTML/JS dialogového okna při vyrenderování a při destrukci komponenty
    useEffect(() => {
        dialogRef.current.showModal()

        return () => {
            if (dialogRef.current && dialogRef.current.open) {
                dialogRef.current.close()
            }
        }
    }, [])

    return (
        <dialog ref={dialogRef}>
            {props.children}
        </dialog>
    )
}
