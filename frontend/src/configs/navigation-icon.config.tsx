import { FiShoppingBag, FiUser } from 'react-icons/fi'
import { CiDiscount1 } from "react-icons/ci";
import {
    HiOutlineColorSwatch,
    HiOutlineDesktopComputer,
    HiOutlineTemplate,
    HiOutlineViewGridAdd,
    HiOutlineHome,
} from 'react-icons/hi'
import { GiClothes } from 'react-icons/gi';
import { FaAddressBook } from 'react-icons/fa';
import { RiBillLine } from 'react-icons/ri';

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <HiOutlineHome />,
    cart: <FiShoppingBag />,
    customer: <FiUser />,
    voucher: <CiDiscount1 />,
    product: <GiClothes />,
    staff: <FaAddressBook />,
    order: <RiBillLine />,
    singleMenu: <HiOutlineViewGridAdd />,
    collapseMenu: <HiOutlineTemplate />,
    groupSingleMenu: <HiOutlineDesktopComputer />,
    groupCollapseMenu: <HiOutlineColorSwatch />,
}

export default navigationIcon
