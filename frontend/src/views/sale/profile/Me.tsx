import { Link, Outlet } from 'react-router-dom'
import Navbar from '@/views/client/Navbar/Navbar'
import { Fragment, useEffect } from 'react'
import CartDrawer from '@/views/sale/CartDrawer'
import Aos from 'aos'

const Me = () => {
    useEffect(() => {
        Aos.init({
            offset: 100,
            duration: 800,
            easing: 'ease-in-sine',
            delay: 100
        })
        Aos.refresh()
    }, [])
    const menu = [
        {
            'label': 'Đơn mua',
            'url': '/me/my-order'
        },
        {
            'label': 'Kho phiếu giảm giá',
            'url': '/me/my-voucher'
        }
    ]
    return (
        <Fragment>
            <CartDrawer></CartDrawer>
            <Navbar></Navbar>
            <div className={'grid grid-cols-12 w-full h-svh p-5 min-h-[600px]  gap-2'}>
                <div className={'col-span-2 bg-white'}>
                    {menu.map((item, index) => (
                        <Link key={index} to={item.url} className={'text-black text-[18px] p-5'}>
                            <div className={'hover:bg-gray-300 p-3 border-b'}>
                                {item.label}
                            </div>
                        </Link>
                    ))}
                </div>
                <div className={'col-span-10 bg-white p-5'}>
                    <Outlet />
                </div>
            </div>
            {/*<div className={'flex'}>*/}
            {/*    <Footer></Footer>*/}
            {/*</div>*/}
        </Fragment>
    )
}
export default Me
