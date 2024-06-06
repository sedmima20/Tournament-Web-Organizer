import React, {useContext, useEffect, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TokenContext } from '/contexts/TokenContext.jsx'
import { AlertContentContext } from '/contexts/AlertContentContext.jsx'
import { LoggedUserDataContext } from '/contexts/LoggedUserDataContext.jsx'
import useTwoApiRequest from '/hooks/useTwoApiRequest.jsx'

export default function SignupPage() {
    const { token, setToken } = useContext(TokenContext)
    const { alertContent, setAlertContent } = useContext(AlertContentContext)
    const { loggedUserData, setLoggedUserData } = useContext(LoggedUserDataContext)
    const [signupFormData, setSignupFormData] = useState({username: "", password: "", password2: ""})
    const [isOngoingRequest, setIsOngoingRequest] = useState(false)
    const [isLoginRequestSuccess, setIsLoginRequestSuccess] = useState(false)
    const navigate = useNavigate()
    const signupRequest = useTwoApiRequest()
    const loginRequest = useTwoApiRequest()

    // Kontrola, zda uživatel už náhodou není přihlášený
    useEffect(() => {
        if (token && !isLoginRequestSuccess) {
            setAlertContent({ msg: 'Již jsi přihlášen(a) jako „' + (loggedUserData ? loggedUserData.username : 'načítání...') + '“. Vyplněním formuláře níže dojde k přepnutí uživatele.', severity: 'info' })
        }
    }, [token, loggedUserData])

    // Přesměrování uživatele poté, co se povedlo automatické přihlášení po registraci a načetla se data uživatele (načtení dat je trochu zpožděné)
    useEffect(() => {
        if (isLoginRequestSuccess && loggedUserData) {
            navigate('/tournaments/' + loggedUserData.username)
        }
    }, [isLoginRequestSuccess, loggedUserData])

    function handleSignupFormDataChange(event) {
        setSignupFormData(prevSignupFormData => {
            return {
                ...prevSignupFormData,
                [event.target.name]: event.target.value
            }
        })
    }

    function handleSignupFormSubmit() {
        if (signupFormData.username && signupFormData.password && signupFormData.password2 && !isOngoingRequest) {
            if (signupFormData.password.length < 8) {
                setAlertContent({ msg: 'Heslo musí mít alespoň 8 znaků', severity: 'error' })
            } else if (signupFormData.password !== signupFormData.password2) {
                setAlertContent({ msg: 'Hesla se neshodují', severity: 'error' })
            } else {
                setIsOngoingRequest(true)
                signupRequest.fetchData({
                    endpoint: 'register',
                    username: signupFormData.username,
                    password: signupFormData.password
                })
                    .then((data) => {
                        if (data.statusCode === 201) {
                            setAlertContent({ msg: 'Účet úspěšně vytvořen! Nyní můžeš začít vytvářet a spravovat turnaje.', severity: 'info' })
                            loginAfterSignup()
                        } else if (data.statusCode === 403) {
                            setAlertContent({ msg: 'Uživatelské jméno je již obsazeno, vyzkoušej jiné.', severity: 'error' })
                        } else {
                            setAlertContent({ msg: 'Registrace se nezdařila', severity: 'error' })
                        }
                        setIsOngoingRequest(false)
                    })
            }
        }
    }

    function loginAfterSignup() {
        loginRequest.fetchData({
            endpoint: 'login',
            username: signupFormData.username,
            password: signupFormData.password
        })
            .then((data) => {
                if (data.statusCode === 200) {
                    setToken(data.responseData)
                    setIsLoginRequestSuccess(true)
                }
            })
    }

    return (
        <>
            <div className="warning-box">Software je ve fázi počátečního testování a registrace nových uživatelů mohou být omezeny nebo úplně zakázány. Pokud ti formulář níže nebude fungovat, můžeš nás požádat o vytvoření účtu na <a href="mailto:place@holder.com">place@holder.com</a>. Děkujeme za zájem!</div>
            <section>
                <h1>Registrace nového uživatele</h1>
                <p>K registraci potřebuješ jen libovolné uživatelské jméno a heslo, nic jiného. Uživatelské jméno by mělo být slušné - nepoužívej žádné vulgární či jinak nevhodné nesmysly. Heslo by mělo být silné a musí mít alespoň 8 znaků. Nedoporučujeme používat heslo, které používáš i v jiných službách.</p>
                <input
                    type="text"
                    placeholder="Uživatelské jméno"
                    onChange={handleSignupFormDataChange}
                    name="username"
                    value={signupFormData.username}
                    maxLength="50"
                    disabled={isOngoingRequest}
                />
                <input
                    type="password"
                    placeholder="Heslo"
                    onChange={handleSignupFormDataChange}
                    name="password"
                    value={signupFormData.password}
                    maxLength="80"
                    disabled={isOngoingRequest}
                />
                <input
                    type="password"
                    placeholder="Zadej heslo znovu"
                    onChange={handleSignupFormDataChange}
                    name="password2"
                    value={signupFormData.password2}
                    maxLength="80"
                    disabled={isOngoingRequest}
                />
                <button onClick={handleSignupFormSubmit} disabled={!signupFormData.username || !signupFormData.password || !signupFormData.password2 || isOngoingRequest}>Vytvořit účet</button>
                <p>Už máš účet? <Link to="/login">Přihlásit se.</Link></p>
            </section>
        </>
    )
}
