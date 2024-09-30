import { lazy } from 'react'
import type { Routes } from '@/@types/routes'
import { APP_PREFIX_PATH } from '@/constants/route.constant'


const manageRoute: Routes = [
    {
        key: 'customerManager',
        path: `/manage/customer`,
        component: lazy(() => import('@/views/manage/customer/CustomerManage')),
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
    // {
    //     key: 'billManager',
    //     path: `/manage/bill`,
    //     component: lazy(() => import('@/views/manage/bill/BillManage')),
    //     authority: [],
    // },
    {
        key: 'appVouchers.voucherList',
        path: `${APP_PREFIX_PATH}/voucher/voucher-list`,
        component: lazy(() => import('@/views/manage/voucher/VoucherManage')),
        authority: [],
    },
    // {
    //     key: 'appVouchers.voucherEdit',
    //     path: `${APP_PREFIX_PATH}}/voucher/voucher-edit/:voucherId`,
    //     component: lazy(() => import('@/views/sales/ProductEdit')),
    //     authority: [],
    //     meta: {
    //         header: 'Edit Voucher',
    //     },
    // },
    {
        key: 'appVouchers.voucherNew',
        path: `${APP_PREFIX_PATH}/voucher/voucher-new`,
        component: lazy(() => import('@/views/manage/voucher/VoucherNew')),
        authority: [],
        meta: {
            header: 'Add New Voucher',
        },
    },
]

export default manageRouteimport { lazy } from 'react';
import type { Routes } from '@/@types/routes';

const manageRoute: Routes = [
    {
        key: 'customerManager',
        path: `/manage/customer`,
        component: lazy(() => import('@/views/manage/customer/CustomerManage')),
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
        key: 'AddStaffPage',
        path: `/manage/staff/add`,
        component: lazy(() => import('@/views/manage/staff/AddStaffPage')),
        authority: [],
    },
    {
        key: 'UpdateStaff',
        path: `/manage/staff/update/:id`,
        component: lazy(() => import('@/views/manage/staff/UpdateStaff')),
        authority: [],
    },
    
    {
        key: 'AddStaffPage',
        path: `/manage/staff/add`,
        component: lazy(() => import('@/views/manage/staff/AddStaffPage')),
        authority: [],
    },
    {
        key: 'UpdateStaff',
        path: `/manage/staff/update/:id`,
        component: lazy(() => import('@/views/manage/staff/UpdateStaff')),
        authority: [],
    },
    
    {
        key: 'orderManager',
        path: `/manage/order`,
        component: lazy(() => import('@/views/manage/order/OrderManage')),
        authority: [],
    },
];

export default manageRoute;
