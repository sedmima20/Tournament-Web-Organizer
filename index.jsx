import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { TokenProvider } from './contexts/TokenProvider.jsx'
import { AlertContentProvider } from './contexts/AlertContentProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AlertContentProvider>
            <TokenProvider>
                <App />
            </TokenProvider>
        </AlertContentProvider>
    </React.StrictMode>,
)
