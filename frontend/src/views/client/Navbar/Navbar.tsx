import React, { useState } from 'react'
import Logo from '../../../assets/logo.png'
import { IoMdSearch } from 'react-icons/io'
import { FaCartShopping } from 'react-icons/fa6'
import { FaCaretDown, FaUser } from 'react-icons/fa'
import DarkMode from './DarkMode'
import Login from '../Popup/Login'
import { useSaleContext } from '@/views/sale/SaleContext'
import { HiOutlineShoppingBag, HiShoppingBag, HiUser, HiUserCircle } from 'react-icons/hi'

const Menu = [
    {
        id: 1,
        name: 'Trang chủ',
        link: '/'
    },
    {
        id: 2,
        name: 'Sản phẩm của chúng tôi',
        link: '/collections'
    }

]

const DropdownLinks = [
    {
        id: 1,
        name: 'Sản Phẩm Thịnh Hành',
        link: '/#'
    },
    {
        id: 2,
        name: 'Bán chạy nhất',
        link: '/#'
    },
    {
        id: 3,
        name: 'Sản Phẩm Top 1',
        link: '/#'
    },
    {
        id: 4,
        name: 'Tra cứu đơn hàng',
        link: '/check-order'
    }
]

const Navbar = () => {

    const [isModalVisible, setModalVisible] = useState(false)

    const { isOpenCartDrawer, setIsOpenCartDrawer } = useSaleContext()

    const handLoginPopup = () => {
        setModalVisible(true) // Hiện modal khi nhấn nút
    }

    const handleCloseModal = () => {
        setModalVisible(false) // Ẩn modal
    }

    return (
        <div className="shadow bg-white dark:bg-gray-900 dark:text-white duration-200 relative z-40">
            {/* upper Navbar */}
            <div className=" py-8">
                <div className="container flex justify-between items-center">
                    <div>
                        <a href="/"
                           className="text-2xl sm:text-3xl flex gap-2 text-black dark:text-white font-hm font-bold">
                            CANTH
                        </a>
                    </div>

                    <div>
                        <ul className="sm:flex hidden items-center gap-4">
                            {Menu.map((data) => (
                                <li key={data.id}>
                                    <a
                                        href={data.link}
                                        className="inline-block px-4 hover:text-primary duration-200 text-[18px] text-black dark:text-white font-hm font-bold"
                                    >
                                        {data.name}
                                    </a>
                                </li>
                            ))}
                            {/* Simple Dropdown and Links */}
                            <li className="group relative cursor-pointer">
                                <a href="#" className="flex items-center gap-[2px] py-2 ">
                                    <p className={' font-hm font-bold text-[18px] text-black'}>Sản Phẩm Hot</p>
                                    <span>
                                        <FaCaretDown className="transition-all duration-200 group-hover:rotate-180" />
                                    </span>
                                </a>
                                <div
                                    className="absolute z-[9999] hidden group-hover:block w-[200px] rounded-md bg-white p-2 text-black shadow-md">
                                    <ul>
                                        {DropdownLinks.map((data) => (
                                            <li key={data.id}>
                                                <a
                                                    href={data.link}
                                                    className="inline-block w-full rounded-md p-2 hover:bg-primary/20 "
                                                >
                                                    {data.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                    {/* search bar */}
                    <div className="flex justify-between items-center gap-4">
                        <div className="relative group hidden sm:block">
                            <input
                                type="text"
                                placeholder="search"
                                className="w-[250px] sm:w-[250px] group-hover:w-[300px] transition-all duration-300 rounded-none border-2 border-black px-2 py-1 focus:outline-none focus:border-1 focus:border-primary dark:border-gray-500 dark:bg-gray-800  "
                            />
                            <IoMdSearch
                                className="text-gray-500 group-hover:text-primary absolute top-1/2 -translate-y-1/2 right-3" />
                        </div>

                        {/* order button */}
                        <button
                            onClick={() => setIsOpenCartDrawer(!isOpenCartDrawer)}
                        >
                            <HiOutlineShoppingBag size={25} className={'text-black'}/>
                        </button>

                        <button
                            className=""
                            onClick={() => handLoginPopup()}
                        >
                            <HiUser size={25}  className={'text-black'}/>

                        </button>
                        <Login isVisible={isModalVisible} onClose={handleCloseModal} />
                        {/* Darkmode Switch */}
                        <div>
                            <DarkMode />
                        </div>
                    </div>
                </div>
            </div>
            {/* lower Navbar */}
            <div data-aos="zoom-in" className="flex justify-center">

            </div>
        </div>
    )
}

export default Navbar
