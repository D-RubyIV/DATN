import { lazy } from 'react'

const clientRoutes = [
    {
        key: 'home',
        path: '',
        component: lazy(() => import('@/views/client/LandingPage')),
        authority: []
    },
    {
        key: 'cart',
        path: `/cart`,
        component: lazy(() => import('@/views/client/Cart/CartComponent')),
        authority: []
    },
    {
        key: 'product',
        path: `/product`,
        component: lazy(() => import('@/views/client/Products/ProductList')),
        authority: []
    },
    {
        key: 'productDetail',
        path: '/productDetail',
        component: lazy(() => import('@/views/client/Cart/ProductDetail')),
        authority: []
    },
    {
        key: 'collections',
        path: '/collections',
        component: lazy(() => import('@/views/sale/ProductList')),
        authority: []
    },
    {
        key: 'products',
        path: '/products/:id',
        component: lazy(() => import('@/views/sale/ProductDetail')),
        authority: []
    },
]
export default clientRoutes;