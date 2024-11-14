import { Fragment } from 'react'
import { useSaleContext } from '@/views/sale/SaleContext'
import CloseButton from '@/components/ui/CloseButton'
import { HiDocumentRemove, HiMinusCircle, HiPlusCircle } from 'react-icons/hi'
import { CartDetailResponseDTO, Color, ProductDetailResponseDTO, Size } from '@/views/sale/index'
import { Link } from 'react-router-dom'
import { Avatar } from '@/components/ui'
import instance from '@/axios/CustomAxios'
import { FiPackage } from 'react-icons/fi'

const CartDrawer = () => {
    const {
        getCartDetailInCard,
        listCartDetailResponseDTO,
        setListCartDetailResponseDTO,
        myCartId,
        isOpenCartDrawer,
        setIsOpenCartDrawer
    } = useSaleContext()

    const handleChangeQuantity = async (item: CartDetailResponseDTO, isIncrease: boolean) => {
        const quantity = isIncrease ? item.quantity += 1 : item.quantity -= 1
        instance.get(`http://localhost:8080/api/v1/cart-details/quantity/update/${item.id}?quantity=${quantity}`).then(function(response) {
            console.log(response)
            if (response.status === 200) {
                getCartDetailInCard()
            }
        })
    }

    return (
        <Fragment>
            <div
                className={`z-40 fixed border-2 rounded-none border-black h-[100svh] top-0 from-indigo-900 bg-gradient-to-l 2xl:w-3/12 md:w-4/12 transition-all duration-500 block ${isOpenCartDrawer ? 'right-0' : '-right-full'}`}>
                <div className="grid h-[100svh]">
                    <div
                        className="dark:text-gray-500 bg-white flex flex-col justify-between">
                        <div>
                            {/* TOP */}
                            <div className="flex justify-between py-3 md:py-4 row-span-4 border-black border-b-2 p-5">
                                <div><span className="text-xl font-semibold font-hm text-black">Giỏ hàng</span></div>
                                <div>
                                    <CloseButton className={'text-xl text-black'}
                                                 onClick={() => setIsOpenCartDrawer(false)}></CloseButton>
                                </div>
                            </div>
                            {/* CENTER */}
                            <div className={`overflow-y-auto h-[calc(100svh-10.75rem)] px-5`}>
                                {Array.isArray(listCartDetailResponseDTO) && listCartDetailResponseDTO.length > 0 && listCartDetailResponseDTO.map((item, index) => (
                                        <Fragment key={index}>
                                            <div
                                                className="text-[13.5px] grid grid-cols-12 gap-2 border-b border-black py-3">
                                                <div className="inline-flex justify-center items-center col-span-4 gap-1">
                                                    <div>
                                                        {
                                                            Array.isArray((item.productDetailResponseDTO as ProductDetailResponseDTO).images) && (item.productDetailResponseDTO as ProductDetailResponseDTO).images.length > 0 ?
                                                                (<Avatar size={100}
                                                                         shape={'round'}
                                                                         src={(item.productDetailResponseDTO as ProductDetailResponseDTO).images[0]?.url}
                                                                         className="object-cover" alt="Product" />) :
                                                                (<Avatar size={100}
                                                                         icon={<FiPackage />}
                                                                         className="object-cover" alt="Product" />)
                                                        }

                                                    </div>
                                                </div>
                                                <div className="col-span-8">
                                                    <div className="flex items-center">
                                                        <span
                                                            className="text-[16px] font-hm text-black font-semibold text-xl">
                                                                {(item.productDetailResponseDTO as ProductDetailResponseDTO)?.name}
                                                        </span>

                                                    </div>
                                                    <div className="font-hm text-black font-semibold text-[15px] pb-1">
                                                        <span>Màu: </span>
                                                        <span>{((item.productDetailResponseDTO as ProductDetailResponseDTO)?.color as Color)?.name}</span>
                                                    </div>
                                                    <div className="font-hm text-black font-semibold text-[15px] pb-1">
                                                        <span>Size: </span>
                                                        <span>{((item.productDetailResponseDTO as ProductDetailResponseDTO)?.size as Size)?.name}</span>
                                                    </div>
                                                    <div className="font-hm text-black font-semibold text-[15px] pb-1">
                                                        <span>Đơn giá: </span>
                                                        <span className={'text-red-500'}>{Math.round(((item.productDetailResponseDTO as ProductDetailResponseDTO)?.price))?.toLocaleString('vi') + "đ"}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <div
                                                            className="flex gap-2 text-gray-400 duration-100 items-center">
                                                            <button
                                                                onClick={() => handleChangeQuantity(item, true)}
                                                                className="active:text-gray-900 active:text-[15px] ease-in-out"
                                                            >
                                                                <HiPlusCircle size={20} />
                                                            </button>
                                                            <div className="text-gray-900">
                                                                <span>{item?.quantity}</span>
                                                            </div>
                                                            <button
                                                                onClick={() => handleChangeQuantity(item, false)}
                                                                className="active:text-gray-900 active:text-[15px] ease-in-out"
                                                            >
                                                                <HiMinusCircle size={20} />
                                                            </button>
                                                        </div>
                                                        <div>
                                                            <span
                                                                className="font-semibold text-red-500">{Math.round(((item.productDetailResponseDTO as ProductDetailResponseDTO)?.price * item.quantity))?.toLocaleString('vi') + "đ"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end">
                                                        <span
                                                            className="text-[12.5px] text-black">Kho: {(item.productDetailResponseDTO as ProductDetailResponseDTO).quantity}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Fragment>
                                    ))
                                    ||
                                    (
                                        <Fragment>
                                            <div className="flex flex-col justify-center items-center h-full">
                                                <div>
                                                    <img className="w-24 h-24 object-cover"
                                                         src="/img/OIP-removebg-preview.png"></img>
                                                </div>
                                                <div>
                                                    <span className="font-thin">No have any product in your cart</span>
                                                </div>
                                            </div>
                                        </Fragment>
                                    )
                                }
                            </div>
                        </div>
                        {/* BOTTOM */}
                        <div className="text-sm">
                            <div className="py-2 flex justify-between font-hm text-xl px-5">
                                <span className={'text-black !font-hm font-semibold'}>Tổng tiền:</span>
                                <span className="text-red-500 font-semibold">
                                    {(() => {
                                        let quantity = 0
                                        listCartDetailResponseDTO.forEach((item) => {
                                            quantity += item.quantity * (item.productDetailResponseDTO as ProductDetailResponseDTO)?.price
                                        })
                                        return quantity.toLocaleString('vi-VN') + '₫'
                                    })()}
                                </span>
                            </div>
                            <Link to={`/checkout/${myCartId}`}>
                                <button
                                    className="bg-black text-white w-full font-thin border border-black font-hm text-xl py-5">Thanh
                                    toán
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
export default CartDrawer