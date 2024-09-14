import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const orderRoute: Routes = [
    {
        key: 'customerManager',
        path: `/manage/order/order-details/:id`,
        component: lazy(() => import('@/views/manage/order/component/OrderDetails')),
        authority: [],
    },
]

export default orderRoute
