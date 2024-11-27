import Header from '@/components/template/Header'
import SideNavToggle from '@/components/template/SideNavToggle'
import SidePanel from '@/components/template/SidePanel'
import MobileNav from '@/components/template/MobileNav'
import UserDropdown from '@/components/template/UserDropdown'
import SideNav from '@/components/template/SideNav'
import { Link, Route, Routes } from 'react-router-dom'
import { AdminViews, AuthViews, PublicViews } from '@/views'
import Side from '@/components/layouts/AuthLayout/Side'
import Navbar from '@/views/client/Navbar/Navbar'
import Footer from '@/views/client/Footer/Footer'
import { Fragment, useEffect, useState } from 'react'
import 'aos/dist/aos.css'
import SaleProvider from '@/views/sale/SaleContext'
import CartDrawer from '@/views/sale/CartDrawer'
import { useWSContext } from '@/context/WsContext'
import { Badge, Button } from '@/components/ui'
import { HiOutlineBell, HiOutlineLogout, HiOutlineUser } from 'react-icons/hi'
import Dropdown from '../ui/Dropdown'
import Avatar from '../ui/Avatar'
import { useToastContext } from '@/context/ToastContext'
import instance from '@/axios/CustomAxios'

const Bell = () => {
    type DropdownList = {
        label: string
        path: string
        icon: JSX.Element
    }


    const getCurrentOrder = () => {
        console.log('0000000000000')
        const data = {
            'pageIndex': 1,
            'pageSize': 10,
            'query': '',
            'sort': {
                'order': 'desc',
                'key': 'createdDate'
            }
        }
        instance.post('http://localhost:8080/api/v1/orders/overview?status=PENDING&type=ONLINE', data).then(function(response) {
            console.log(response)
        })
    }

    const dropdownItemList: DropdownList[] = []
    const { countOrder } = useWSContext()
    const { openNotification } = useToastContext()

    useEffect(() => {
        openNotification('Bạn có 1 đơn hàng mới', 'Thông báo mới', 'info', 2000)
    }, [countOrder])

    const UserAvatar = (
        <div className={'flex justify-center items-center'}>
            <Badge content={countOrder} maxCount={99}>
                <Button
                    variant={'plain'}
                    className={'text-gray-600'}
                    icon={<HiOutlineBell size={25} className={'text-gray-500'} />}
                />
            </Badge>
        </div>
    )

    return (
        <div className={''}>
            <div>
                <Dropdown
                    menuStyle={{ minWidth: 600 }}
                    renderTitle={UserAvatar}
                    placement="bottom-end"
                    onOpen={getCurrentOrder}
                >
                    <Dropdown.Item variant="header">
                        <div className="py-2 px-3 flex items-center gap-2">
                            <Avatar shape="circle" icon={<HiOutlineUser />} />
                            <div>
                                <div className="font-bold text-gray-900 dark:text-gray-100">
                                    User01
                                </div>
                                <div className="text-xs">user01@mail.com</div>
                            </div>
                        </div>
                    </Dropdown.Item>
                    <Dropdown.Item variant="divider" />
                    {dropdownItemList.map((item) => (
                        <Dropdown.Item
                            key={item.label}
                            eventKey={item.label}
                            className="mb-1 px-0"
                        >
                            <Link
                                className="flex h-full w-full px-2"
                                to={item.path}
                            >
                            <span className="flex gap-2 items-center w-full">
                                <span className="text-xl opacity-50">
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                            </span>
                            </Link>
                        </Dropdown.Item>
                    ))}
                    {/* <Dropdown.Item variant="divider" /> */}
                    <Dropdown.Item
                        eventKey="Sign Out"
                        className="gap-2"
                    >
                    <span className="text-xl opacity-50">
                        <HiOutlineLogout />
                    </span>
                        <span>Sign Out</span>
                    </Dropdown.Item>
                </Dropdown>
            </div>
        </div>
    )
}


const HeaderActionsStart = () => {
    return (
        <>
            <MobileNav />
            <SideNavToggle />
        </>
    )
}

const HeaderActionsEnd = () => {
    return (
        <>
            <Bell />
            <SidePanel />
            <UserDropdown hoverable={false} />
        </>
    )
}

const AdminLayout = () => {
    return (
        <div className="app-layout-classic flex flex-auto flex-col">
            <div className="flex flex-auto min-w-0">
                <SideNav />
                <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full">
                    <Header
                        className="shadow dark:shadow-2xl"
                        headerStart={<HeaderActionsStart />}
                        headerEnd={<HeaderActionsEnd />}
                    />
                    <div className="h-full flex flex-auto flex-col">
                        <AdminViews />
                    </div>
                </div>
            </div>
        </div>
    )
}
// const ClientLayout = () => {
//
//     useEffect(() => {
//         AOS.init({
//             offset: 100,
//             duration: 800,
//             easing: "ease-in-sine",
//             delay: 100,
//         });
//         AOS.refresh();
//     }, []);
//     return (
//         <div className="app-layout-classic flex flex-auto flex-col">
//             <SaleProvider>
//                 <Navbar/>
//                 <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full">
//                     <div className="h-full flex flex-auto flex-col ">
//                         <ClientViews/>
//                     </div>
//                     <Footer/>
//                 </div>
//                 <CartDrawer></CartDrawer>
//             </SaleProvider>
//
//         </div>
//     )
// }
const PublicLayout = () => {
    return (
        <Fragment>
            <SaleProvider>
                <Navbar />
                <PublicViews />
                <Footer />
                <CartDrawer></CartDrawer>
            </SaleProvider>
        </Fragment>
    )
}
const SecurityLayout = () => {
    return (
        <Side>
            <div className="app-layout-classic flex flex-auto flex-col">
                <div className="flex flex-auto min-w-0">
                    <div className="h-full flex flex-auto flex-col">
                        <AuthViews />
                    </div>
                </div>
            </div>
        </Side>
    )
}

const RootLayout = () => {
    return (
        <Routes>
            {/*<Route path="/client/*" element={<ClientLayout/>}/>*/}
            <Route path="/admin/*" element={<AdminLayout />} />
            <Route path="/auth/*" element={<SecurityLayout />} />
            <Route path="/*" element={<PublicLayout />} />
            {/*<Route path="*" element={<Navigate replace to="/sign-in" />} />*/}
        </Routes>
    )
}

export default RootLayout