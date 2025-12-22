import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { QueryProvider } from './shared/providers'
import { PermissionProvider } from './shared/contexts'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryProvider>
      <PermissionProvider>
        <App />
      </PermissionProvider>
    </QueryProvider>
  </React.StrictMode>,
)
