import { lazy } from 'react'
import type { Routes } from '@/@types/routes'
import publicRoute from '@/configs/routes.config/publicRoute'
import authRoute from '@/configs/routes.config/authRoute'
import clientRoute from '@/configs/routes.config/clientRoute'
import appsRoute from './appsRoute'

// export const publicRoutes: Routes = [
//     ...publicRoute
// ]
// export const authRoutes: Routes = [
//     ...authRoute
// ]
// export const clientRoutes: Routes = [
//     ...clientRoute
// ]
// export const adminRoutes = [
//     {
//         key: 'home',
//         path: '/home',
//         component: lazy(() => import('@/views/Home')),
//         authority: []
//     },
//     ...adminRoute,
// ]


export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes: Routes = [
    ...appsRoute,
    ...publicRoute,
    ...clientRoute,
]
