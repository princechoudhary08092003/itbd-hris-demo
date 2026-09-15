import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { DataStoreProvider } from './state/DataStore.jsx'
import { AuthProvider } from './state/AuthContext.jsx'
import { ThemeProvider } from './state/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <DataStoreProvider>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </DataStoreProvider>
    </ThemeProvider>
  </StrictMode>,
)
