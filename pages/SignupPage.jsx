import React, { useContext, useEffect } from 'react'
import { TokenContext } from '/contexts/TokenContext.jsx'
import { AlertContentContext } from '/contexts/AlertContentContext.jsx'
import { LoggedUserDataContext } from '/contexts/LoggedUserDataContext.jsx'

export default function SignupPage() {
    const { token, setToken } = useContext(TokenContext)
    const { alertContent, setAlertContent } = useContext(AlertContentContext)
    const { loggedUserData, setLoggedUserData } = useContext(LoggedUserDataContext)

    // Kontrola, zda uživatel už náhodou není přihlášený
    useEffect(() => {
        if (token) {
            setAlertContent({ msg: 'Již jsi přihlášen(a) jako „' + (loggedUserData ? loggedUserData.username : 'načítání...') + '“. Vyplněním formuláře níže dojde k přepnutí uživatele.', severity: 'info' })
        }
    }, [token, loggedUserData])

    return (
        <>
            <section>
                <h1>Registrace nového uživatele</h1>
                <p>Lorem ipsum</p>
                <p>Lorem ipsum</p>
            </section>
        </>
    )
}
