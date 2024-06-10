import React, { useEffect, useRef, useState, useContext } from 'react'
import { Route, Routes, Link, useNavigate } from 'react-router-dom'
import useTwoApiRequest from '/hooks/useTwoApiRequest.jsx'
import { TokenContext } from '/contexts/TokenContext.jsx'
import { AlertContentContext } from '/contexts/AlertContentContext.jsx'
import { LoggedUserDataContext } from '/contexts/LoggedUserDataContext.jsx'
import HomePage from '/pages/HomePage.jsx'
import LoginPage from '/pages/LoginPage.jsx'
import SignupPage from '/pages/SignupPage.jsx'
import TournamentsPage from '/pages/TournamentsPage.jsx'
import TournamentPage from '/pages/TournamentPage.jsx'
import UserPage from '/pages/UserPage.jsx'
import NotFoundPage from '/pages/NotFoundPage.jsx'
import logo from '/images/logo.png'
import closingX from '/images/closing-x.png'

export default function App() {
    const { token, setToken } = useContext(TokenContext)
    const { alertContent, setAlertContent } = useContext(AlertContentContext)
    const { loggedUserData, setLoggedUserData } = useContext(LoggedUserDataContext)
    const [isConnected, setIsConnected] = useState(true)
    const checkTokenIntervalRef = useRef(undefined)
    const checkConnectionIntervalRef = useRef(undefined)
    const isInitConnRef = useRef(true)
    const navigate = useNavigate()
    const checkTokenRequest = useTwoApiRequest({
        endpoint: 'is_token_valid',
        token: token
    })
    const getLoggedUserRequest = useTwoApiRequest({
        endpoint: 'get_user',
        token: token
    })

    // Kontrola tokenu při prvním vyrenderování hlavní komponety, při každé změně tokenu a také každých 30 sekund (platnost může vypršet)
    useEffect(() => {
        checkToken()

        checkTokenIntervalRef.current = setInterval(checkToken, 30000)

        return () => {
            clearInterval(checkTokenIntervalRef.current)
        }
    }, [token])

    // Získání dat uživatele při prvním vyrenderování komponenty a poté při změnách tokenu. Také smazání dat v případě, že uživatel není přihlášený.
    useEffect(() => {
        if (token) {
            getLoggedUserRequest.fetchData()
                .then((data) => {
                    setLoggedUserData(data.responseData)
                })
        } else {
            setLoggedUserData(undefined)
        }
    }, [token])

    // Kontrola připojení k internetu (respektive k auth/resource serveru) při prvním vyrenderování hlavní komponenty a poté každých 10 sekund
    useEffect(() => {
        checkConnection()

        checkConnectionIntervalRef.current = setInterval(checkConnection, 10000)

        return () => {
            clearInterval(checkConnectionIntervalRef.current)
        }
    }, [])

    // Zobrazení info alertu "Opět online!" po obnovení připojení. Také skrytí tohoto alertu v případě, že bylo spojení po chvíli zase ztraceno.
    useEffect(() => {
        if (isInitConnRef.current) {
            isInitConnRef.current = false
        } else {
            if (isConnected) setAlertContent({ msg: 'Opět online!', severity: 'info' })
            if (!isConnected && alertContent && alertContent.msg === 'Opět online!') setAlertContent(undefined)
        }
    }, [isConnected])

    // Nastavení tokenu na prázdný string, pokud je neplatný, plus informování uživatele. Zbytek aplikace už počítá s tím, že prázdný string je neplatný token a kterýkoli jiný string je platný token.
    const checkToken = () => {
        if (token) {
            checkTokenRequest.fetchData()
                .then((data) => {
                    if (data.statusCode === 401) {
                        setToken('')
                        setAlertContent({ msg: 'Jejda, přihlášení vypršelo :( Pokud bys i nadále rád(a) spravoval(a) své turnaje, znovu se prosím přihlas.', severity: 'warning' })
                    }
                })
        }
    }

    // Funkce využívá stahování velmi malého obrázku (1x1 pixel, 34 bytů) ze serveru pro ověření, zda spojení se serverem stále funguje.
    // Další nápady na potenciální zmenšení zátěže ke zvážení:
    //    - .pbm obrázky s menší velikostí 8 bytů, ale vypadá to, že možná nejsou kompatibilní s img.src
    //    - http místo https, ale nemusí to být bezpečné
    //    - head requesty místo get, pokud by odpovědi byly menší
    const checkConnection = () => {
        const img = new Image()

        img.src = 'https://sedmima20.sps-prosek.cz/projekty/php/turnajovy-software/c.webp?' + new Date().getTime()

        img.onload = () => {
            setIsConnected(true)
        }

        img.onerror = () => {
            setIsConnected(false)
        }
    }

    function handleCloseAlertClick() {
        setAlertContent(undefined)
    }

    function handleLogoutClick() {
        setToken('')
        setAlertContent({ msg: 'Odhlášeno!', severity: 'info' })
        navigate('/login')
    }

    return (
        <>
            <header>
                <Link to="/">
                    <img src={logo} alt="logo" className="logo"/>
                </Link>
                {token ?
                    <div>
                        <p>Přihlášen(a) jako „{loggedUserData ? loggedUserData.username : "načítání..."}“</p>
                        <Link to={loggedUserData ? "/tournaments/" + loggedUserData.username : "/tournaments"}>Moje turnaje</Link>
                        <Link to={loggedUserData ? "/user/" + loggedUserData.username : "/user"}>Spravovat účet</Link>
                        <a onClick={handleLogoutClick}>Odhlásit se</a>
                    </div> :
                    <div>
                        <Link to="/login">Přihlášení</Link>
                        <Link to="/signup">Registrace</Link>
                    </div>
                }
            </header>
            <nav>
                <ul>
                    {token ?
                        <li>
                            <Link to={loggedUserData ? "/tournaments/" + loggedUserData.username : "/tournaments"}>Moje turnaje</Link>
                        </li> :
                        <li>
                            <Link to="/">Domů</Link>
                        </li>
                    }
                    {token ?
                        <li>
                            <Link to="/tournaments">Veřejné turnaje</Link>
                        </li> :
                        <li>
                            <Link to="/tournaments">Turnaje</Link>
                        </li>
                    }
                    {loggedUserData && loggedUserData.type !== "user" &&
                        <li>
                            <Link to="/admin">Administrace</Link>
                        </li>
                    }
                    {token ?
                        <li>
                            <Link to={loggedUserData ? "/user/" + loggedUserData.username : "/user"}>Správa účtu</Link>
                        </li> :
                        <li>
                            <Link to="/login">Přihlášení/registrace</Link>
                        </li>
                    }
                    <li>
                        <Link to="/wiki">Nápověda</Link>
                    </li>
                    <li>
                        <a>Více</a>
                    </li>
                </ul>
            </nav>
            <main>
                {alertContent && <div className={alertContent.severity + "-box"}>{alertContent.msg}<img src={closingX} alt="alert-closing-x-icon" onClick={handleCloseAlertClick}/></div>}
                {!isConnected && <div className="warning-box">Buď náš server podal výpověď, nebo tvé připojení k internetu udělalo pápá 👋</div>}
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/tournaments/:queryUsername?" element={<TournamentsPage />} />
                    <Route path="/tournament/:queryTournamentId/:querySubpage?" element={<TournamentPage />} />
                    <Route path="/user/:queryUsername" element={<UserPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>
            <footer>
                <div>
                    Máš nějaký dotaz nebo jsi narazil(a) na problém? Neváhej a napiš nám na <a href="mailto:place@holder.com">place@holder.com</a>, společně vše vyřešíme.
                </div>
                <div>
                    Copyright © 2024 Martin Sedmihradský
                </div>
            </footer>
        </>
    )
}
