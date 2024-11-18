import React, { useEffect, useState } from 'react'
import Logo from '../../../assets/logo.png'
import { IoMdSearch } from 'react-icons/io'
import { FaCartShopping } from 'react-icons/fa6'
import { FaCaretDown, FaUser } from 'react-icons/fa'
import { useSaleContext } from '@/views/sale/SaleContext'
import { HiMenu, HiOutlineMenu, HiOutlineShoppingBag, HiShoppingBag, HiUser, HiUserCircle } from 'react-icons/hi'
import LoginModal from '../Popup/LoginModal'

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
    const [isModalOpen, setModalOpen] = useState(false);
    const [user, setUser] = useState<{ email: string } | null>(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const { isOpenCartDrawer, setIsOpenCartDrawer } = useSaleContext()

    const handleLoginSuccess = (userData: { email: string }) => {
        setUser(userData);
    };


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const dropdown = document.getElementById('user-dropdown');
            const userButton = document.getElementById('user-button');
            if (
                dropdown &&
                !dropdown.contains(event.target as Node) &&
                !userButton?.contains(event.target as Node)
            ) {
                setDropdownVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const handLoginPopup = () => {
        setModalVisible(true)
    }

    const handleCloseModal = () => {
        setModalVisible(false)
    }

    const handleLogout = () => {
        setUser(null);
        setDropdownVisible(false);
    };


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

                        <div className="relative">
                            <button
                                id="user-button"
                                onClick={() => user ? setDropdownVisible(!dropdownVisible) : setModalOpen(true)}
                                className="flex items-center gap-2 text-white hover:text-gray-600 transition-colors"
                            >
                                <HiUser size={25} />
                                <span className="text-sm font-medium">
                                    {user ? user.email : 'Đăng nhập'}
                                </span>
                            </button>

                            {/* User Dropdown */}
                            {user && dropdownVisible && (
                                <div
                                    id="user-dropdown"
                                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                                >
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <HiUser className="text-white" size={30} />
                                            <div>
                                                <p className="text-sm font-medium text-white">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            )}

                            {/* Login Modal */}
                            <LoginModal
                                isOpen={isModalOpen}
                                onClose={() => setModalOpen(false)}
                                onLoginSuccess={handleLoginSuccess}
                            />
                        </div>

                    </div>
                </div>
            </div>
            {/* lower Navbar */}
            <div data-aos="zoom-in" className="flex justify-center">

            </div>
        </div >
    )
}

export default Navbar
