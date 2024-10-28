import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const tuanRoute: Routes = [
    {
        key: 'productManage',
        path: `/manage/product`,
        component: lazy(() => import('@/views/manage/product/productList')),
        authority: [],
    },
    {
        key: 'productManage',
        path: 'manage/product/ProductDetail-list/:id',
        component: lazy(() => import('@/views/manage/product/productDetailList')),
        authority: [],
    },
    {
        key: 'productManage',
        path: 'manage/product/product-new',
        component: lazy(() => import('@/views/manage/product/ProductNew')),
        authority: [],
    },
    {
        key: 'productManage',
        path: 'manage/product/brand-list',
        component: lazy(() => import('@/views/manage/product/brandLisst')),
        authority: [],
    },
]

export default tuanRoute


// chacs do chua import file nayf vao file chinh