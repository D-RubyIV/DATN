import React, { useState } from 'react'
import Logo from '../../../assets/logo.png'
import { IoMdSearch } from 'react-icons/io'
import { FaCartShopping } from 'react-icons/fa6'
import { FaCaretDown, FaUser } from 'react-icons/fa'
import DarkMode from './DarkMode'
import Login from '../Popup/Login'
import { useSaleContext } from '@/views/sale/SaleContext'
import { HiMenu, HiOutlineMenu, HiOutlineShoppingBag, HiShoppingBag, HiUser, HiUserCircle } from 'react-icons/hi'

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
        <div className="relative top-0 shadow text-black dark:text-white duration-200 w-full z-40 navbar">
            {/* upper Navbar */}
            <div className=" py-8">
                <div className="px-[8%] flex justify-between items-center">
                    <div>
                        <a href="/"
                           className="md:text-4xl sm:text-3xl flex gap-2 text-black dark:text-white font-hm font-bold menu-title">
                            CANTH
                        </a>
                    </div>

                    <div>
                        <ul className="sm:flex hidden items-center gap-4">
                            {Menu.map((data) => (
                                <li key={data.id}>
                                    <a
                                        href={data.link}
                                        className="inline-block px-4 duration-200 text-xl hover:underline hover:text-gray-200 underline-offset-4 text-black dark:text-white font-sans font-bold menu-title"
                                    >
                                        {data.name}
                                    </a>
                                </li>
                            ))}
                            {/* Simple Dropdown and Links */}

                        </ul>
                    </div>
                    {/* search bar */}
                    <div className="flex justify-between items-center gap-4">
                        {/*<div className="relative group hidden sm:block">*/}
                        {/*    <input*/}
                        {/*        type="text"*/}
                        {/*        placeholder="Tìm kiếm"*/}
                        {/*        className="w-[250px] sm:w-[250px] group-hover:w-[300px] transition-all duration-300 rounded-none border-2 border-black px-2 py-1 focus:outline-none focus:border-1 focus:border-primary dark:border-gray-500   "*/}
                        {/*    />*/}
                        {/*    <IoMdSearch*/}
                        {/*        className="text-gray-500 group-hover:text-primary absolute top-1/2 -translate-y-1/2 right-3" />*/}
                        {/*</div>*/}
                        {/* order button */}

                        <div>
                            <ul>
                                <li className="group relative cursor-pointer">
                                    <a href="#" className="flex items-center">
                                        <p className={'text-black menu-title'}>
                                            <HiOutlineMenu size={25} />
                                        </p>
                                        <p>
                                            <FaCaretDown
                                                className="transition-all duration-200 group-hover:rotate-180 text-xl" />
                                        </p>
                                    </a>
                                    <div
                                        className="absolute z-[9999] hidden group-hover:block w-[250px] rounded-md  p-2 text-black shadow-md">
                                        <ul>
                                            {DropdownLinks.map((data) => (
                                                <li key={data.id}>
                                                    <a
                                                        href={data.link}
                                                        className="inline-block w-full rounded-md p-2 hover:text-white hover:bg-gray-100 hover:bg-opacity-50 text-black menu-title"
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

                        <button
                            className="text-black menu-title"
                            onClick={() => setIsOpenCartDrawer(!isOpenCartDrawer)}
                        >
                            <HiOutlineShoppingBag size={25} />
                        </button>

                        <button
                            className="text-black menu-title"
                            onClick={() => handLoginPopup()}
                        >
                            <div>
                                <HiUser size={25} />
                            </div>
                        </button>
                        <Login isVisible={isModalVisible} onClose={handleCloseModal} />
                        {/* Darkmode Switch */}
                        {/*<div>*/}
                        {/*    <DarkMode />*/}
                        {/*</div>*/}

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
