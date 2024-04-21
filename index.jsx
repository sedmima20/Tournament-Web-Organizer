import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { TokenProvider } from './contexts/TokenProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <TokenProvider>
          <App />
      </TokenProvider>
  </React.StrictMode>,
)
