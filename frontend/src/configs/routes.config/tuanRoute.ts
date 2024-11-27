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
    {
        key: 'productManage',
        path: 'manage/product/origin-list',
        component: lazy(() => import('@/views/manage/product/originList')),
        authority: [],
    },
    {
        key: 'productManage',
        path: 'manage/product/style-list',
        component: lazy(() => import('@/views/manage/product/styleList')),
        authority: [],
    },
    {
        key: 'productManage',
        path: 'manage/product/material-list',
        component: lazy(() => import('@/views/manage/product/materialList')),
        authority: [],
    },
    {
        key: 'productManage',
        path: 'manage/product/collar-list',
        component: lazy(() => import('@/views/manage/product/collarList')),
        authority: [],
    },
    {
        key: 'productManage',
        path: 'manage/product/sleeve-list',
        component: lazy(() => import('@/views/manage/product/sleeveList')),
        authority: [],
    },
    {
        key: 'productManage',
        path: 'manage/product/texture-list',
        component: lazy(() => import('@/views/manage/product/textureList')),
        authority: [],
    },
    {
        key: 'productManage',
        path: 'manage/product/thickness-list',
        component: lazy(() => import('@/views/manage/product/thicknessList')),
        authority: [],
    },
    {
        key: 'productManage',
        path: 'manage/product/elasticity-list',
        component: lazy(() => import('@/views/manage/product/elasticityList')),
        authority: [],
    },
    {
        key: 'productManage',
        path: 'manage/product/size-list',
        component: lazy(() => import('@/views/manage/product/sizeList')),
        authority: [],
    },
    {
        key: 'productManage',
        path: 'manage/product/color-list',
        component: lazy(() => import('@/views/manage/product/colorList')),
        authority: [],
    },

]

export default tuanRoute

