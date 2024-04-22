import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TokenContext } from '/contexts/TokenContext.jsx'
import { AlertContentContext } from '/contexts/AlertContentContext.jsx'
import { LoggedUserDataContext } from '/contexts/LoggedUserDataContext.jsx'

export default function LoginPage() {
    const { token, setToken } = useContext(TokenContext)
    const { alertContent, setAlertContent } = useContext(AlertContentContext)
    const { loggedUserData, setLoggedUserData } = useContext(LoggedUserDataContext)

    // Kontrola, zda uživatel už náhodou není přihlášený
    useEffect(() => {
        if (token) {
            setAlertContent({ msg: 'Již jsi přihlášen(a) jako „' + (loggedUserData ? loggedUserData.username : 'načítání...') + '“. Vyplněním formuláře níže dojde k přepnutí uživatele nebo k prodloužení platnosti tvého přihlášení.', severity: 'info' })
        }
    }, [token, loggedUserData])

    return (
        <>
            <section>
                <h1>Přihlášení</h1>
                <p>Vítej zpět!</p>
                <p>Lorem ipsum</p>
                <p>Ještě nemáš účet? Neváhej, <Link to="/signup">zaregistruj se</Link> a připoj se k ostatním organizátorům, kteří používají TWO.</p>
            </section>
        </>
    )
}
