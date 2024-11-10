import { lazy } from 'react'

const clientRoutes = [
    {
        key: 'home',
        path: '', // do cai nay o, nos map voi cai bocj nos ra
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
    }
]
export default clientRoutes;