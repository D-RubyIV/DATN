import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE
} from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
    {
        key: 'home',
        path: '/admin/manage/home',
        title: 'Home',
        translateKey: 'nav.home',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'manageSell',
        path: '/admin/manage/sell',
        title: 'Home',
        translateKey: 'nav.sellTitle',
        icon: 'sale',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: []
    },
    {
        key: 'customerManager',
        path: 'manage/customer',
        title: 'Collapse menu item 1',
        translateKey: 'nav.customerTitle',
        icon: 'groupUser',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: []
    },
    {
        key: 'voucherManager',
        path: 'manage/voucher',
        title: 'Collapse menu item 2',
        translateKey: 'nav.voucherTitle',
        icon: 'ticket',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: []
    },
    {
        key: 'productManage',
        path: 'manage/product',
        title: 'Collapse menu item 2',
        translateKey: 'nav.productTitle',
        icon: 'product',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: []
    },
    {
        key: 'staffManager',
        path: 'manage/staff',
        title: 'Collapse menu item 2',
        translateKey: 'nav.staffTitle',
        icon: 'staff',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: []
    },
    {
        key: 'orderManager',
        path: 'manage/order',
        title: 'Collapse menu item 2',
        translateKey: 'nav.orderTitle',
        icon: 'order',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: []
    },
    {
        key: 'eventManager',
        path: 'manage/event',
        title: 'Collapse menu item 2',
        translateKey: 'nav.eventTitle',
        icon: 'event',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: []
    },
]

export default navigationConfig
