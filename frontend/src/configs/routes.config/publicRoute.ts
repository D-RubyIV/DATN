import type { Routes } from '@/@types/routes'
import { lazy } from 'react'

const publicRoute: Routes = [
    {
        key: 'addCustomer',
        path: '',
        component: lazy(() => import('@/views/public/Welcome/Welcome')),
        authority: []
    }
]

export default publicRoute
