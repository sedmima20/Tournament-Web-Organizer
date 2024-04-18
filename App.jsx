import React, { useEffect, useRef } from 'react'
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom'
import useLocalStorageState from '/hooks/useLocalStorageState.jsx'
import useTwoApiRequest from '/hooks/useTwoApiRequest.jsx'
import HomePage from '/pages/HomePage.jsx'
import LoginPage from '/pages/LoginPage.jsx'
import SignupPage from '/pages/SignupPage.jsx'
import NotFoundPage from '/pages/NotFoundPage.jsx'
import logo from '/images/logo.png'

export default function App() {
    const [token, setToken] = useLocalStorageState('authToken', '')
    const intervalRef = useRef(null)
    const checkTokenRequest = useTwoApiRequest({
        endpoint: 'is_token_valid',
        token: token
    })

    // Kontrola tokenu při prvním vyrenderování hlavní komponety, při každé změně tokenu a také každých 30 sekund (platnost může vypršet)
    useEffect(() => {
        checkToken()

        intervalRef.current = setInterval(checkToken, 30000)

        return () => {
            clearInterval(intervalRef.current)
        }
    }, [token])

    // Nastavení tokenu na prázdný string, pokud je neplatný, plus informování uživatele. Zbytek aplikace už počítá s tím, že prázdný string je neplatný token a kterýkoli jiný string je platný token.
    const checkToken = () => {
        if (token) {
            checkTokenRequest.fetchData()
                .then((data) => {
                    if (data.statusCode === 401) {
                        setToken('')
                        alert("Jejda, přihlášení vypršelo :( Pokud bys i nadále rád(a) spravoval(a) své turnaje, znovu se prosím přihlas.")
                    }
                })
        }
    }

    return (
        <Router>
            <header>
                <Link to="/">
                    <img src={logo} alt="logo" className="logo"/>
                </Link>
            </header>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Domů</Link>
                    </li>
                    <li>
                        <Link to="/signup">Vytvořit účet</Link>
                    </li>
                </ul>
            </nav>
            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
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
        </Router>
    )
}
