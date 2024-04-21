import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter as Router } from 'react-router-dom'
import App from './App.jsx'
import { TokenProvider } from './contexts/TokenProvider.jsx'
import { AlertContentProvider } from './contexts/AlertContentProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Router>
            <AlertContentProvider>
                <TokenProvider>
                    <App />
                </TokenProvider>
            </AlertContentProvider>
        </Router>
    </React.StrictMode>,
)
