import type { Routes } from '@/@types/routes'
import { lazy } from 'react'

const publicRoute: Routes = [
    {
        key: 'logout',
        path: 'logout',
        component: lazy(() => import('@/views/auth/Logut/Logout')),
        authority: []
    },
    {
        key: 'checkout',
        path: '/checkout/:id',
        component: lazy(() => import('@/views/sale/Checkout')),
        authority: []
    },
    {
        key: 'payment',
        path: `/payment/callback`,
        component: lazy(
            () =>
                import('@/views/manage/sell/component/payment/PaymentCallback'),
        ),
        authority: [],
    },
]

export default publicRoute
