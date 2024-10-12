import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const sellRoute: Routes = [
    {
        key: 'manageSell',
        path: `/manage/sell`,
        component: lazy(() => import('@/views/manage/sell/SellManage')),
        authority: [],
    },
]

export default sellRoute
