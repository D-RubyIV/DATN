import React, { useEffect, useState } from 'react'
import { FaCaretDown } from 'react-icons/fa'
import { useSaleContext } from '@/views/sale/SaleContext'
import { HiOutlineMenu, HiOutlineShoppingBag, HiUser, HiUserCircle } from 'react-icons/hi'
import AuthModal from '../Popup/AuthModal'
import { useAuth } from '../auth/AuthContext'
import { getUserDetail } from '../auth/api'


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
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const { isOpenCartDrawer, setIsOpenCartDrawer } = useSaleContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user, setUser } = useAuth();


    const handleLoginClick = () => {
        setIsModalOpen(true);
    };

    const handleLogoutClick = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        // Reset user state after logout
        setIsModalOpen(false); // Đóng modal khi đăng xuất
        setDropdownVisible(false);
        setUser(null);
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
    }, [user]);



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
                            {user ? (
                                <>
                                    {/* User Dropdown */}
                                    <button id="user-button" onClick={() => setDropdownVisible(!dropdownVisible)} className="menu-title flex items-center gap-2 text-black dark:text-white hover:text-gray-600 transition-colors">
                                        <HiUserCircle size={25} />
                                        <span className="text-sm font-medium text-black dark:text-white">{user.username}</span>
                                    </button>
                                    {dropdownVisible && (
                                        <div id="user-dropdown" className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    <HiUserCircle className="text-gray-500" size={30} />
                                                    <div>
                                                        <p className="text-sm font-medium text-black dark:text-white menu-title">{user.username}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleLogoutClick}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                            >
                                                Đăng xuất
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <button
                                    onClick={handleLoginClick}
                                    className="flex items-center gap-2 text-white hover:text-gray-600 transition-colors"
                                >
                                    <HiUser size={25} />
                                    <span className="text-sm font-medium">Đăng nhập</span>
                                </button>
                            )}

                            {/* Auth Modal */}
                            <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
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


// {
//     "message": "Get user's detail successfully",
//     "status": "OK",
//     "data": {
//         "username": "hungit2301@gmail.com",
//         "status": "Ho?t Ð?ng",
//         "enabled": true,
//         "roleName": null,
//         "provider": null,
//         "socialId": null
//     }
// }

// {
//     "message": "Login successfully",
//     "status": "OK",
//     "data": {
//         "tokenType": "Bearer",
//         "id": 5,
//         "username": "hungit2301@gmail.com",
//         "roles": [
//             "ROLE_CUSTOMER"
//         ],
//         "message": "Login successfully",
//         "token": "eyJhbGciOiJIUzI1NiJ9.eyJhY2NvdW50SWQiOjUsInN1YmplY3QiOiJodW5naXQyMzAxQGdtYWlsLmNvbSIsInN1YiI6Imh1bmdpdDIzMDFAZ21haWwuY29tIiwiZXhwIjoxNzMyMTg3NDMxfQ.oSgVWSTw1RMyJJCloRoQ3Hp4ixi-zvsL5eNHqXyrcbs",
//         "refresh_token": "7eb4c679-ea02-4ba0-b5e7-0fae13b2203a"
//     }
// }

// vay la do cai dropdown soa ychacws ko phai