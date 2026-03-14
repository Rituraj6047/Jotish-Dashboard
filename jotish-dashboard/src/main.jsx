import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { EmployeeProvider } from './context/EmployeeContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <EmployeeProvider>
        <App />
      </EmployeeProvider>
    </AuthProvider>
  </StrictMode>,
)
