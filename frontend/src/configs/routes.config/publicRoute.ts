import type { Routes } from '@/@types/routes'
import { lazy } from 'react'

const publicRoute: Routes = [
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
        key: 'thank',
        path: '/thank',
        component: lazy(() => import('@/views/sale/ThankYou')),
        authority: []
    },
    {
        key: 'purchase',
        path: '/user/purchase/:idOrder',
        component: lazy(() => import('@/views/sale/InvoiceSearchResult')),
        authority: []
    },
    {
        key: 'check',
        path: '/check-order',
        component: lazy(() => import('@/views/sale/CheckOrderView')),
        authority: []
    },
    {
        key: 'products',
        path: '/products/:id',
        component: lazy(() => import('@/views/sale/ProductDetail')),
        authority: []
    },
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
