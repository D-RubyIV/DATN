import { lazy } from 'react'
import type { Routes } from '@/@types/routes'
import publicRoute from './publicRouter'
import authRoute from './authRoute'
import adminRoute from './adminRouter'
import clientRoutes from './clientRouter'

// export const publicRoutes: Routes = [
//     ...publicRoute
// ]
export const authRoutes: Routes = [
    ...authRoute
]
// export const clientRoutes: Routes = [
//     ...clientRoutes
// ]
export const adminRoutes = [
    {
        key: 'home',
        path: '/home',
        component: lazy(() => import('@/views/Home')),
        authority: []
    },
    ...adminRoute,
]