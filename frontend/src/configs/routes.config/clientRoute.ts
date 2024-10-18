import { lazy } from 'react'

const clientRoutes = [
    {
        key: 'home',
        path: `/payment/callback`,
        component: lazy(() => import('@/views/manage/sell/component/payment/PaymentCallback')),
        authority: []
    }
]
export default clientRoutes;