/* eslint-disable import/default */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import ToastProvider from './context/ToastContext'
import LoadingProvider from '@/context/LoadingContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ToastProvider>
            <LoadingProvider>
                <App />
            </LoadingProvider>
        </ToastProvider>
    </React.StrictMode>
)
