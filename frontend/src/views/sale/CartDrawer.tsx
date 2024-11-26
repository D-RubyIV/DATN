import { Fragment } from 'react'
import { useSaleContext } from '@/views/sale/SaleContext'
import CloseButton from '@/components/ui/CloseButton'
import { HiMinusCircle, HiPlusCircle } from 'react-icons/hi'
import { CartDetailResponseDTO, Color, ProductDetailResponseDTO, Size } from '@/views/sale/index'
import { Link } from 'react-router-dom'
import { Avatar } from '@/components/ui'
import instance from '@/axios/CustomAxios'
import { FiPackage } from 'react-icons/fi'
import { Delete } from '@mui/icons-material'

const CartDrawer = () => {
    const {
        getCartDetailInCard,
        listCartDetailResponseDTO,
        myCartId,
        isOpenCartDrawer,
        setIsOpenCartDrawer
    } = useSaleContext()

    const handleChangeQuantity = async (item: CartDetailResponseDTO, isIncrease: boolean) => {
        const quantity = isIncrease ? item.quantity += 1 : item.quantity -= 1
        instance.get(`http://localhost:8080/api/v1/cart-details/quantity/update/${item.id}?quantity=${quantity}`).then(function (response) {
            console.log(response)
            if (response.status === 200) {
                getCartDetailInCard()
            }
        })
    }

    const handleRemoveItem = async (itemId: number) => {
        instance.delete(`http://localhost:8080/api/v1/cart-details/remove/${itemId}`).then((response) => {
            if (response.status === 200) {
                getCartDetailInCard();
            }
        });
    };

    const getFinalPrice = (item: CartDetailResponseDTO) => {
        const { price, product } = item.productDetailResponseDTO;
        const discountPercent = product.eventDTOList.length > 0
            ? product.nowAverageDiscountPercentEvent
            : 0;

        return Math.round(price * (1 - discountPercent / 100));
    };



    const PriceProductDetail = ({ item }: { item: CartDetailResponseDTO }) => {
        const getFinalPrice = (item: CartDetailResponseDTO) => {
            const { price, product } = item.productDetailResponseDTO;
            const discountPercent = product.eventDTOList.length > 0
                ? product.nowAverageDiscountPercentEvent
                : 0;

            return Math.round(price * (1 - discountPercent / 100));
        };

        const { productDetailResponseDTO } = item;

        return (
            <div>
                {productDetailResponseDTO.product.eventDTOList.length > 0 ? (
                    <p className={'flex gap-3 text-red-600'}>
                        <span>{getFinalPrice(item).toLocaleString('vi') + ' đ'}</span>
                        <span
                            className={'line-through'}>{Math.round(productDetailResponseDTO.price).toLocaleString('vi') + ' đ'}
                        </span>
                    </p>
                ) : (
                    <p>
                        <span>{getFinalPrice(item).toLocaleString("vi") + " đ"}</span>
                    </p>
                )}
            </div>
        );
    };


    return (
        <Fragment>
            <div
                className={`z-40 fixed border-gray-200 rounded-none h-[100svh] top-0 from-indigo-900 bg-gradient-to-l 2xl:w-3/12 md:w-4/12 transition-all duration-500 block ${isOpenCartDrawer ? 'right-0' : '-right-full'}`}>
                <div className="grid h-[100svh]">
                    <div
                        className="dark:text-gray-500 bg-white flex flex-col justify-between">
                        <div>
                            {/* TOP */}
                            <div className="flex justify-between py-3 md:py-4 row-span-4 border-black border-b-0 p-5">
                                <div><span className="text-xl font-semibold font-hm text-black">Giỏ hàng</span></div>
                                <div>
                                    <CloseButton className={'text-xl text-black'}
                                        onClick={() => setIsOpenCartDrawer(false)}></CloseButton>
                                </div>
                            </div>
                            {/* CENTER */}
                            <div className="overflow-y-auto h-[calc(100svh-10.75rem)] px-5">
                                {Array.isArray(listCartDetailResponseDTO) && listCartDetailResponseDTO.length > 0 ? (
                                    listCartDetailResponseDTO.map((item, index) => (
                                        <Fragment key={index}>
                                            <div className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm">
                                                <div className="flex gap-4">
                                                    <div className="relative w-24 h-24">
                                                        {Array.isArray((item.productDetailResponseDTO as ProductDetailResponseDTO).images) &&
                                                            (item.productDetailResponseDTO as ProductDetailResponseDTO).images.length > 0 ? (
                                                            <Avatar
                                                                size={100}
                                                                shape="round"
                                                                src={(item.productDetailResponseDTO as ProductDetailResponseDTO).images[0]?.url}
                                                                className="object-cover"
                                                                alt="Product"
                                                            />
                                                        ) : (
                                                            <Avatar
                                                                size={100}
                                                                icon={<FiPackage />}
                                                                className="object-cover"
                                                                alt="Product"
                                                            />
                                                        )}
                                                        {Number(item.productDetailResponseDTO.product.nowAverageDiscountPercentEvent) > 0 && (
                                                            <div className="absolute top-0 right-0 px-[4px] py-[2px] bg-red-600 text-white text-xs rounded">
                                                                -{item.productDetailResponseDTO.product.nowAverageDiscountPercentEvent}%
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-bold text-black mb-1">
                                                            {(item.productDetailResponseDTO as ProductDetailResponseDTO)?.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-700">
                                                            <span className="font-medium">Màu: </span>
                                                            {((item.productDetailResponseDTO as ProductDetailResponseDTO)?.color as Color)?.name}
                                                        </p>
                                                        <p className="text-sm text-gray-700">
                                                            <span className="font-medium">Size: </span>
                                                            {((item.productDetailResponseDTO as ProductDetailResponseDTO)?.size as Size)?.name}
                                                        </p>
                                                        <p className="text-sm text-gray-700 flex items-center gap-1">
                                                            <span className="font-medium">Đơn giá:</span>
                                                            <PriceProductDetail item={item} />
                                                        </p>

                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center mt-4">
                                                    {/* Thay đổi số lượng */}
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => handleChangeQuantity(item, true)}
                                                            className="text-gray-700 hover:text-black"
                                                        >
                                                            <HiPlusCircle size={20} />
                                                        </button>
                                                        <span className="text-gray-900 font-medium">{item?.quantity}</span>
                                                        <button
                                                            onClick={() => handleChangeQuantity(item, false)}
                                                            className="text-gray-700 hover:text-black"
                                                        >
                                                            <HiMinusCircle size={20} />
                                                        </button>
                                                    </div>

                                                    {/* Tổng giá */}
                                                    <span className="font-semibold text-red-600">
                                                        {(getFinalPrice(item) * item.quantity).toLocaleString("vi") + " đ"}
                                                    </span>
                                                </div>

                                                {/* Kho và nút xóa */}
                                                <div className="flex justify-between items-center mt-2">
                                                    <span className="text-sm text-gray-500">Kho: {item.productDetailResponseDTO.quantity}</span>
                                                    <button
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        className="text-red-600 hover:text-red-800 text-sm"
                                                    >
                                                        <Delete />
                                                    </button>
                                                </div>
                                            </div>
                                        </Fragment>
                                    ))
                                ) : (
                                    <div className="flex flex-col justify-center items-center h-full">
                                        <div>
                                            <img
                                                className="w-24 h-24 object-cover"
                                                src="/img/OIP-removebg-preview.png"
                                                alt="Empty cart"
                                            />
                                        </div>
                                        <p className="font-thin">No have any product in your cart</p>
                                    </div>
                                )}
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
                                            quantity += item.quantity * getFinalPrice(item)
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