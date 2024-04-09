import React, {useEffect} from 'react'
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom'
import useLocalStorageState from '/hooks/useLocalStorageState.jsx'
import useTwoApiRequest from './hooks/useTwoApiRequest.jsx';
import HomePage from '/pages/HomePage.jsx'
import RegisterPage from '/pages/RegisterPage.jsx'
import NotFoundPage from '/pages/NotFoundPage.jsx'
import logo from '/images/logo.png'

export default function App() {
    const [token, setToken] = useLocalStorageState('authToken', '');
    const checkTokenRequest = useTwoApiRequest({
        endpoint: 'is_token_valid',
        token: token
    });

    useEffect(() => {
        // Zkontroluj platnost tokenu (pokud není prázdný). Pokud je token neplatný, nastav ho na prázdný string.
    }, []);

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
                        <Link to="/registrace">Vytvořit účet</Link>
                    </li>
                </ul>
            </nav>
            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/registrace" element={<RegisterPage />} />
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
