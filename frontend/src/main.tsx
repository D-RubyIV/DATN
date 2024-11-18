/* eslint-disable import/default */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import AuthProvider from './views/client/auth/AuthContext'
import ToastProvider from './context/ToastContext'
import LoadingProvider from '@/context/LoadingContext'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppProvider } from '../src/views/client/contexts/app.context'
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false
        }
    }
})
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <AuthProvider>
            <ToastProvider>
                <LoadingProvider>
                    <QueryClientProvider client={queryClient}>
                        <AppProvider>
                            <App />
                            <ReactQueryDevtools initialIsOpen={false} />
                        </AppProvider>
                    </QueryClientProvider>
                </LoadingProvider>
            </ToastProvider>
        </AuthProvider>
    </React.StrictMode>
)
