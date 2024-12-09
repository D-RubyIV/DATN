import { Link, Outlet } from 'react-router-dom'
import Navbar from '@/views/client/Navbar/Navbar'
import { Fragment } from 'react'

const Me = () => {
    const menu = [
        {
            'label': 'Đơn mua',
            'url': '/me/my-order'
        },
        {
            'label': 'Kho voucher',
            'url': '/me/my-order'
        }
    ]
    return (
        <Fragment>
            <Navbar></Navbar>
            <div className={'grid grid-cols-12 w-full h-svh p-5'}>
                <div className={'col-span-1'}>
                    {menu.map((item, index) => (
                        <div key={index}>
                            <a href={item.url}>{item.label}</a>
                        </div>
                    ))}
                </div>
                <div className={'col-span-11'}>
                    <Outlet />
                </div>
            </div>
        </Fragment>
    )
}
export default Me
