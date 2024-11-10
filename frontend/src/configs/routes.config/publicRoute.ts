import type { Routes } from '@/@types/routes'
import { lazy } from 'react'

const publicRoute: Routes = [
    
    {
        key: 'logout',
        path: 'logout',
        component: lazy(() => import('@/views/auth/Logut/Logout')),
        authority: []
    }
]

export default publicRoute
