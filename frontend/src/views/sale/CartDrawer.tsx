import {Fragment, useEffect, useState} from 'react'
import {useSaleContext} from "@/views/sale/SaleContext";
import instance from "@/axios/CustomAxios";
import CloseButton from "@/components/ui/CloseButton";
import {HiDocumentRemove, HiMinusCircle, HiPlusCircle} from "react-icons/hi";
import {CartDetailResponseDTO, Color, ProductDetailResponseDTO, Size} from "@/views/sale/index";
import {Link} from "react-router-dom";

const CartDrawer = () => {
    const {myCartId, isOpenCartDrawer, setIsOpenCartDrawer} = useSaleContext()

    const [listCartDetailResponseDTO, setListCartDetailResponseDTO] = useState<CartDetailResponseDTO[]>([])
    useEffect(() => {
        if (isOpenCartDrawer) {
           instance.get(`cart-details/in-cart/${myCartId}`).then(function (response){
               console.log(response)
               if (response?.data) {
                   setListCartDetailResponseDTO(response?.data)
               }
            })
        }
    }, [isOpenCartDrawer]);

    return (

        <Fragment>
            <div
                className={`z-40 fixed h-[100svh] top-0 from-indigo-900 bg-gradient-to-l rounded-md 2xl:w-3/12 md:w-4/12 transition-all duration-500 block ${isOpenCartDrawer ? "right-0" : "-right-full"}`}>
                <div className="grid h-[100svh]">
                    <div
                        className="dark:text-gray-500 bg-white px-6 md:px-10 py-4 flex flex-col justify-between">
                        <div>
                            {/* TOP */}
                            <div className="flex justify-between py-3 md:py-4 row-span-4">
                                <div><span className="text-xl font-semibold text-gray-600">Giỏ hàng</span></div>
                                <div>
                                    <CloseButton onClick={() => setIsOpenCartDrawer(false)}></CloseButton>
                                </div>
                            </div>
                            {/* CENTER */}
                            <div className={`overflow-y-auto h-[calc(100svh-10.75rem)]`}>
                                {Array.isArray(listCartDetailResponseDTO) && listCartDetailResponseDTO.length > 0 && listCartDetailResponseDTO.map((item, index) => (
                                        <Fragment key={index}>
                                            <div
                                                className="text-[13.5px] grid grid-cols-12 gap-2 border-b border-dashed border-gray-400 py-3">
                                                <div className="inline-flex justify-center items-center col-span-4 gap-1">
                                                    <div>
                                                        <img src={(item.productDetailResponseDTO as ProductDetailResponseDTO).images[0]?.url} className="w-[25vw] object-cover" alt="Product"/>
                                                    </div>
                                                </div>
                                                <div className="col-span-8">
                                                    <div className="flex items-center">
                                                            <span className="font-medium text-[12.5px]">
                                                                {(item.productDetailResponseDTO as ProductDetailResponseDTO)?.code}
                                                            </span>
                                                        <span className="font-medium text-red-600 ">
                                                                <button className="active:bg-red-400 p-1 rounded-full"
                                                                ><HiDocumentRemove/></button>
                                                            </span>
                                                    </div>
                                                    <div className="text-sm font-thin">
                                                        <span>{((item.productDetailResponseDTO as ProductDetailResponseDTO)?.color as Color)?.name}</span>
                                                        {" / "}
                                                        <span>{((item.productDetailResponseDTO as ProductDetailResponseDTO)?.size as Size)?.name}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <div
                                                            className="flex gap-2 text-gray-400 duration-100 items-center">
                                                            <button
                                                                className="active:text-gray-900 active:text-[15px] ease-in-out"
                                                            ><HiPlusCircle/></button>
                                                            <div className="text-gray-900">
                                                                <span>{item?.quantity}</span>
                                                            </div>
                                                            <button
                                                                className="active:text-gray-900 active:text-[15px] ease-in-out"
                                                            ><HiMinusCircle/></button>
                                                        </div>
                                                        <div>
                                                                    <span
                                                                        className="font-semibold">{(item.productDetailResponseDTO as ProductDetailResponseDTO)?.price.toLocaleString("vi-VN") + "₫"}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end">
                                                                <span
                                                                    className="text-[12.5px]">Kho: {(item.productDetailResponseDTO as ProductDetailResponseDTO).quantity}</span>
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
                                                    <img className="w-24 h-24 object-cover" src="./OIP-removebg-preview.png"></img>
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

                            <div className="py-2 flex justify-between">
                                <span>Tổng tiền:</span>
                                <span className="text-red-500 font-semibold">
                                    {(() => {
                                        let quantity = 0;
                                        listCartDetailResponseDTO.forEach((item) => {
                                            quantity += item.quantity * (item.productDetailResponseDTO as ProductDetailResponseDTO)?.price;
                                        });
                                        return quantity.toLocaleString("vi-VN") + "₫";
                                    })()}
                                </span>
                            </div>
                            <Link to={`/checkout/${myCartId}`}>
                                <button className="bg-black w-full py-2 font-thin rounded-md text-white">Thanh toán
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