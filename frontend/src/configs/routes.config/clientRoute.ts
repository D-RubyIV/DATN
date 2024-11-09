import { lazy } from 'react'

const clientRoutes = [
    {
        key: '',
        path: `/`,
        component: lazy(() => import('@/views/client/Dashboard')),
        authority: []
    }
]
export default clientRoutes;