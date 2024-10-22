import { lazy } from 'react'
import type { Routes } from '@/@types/routes'
import { APP_PREFIX_PATH } from '@/constants/route.constant'


const adminRoute: Routes = [
    {
        key: 'customerManager',
        path: `manage/customer`,
        component: lazy(() => import('@/views/manage/customer/CustomerManage')),
        authority: []
    },
    {
        key: 'addCustomer',
        path: `manage/customer/add`,
        component: lazy(
            () => import('@/views/manage/customer/component/AddCustomer')
        ),
        authority: []
    },
    {
        key: 'updateCustomer',
        path: `manage/customer/update/:id`,
        component: lazy(
            () => import('@/views/manage/customer/component/UpdateCustomer')
        ),
        authority: []
    },
    {
        key: 'voucherManager',
        path: `manage/voucher`,
        component: lazy(() => import('@/views/manage/voucher/VoucherManage')),
        authority: []
    },
    {
        key: 'staffManager',
        path: `manage/staff`,
        component: lazy(() => import('@/views/manage/staff/StaffManage')),
        authority: []
    },
    {
        key: 'UpdateStaff',
        path: `manage/staff/update/:id`,
        component: lazy(() => import('@/views/manage/staff/UpdateStaff')),
        authority: []
    },
    {
        key: 'AddStaffPage',
        path: `manage/staff/add`,
        component: lazy(() => import('@/views/manage/staff/AddStaffPage')),
        authority: []
    },
    {
        key: 'orderManager',
        path: `manage/order`,
        component: lazy(() => import('@/views/manage/order/OrderManage')),
        authority: []
    },
    {
        key: 'appVouchers.voucherList',
        path: `${APP_PREFIX_PATH}/voucher/voucher-list`,
        component: lazy(() => import('@/views/manage/voucher/VoucherManage')),
        authority: []
    },
    {
        key: 'appVouchers.voucherNew',
        path: `${APP_PREFIX_PATH}/voucher/voucher-new`,
        component: lazy(() => import('@/views/manage/voucher/VoucherNew')),
        authority: [],
        meta: { header: 'Thêm Phiếu Giảm Giá' }
    },
    {
        key: 'customerManager',
        path: `manage/order/order-details/:id`,
        component: lazy(() => import('@/views/manage/order/component/other/OrderDetails')),
        authority: []
    },
    {
        key: 'manageSell',
        path: `manage/sell`,
        component: lazy(() => import('@/views/manage/sell/SellManage')),
        authority: []
    },
    {
        key: 'productManage',
        path: `manage/product`,
        component: lazy(() => import('@/views/manage/product/productList')),
        authority: []
    },
    {
        key: 'productManage',
        path: 'manage/product/ProductDetail-list/:id',
        component: lazy(() => import('@/views/manage/product/productDetailList')),
        authority: []
    },
    {
        key: 'payment',
        path: `manage/payment/callback`,
        component: lazy(() => import('@/views/manage/sell/component/payment/PaymentCallback')),
        authority: []
    }
]

export default adminRoute
