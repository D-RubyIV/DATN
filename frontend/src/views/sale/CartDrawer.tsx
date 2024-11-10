import Drawer from '@/components/ui/Drawer'
import {MouseEvent, useEffect} from 'react'
import {useSaleContext} from "@/views/sale/SaleContext";
import instance from "@/axios/CustomAxios";

const CartDrawer = () => {
    const {myCartId, isOpenCartDrawer, setIsOpenCartDrawer} = useSaleContext()

    const onDrawerClose = (e: MouseEvent) => {
        console.log('onDrawerClose', e)
        setIsOpenCartDrawer(false)
    }
    useEffect(() => {
        if (isOpenCartDrawer){
            const response = instance.get(`cart-details/in-cart/${myCartId}`)
            console.log(response)
        }
    }, [isOpenCartDrawer]);

    return (
        <Drawer
            title="Giỏ hàng của tôi"
            isOpen={isOpenCartDrawer}
            onClose={onDrawerClose}
            onRequestClose={onDrawerClose}
        >
            <div className={'flex flex-col justify-between'}>
                <div>
                    <div>

                    </div>
                </div>
                <div>
                </div>
            </div>
        </Drawer>
    )
}
export default CartDrawer