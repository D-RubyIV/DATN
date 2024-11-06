import { lazy } from 'react'

const clientRoutes = [
    {
        key: 'home',
        path: `/home`,
        component: lazy(() => import('@/views/client/Dashboard')),
        authority: []
    }
]
export default clientRoutes;