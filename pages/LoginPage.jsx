import React, {useContext, useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { TokenContext } from '/contexts/TokenContext.jsx'
import { AlertContentContext } from '/contexts/AlertContentContext.jsx'
import { LoggedUserDataContext } from '/contexts/LoggedUserDataContext.jsx'
import useTwoApiRequest from '/hooks/useTwoApiRequest.jsx'

export default function LoginPage() {
    const { token, setToken } = useContext(TokenContext)
    const { alertContent, setAlertContent } = useContext(AlertContentContext)
    const { loggedUserData, setLoggedUserData } = useContext(LoggedUserDataContext)
    const [loginFormData, setLoginFormData] = useState({username: "", password: ""})
    const [isOngoingRequest, setIsOngoingRequest] = useState(false)
    const [isLoginRequestSuccess, setIsLoginRequestSuccess] = useState(false)
    const navigate = useNavigate()
    const loginRequest = useTwoApiRequest()

    // Kontrola, zda uživatel už náhodou není přihlášený
    useEffect(() => {
        if (token && !isLoginRequestSuccess) {
            setAlertContent({ msg: 'Již jsi přihlášen(a) jako „' + (loggedUserData ? loggedUserData.username : 'načítání...') + '“. Vyplněním formuláře níže dojde k přepnutí uživatele nebo k prodloužení platnosti tvého přihlášení.', severity: 'info' })
        }
    }, [token, loggedUserData])

    // Přesměrování uživatele poté, co se povedlo přihlášení a načetla se data uživatele (načtení dat je trochu zpožděné)
    useEffect(() => {
        if (isLoginRequestSuccess && loggedUserData) {
            navigate('/tournaments/' + loggedUserData.username)
        }
    }, [isLoginRequestSuccess, loggedUserData])

    function handleLoginFormDataChange(event) {
        setLoginFormData(prevLoginFormData => {
            return {
                ...prevLoginFormData,
                [event.target.name]: event.target.value
            }
        })
    }

    function handleLoginFormSubmit() {
        if (loginFormData.username && loginFormData.password && !isOngoingRequest) {
            setIsOngoingRequest(true)
            loginRequest.fetchData({
                endpoint: 'login',
                username: loginFormData.username,
                password: loginFormData.password
            })
                .then((data) => {
                    if (data.statusCode === 200) {
                        setToken(data.responseData)
                        setAlertContent({ msg: 'Přihlášeno!', severity: 'info' })
                        setIsLoginRequestSuccess(true)
                    } else if (data.statusCode === 403) {
                        setAlertContent({ msg: 'Nesprávné přihlašovací údaje', severity: 'error' })
                    } else {
                        setAlertContent({ msg: 'Přihlášení se nezdařilo', severity: 'error' })
                    }
                    setIsOngoingRequest(false)
                })
        }
    }

    return (
        <>
            <section>
                <h1>Přihlášení</h1>
                <p>Vítej zpět!</p>
                <input
                    type="text"
                    placeholder="Uživatelské jméno"
                    onChange={handleLoginFormDataChange}
                    name="username"
                    maxLength="50"
                    disabled={isOngoingRequest}
                />
                <input
                    type="password"
                    placeholder="Heslo"
                    onChange={handleLoginFormDataChange}
                    name="password"
                    maxLength="80"
                    disabled={isOngoingRequest}
                />
                <button onClick={handleLoginFormSubmit} disabled={!loginFormData.username || !loginFormData.password || isOngoingRequest}>Přihlásit se</button>
                <p>Nepamatuješ si heslo? Napiš nám na <a href="mailto:place@holder.com">place@holder.com</a>, pomůžeme ti znovu získat přístup ke tvému účtu.</p>
                <p>Ještě nemáš účet? Neváhej, <Link to="/signup">zaregistruj se</Link> a připoj se k ostatním organizátorům, kteří používají TWO.</p>
            </section>
        </>
    )
}
