import { APP_PREFIX_PATH } from '@/constants/route.constant'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'


const appsNavigationConfig: NavigationTree[] = [
    {
        key: 'manage',
        path: '',
        title: 'MANAGES',
        translateKey: 'nav.manages',
        icon: 'manages',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [],
        subMenu: [
            {
                key: 'apps.vouchers',
                path: '',
                title: 'Vouchers',
                translateKey: 'nav.appVouchers.vouchers',
                icon: '',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                subMenu: [
                   
                    {
                        key: 'appVouchers.voucherList',
                        path: `${APP_PREFIX_PATH}/voucher/voucher-list`,
                        title: 'Voucher  List',
                        translateKey: 'nav.appVouchers.voucherList',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                    {
                        key: 'appVouchers.voucherEdit',
                        path: `${APP_PREFIX_PATH}/voucher/voucher-edit/12`,
                        title: 'Voucher Edit',
                        translateKey: 'nav.appVouchers.voucherEdit',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                    {
                        key: 'appVouchers.voucherNew',
                        path: `${APP_PREFIX_PATH}/voucher/voucher-new`,
                        title: 'New Voucher',
                        translateKey: 'nav.appVouchers.voucherNew',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                    {
                        key: 'appsSales.orderList',
                        path: `${APP_PREFIX_PATH}/sales/order-list`,
                        title: 'Order List',
                        translateKey: 'nav.appsSales.orderList',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                    {
                        key: 'appsSales.orderDetails',
                        path: `${APP_PREFIX_PATH}/sales/order-details/95954`,
                        title: 'Order Details',
                        translateKey: 'nav.appsSales.orderDetails',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                ],
            },
        ]
    }
]