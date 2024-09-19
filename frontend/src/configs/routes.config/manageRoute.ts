import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const manageRoute: Routes = [
    {
        key: 'customerManager',
        path: `/manage/customer`,
        component: lazy(() => import('@/views/manage/customer/CustomerManage')),
        authority: [],
    },
    {
        key: 'addCustomer',
        path: `/manage/customer/add`,
        component: lazy(
            () => import('@/views/manage/customer/component/AddCustomer'),
        ),
        authority: [],
    },
    {
        key: 'updateCustomer',
        path: `/manage/customer/update/:id`,
        component: lazy(
            () => import('@/views/manage/customer/component/UpdateCustomer'),
        ),
        authority: [],
    },
    {
        key: 'voucherManager',
        path: `/manage/voucher`,
        component: lazy(() => import('@/views/manage/voucher/VoucherManage')),
        authority: [],
    },
    {
        key: 'productManage',
        path: `/manage/product`,
        component: lazy(() => import('@/views/manage/product/ProductManage')),
        authority: [],
    },
    {
        key: 'staffManager',
        path: `/manage/staff`,
        component: lazy(() => import('@/views/manage/staff/StaffManage')),
        authority: [],
    },
    {
        key: 'billManager',
        path: `/manage/bill`,
        component: lazy(() => import('@/views/manage/bill/BillManage')),
        authority: [],
    },
]

export default manageRoute
