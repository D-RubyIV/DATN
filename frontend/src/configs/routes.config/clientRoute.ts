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
    },
    {
        key: 'home',
        path: `/home`,
        component: lazy(() => import('@/views/client/Dashboard')),
        authority: []
    }
]
export default clientRoutes; // oke thank b toi di hoc day con gi baoi t k
//  cu code ddi t fix route kia sau cho okeee <3
// ban check xem merge hết chưa