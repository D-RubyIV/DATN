import {Fragment} from "react";
import {Link} from "react-router-dom";
import {Button} from "@/components/ui";
import {HiReceiptPercent} from "react-icons/hi2";
import {HiShoppingBag} from "react-icons/hi";
import {useSaleContext} from "@/views/sale/SaleContext";

type MenuObject = {
    name: string,
    link: string
}

const Navbar = () => {
    const {isOpenCartDrawer, setIsOpenCartDrawer} = useSaleContext();
    const navbarL1: MenuObject[] = [
        {
            name: "Trang chủ",
            link: ""
        },
        {
            name: "Sản phẩm",
            link: ""
        },
        {
            name: "Hệ thống cửa hàng",
            link: ""
        },
        {
            name: "Liên hệ",
            link: ""
        },
    ]
    return (
        <Fragment>
            <div className={'flex justify-between gap-5 items-center px-[100px]'}>
                <div>
                    <img
                        height={'100px'}
                        width={'200px'}
                        alt={""}
                        src={'https://theme.hstatic.net/200000690725/1001078549/14/logo.png?v=561'}
                    />
                </div>
                <div className={'flex justify-center gap-10 py-10'}>
                    {
                        navbarL1.map((item, index) => (
                            <Fragment key={index}>
                                <Link to={item.link}>
                                    <p className={'font-semibold text-black text-[15px]'}>{item.name}</p>
                                </Link>
                            </Fragment>
                        ))
                    }
                </div>
                <div>
                    <div>
                        <Button icon={<HiReceiptPercent/>} variant={'plain'}></Button>
                        <Button icon={<HiShoppingBag/>} variant={'plain'} onClick={() => setIsOpenCartDrawer(true)}>Giỏ hàng</Button>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
export default Navbar;