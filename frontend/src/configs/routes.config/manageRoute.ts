import { lazy } from 'react';
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
