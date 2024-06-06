import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter as Router } from 'react-router-dom'
import App from './App.jsx'
import { TokenProvider } from './contexts/TokenProvider.jsx'
import { AlertContentProvider } from './contexts/AlertContentProvider.jsx'
import { LoggedUserDataProvider } from './contexts/LoggedUserDataProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Router>
            <LoggedUserDataProvider>
                <AlertContentProvider>
                    <TokenProvider>
                        <App />
                    </TokenProvider>
                </AlertContentProvider>
            </LoggedUserDataProvider>
        </Router>
    </React.StrictMode>,
)
