import {Fragment, useEffect, useState} from "react";
import {Badge, Button, Card, Input, Radio, Select} from "@/components/ui";
import {IAddress, IDistrict, IProvince, IWard} from "@/@types/address";
import {fetchFindAllDistricts, fetchFindAllProvinces, fetchFindAllWards} from "@/services/AddressService";
import {EPaymentMethod} from "@/views/manage/sell";
import {useNavigate, useParams} from "react-router-dom";
import instance from "@/axios/CustomAxios";
import {CartDetailResponseDTO, Color, ProductDetailResponseDTO, Size} from "@/views/sale/index";
import {HiDocumentRemove} from "react-icons/hi";
import {useToastContext} from "@/context/ToastContext";


// Định nghĩa cho các loại dữ liệu bên trong JSON
export interface Image {
    id: number;
    createdDate: string;
    updatedDate: string;
    code: string;
    url: string;
    deleted: boolean;
}

export interface Attribute {
    id: number;
    code: string;
    name: string;
    deleted: boolean;
    createdDate: string;
    modifiedDate?: string | null;
}

export interface Product {
    id: number;
    code: string;
    name: string;
    deleted: boolean;
    createdDate: string;
    updatedDate: string;
}

export interface ProductDetailResponseDTO {
    id: number;
    code: string;
    name: string;
    price: number;
    quantity: number;
    deleted: boolean;
    size: Attribute;
    color: Attribute;
    product: Product;
    texture: Attribute;
    origin: Attribute;
    brand: Attribute;
    collar: Attribute;
    sleeve: Attribute;
    style: Attribute;
    material: Attribute;
    thickness: Attribute;
    elasticity: Attribute;
    images: Image[];
    createdDate: string;
    modifiedDate?: string | null;
}

export interface CartDetailResponseDTO {
    id: number;
    code?: string | null;
    address?: string | null;
    phone?: string | null;
    recipientName?: string | null;
    provinceId?: number | null;
    provinceName?: string | null;
    districtId?: number | null;
    districtName?: string | null;
    wardId?: number | null;
    wardName?: string | null;
    deleted?: boolean | null;
    total?: number | null;
    deliveryFee?: number | null;
    discount?: number | null;
    subTotal?: number | null;
    quantity: number;
    productDetailResponseDTO: ProductDetailResponseDTO;
}

export interface VoucherResponseDTO {
    id: number;
    name: string;
    code: string;
    startDate: string;
    endDate: string;
    status: string;
    quantity: number;
    maxPercent: number;
    minAmount: number;
    typeTicket: string;
    customerId?: number | null;
    customerName?: string | null;
    customerEmail?: string | null;
}

export interface CartResponseDTO {
    id: number;
    code: string;
    address?: string | null;
    phone?: string | null;
    recipientName?: string | null;
    provinceId?: number | null;
    provinceName?: string | null;
    districtId?: number | null;
    districtName?: string | null;
    wardId?: number | null;
    wardName?: string | null;
    deleted: boolean;
    status: string;
    type?: string | null;
    payment?: string | null;
    total: number;
    deliveryFee: number;
    discount: number;
    subTotal: number;
    customerResponseDTO?: any;
    voucherResponseDTO?: VoucherResponseDTO | null;
    cartDetailResponseDTOS: CartDetailResponseDTO[];
}


const Checkout = () => {
    const [IAddress, setIAddress] = useState<IAddress>({})
    const [provinces, setProvinces] = useState<IProvince[]>([])
    const [districts, setDistricts] = useState<IDistrict[]>([])
    const [wards, setWards] = useState<IWard[]>([])

    const [paymentMethod, setPaymentMethod] = useState<EPaymentMethod>(EPaymentMethod.CASH)
    const [listCartDetailResponseDTO, setListCartDetailResponseDTO] = useState<CartDetailResponseDTO[]>([])
    const {id} = useParams();
    const [voucherCode, setVoucherCode] = useState()

    const [selectedCart, setSelectedCart] = useState<CartResponseDTO>()
    const nevigate = useNavigate();

    const {openNotification} = useToastContext()
    const handleVoucherCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVoucherCode(event.target.value);
    };
    const getUrlPayment = async (idOrder: number) => {
        instance.get(`/payment/vn-pay?amount=${selectedCart}&currency=VND&returnUrl=http://localhost:5173/client/payment/callback?idOrder=${idOrder}`).then(function (response) {
            if (response.status === 200 && response.data) {
                getDetailAboutCart();
            }
        })
    }

    const handleConfirmCart = async () => {

        if (selectedCart?.payment === "CASH") {
            const data = {
                "status": "PENDING"
            }
            await handleUpdateCart(data).then(() => {
                instance.get(`/orders/convert/${id}`).then(function (response) {
                    if (response.status === 200 && response.data) {
                        getDetailAboutCart();
                        nevigate("/client")
                        localStorage.removeItem("myCartId")
                    }
                })
            })
        } else if (selectedCart?.payment === "TRANSFER") {
            const data = {
                "status": "PENDING"
            }
            instance.put(`/cart/v2/${id}`, data).then(function (response) {
                if (response.status === 200 && response.data) {
                    instance.get(`/orders/convert/${id}`).then(function (response) {
                        if (response.status === 200 && response.data) {
                            const idOrder = response.data.id
                            const amount = Math.round(selectedCart.subTotal);
                            instance.get(`/payment/vn-pay?amount=${amount}&currency=VND&returnUrl=http://localhost:5173/client/payment/callback?idOrder=${idOrder}`).then(function (response) {
                                if (response.status === 200 && response.data) {
                                    const url = response?.data?.data?.paymentUrl
                                    console.log(url)
                                    if (url) {
                                        window.location.href = url // Mở đường dẫn mới
                                    }
                                }
                            })
                        }
                    })
                }
            })
            // if (selectedOrder) {
            //     setIsLoadingComponent(true)
            //     try {
            //         const response = await getUrlPayment(selectedOrder.id)
            //         console.log('Confirm payment')
            //         console.log(response)
            //         const url = response?.data?.data?.paymentUrl
            //         console.log(url)
            //         if (url) {
            //             window.location.href = url // Mở đường dẫn mới
            //         }
            //     } catch (error) {
            //         console.log(error)
            //     }
            //     setIsLoadingComponent(false)
            // }
        }
    }


    const handleUpdateCart = async (data: any) => {
        instance.put(`/cart/v2/${id}`, data).then(function (response) {
            if (response.status === 200 && response.data) {
                getDetailAboutCart();
            }
        })
    }

    const handleUseVoucher = async () => {
        const data = {
            "idCartId": id,
            "voucherCode": voucherCode
        }
        instance.post(`cart/use-voucher`, data).then(function (response) {
            console.log(response)
            if (response.status === 200 && response.data) {
                setSelectedCart(response.data)
            }
        }).catch(function (error) {
            console.log(error)
            console.log(error.response.data)
            openNotification(error.response.data.error)
        })
    }

    const getDetailAboutCart = async () => {
        instance.get(`cart/detail/${id}`).then(function (response) {
            console.log(response)
            if (response.status === 200 && response.data) {
                setSelectedCart(response.data)
                setPaymentMethod(response.data.payment)
            }
        })
    }

    useEffect(() => {
        instance.get(`cart-details/in-cart/${id}`).then(function (response) {
            console.log(response)
            if (response?.data) {
                setListCartDetailResponseDTO(response?.data)
            }
        })
        handleFindAllProvinces()
        getDetailAboutCart()
    }, []);

    useEffect(() => {
        if (IAddress.iprovince) {
            handleFindAllDistricts(IAddress.iprovince.ProvinceID)
            if (IAddress.idistrict) {
                handleFindAllWards(IAddress.idistrict.DistrictID)
            }
            const data = {
                address: IAddress.address,
                districtId: IAddress.idistrict?.DistrictID,
                districtName: IAddress.idistrict?.DistrictName,
                provinceId: IAddress.iprovince.ProvinceID,
                provinceName: IAddress.iprovince.ProvinceID,
                wardId: IAddress.iward?.WardCode,
                wardName: IAddress.iward?.WardName
            };
            handleUpdateCart(data)
        }
    }, [IAddress])

    const handleFindAllProvinces = async () => {
        const modifiedProvinces: IProvince[] = await fetchFindAllProvinces()
        setProvinces(modifiedProvinces)
    }

    const handleFindAllDistricts = async (idProvince: string) => {
        const modifiedDistricts: IDistrict[] = await fetchFindAllDistricts(idProvince)
        setDistricts(modifiedDistricts)
    }

    const handleFindAllWards = async (idDistrict: string) => {
        const modifiedWards: IWard[] = await fetchFindAllWards(idDistrict)
        setWards(modifiedWards)
    }

    const onChangeMethod = async (val: EPaymentMethod) => {
        setPaymentMethod(val)
        const data = {
            "payment": val
        }
        handleUpdateCart(data)
    }
    return (
        <Fragment>
            <div className="max-w-[1500px] mx-auto flex-col justify-center md:p-20 p-5">
                <div className={'grid xl:grid-cols-2 grid-cols-1 gap-5'}>
                    {/*BLOCK 1*/}
                    <Card className={'order-2 md:order-1'}>
                        <div className={'py-2 text-black text-[15px]'}>
                            <p>Thông tin giao hàng</p>
                        </div>
                        <div className={'flex flex-col gap-5'}>
                            <Input placeholder={'Họ và tên'}></Input>
                            <div className={'grid grid-cols-6 gap-2'}>
                                <div className={'col-span-4'}>
                                    <Input placeholder={'Email'}></Input>
                                </div>
                                <div className={'col-span-2'}>
                                    <Input placeholder={'Số điện thoại'}></Input>
                                </div>
                            </div>
                            <Input placeholder={'Địa chỉ'}></Input>

                            <div className={'grid grid-cols-3 gap-2'}>
                                <Select
                                    options={provinces}
                                    placeholder="Tỉnh/thành"
                                    onChange={(el) => {
                                        setIAddress((prev) => ({...prev, iprovince: (el as IProvince)}))
                                    }}
                                />
                                <Select
                                    options={districts}
                                    placeholder="Quận/huyện"
                                    onChange={(el) => {
                                        setIAddress((prev) => ({...prev, idistrict: (el as IDistrict)}))
                                    }}
                                />
                                <Select
                                    options={wards}
                                    placeholder="Xã/phường"
                                    onChange={(el) => {
                                        setIAddress((prev) => ({...prev, iward: (el as IWard)}))
                                    }}
                                />
                            </div>

                            <div>
                                <div className={'py-2 text-black text-[15px]'}>
                                    <p>Phương thức vận chuyển</p>
                                </div>
                                <div className={'py-4 px-4 rounded border border-gray-300'}>
                                    <Radio checked>Vận chuyển</Radio>
                                </div>
                            </div>
                            <div>
                                <div className={'py-2 text-black text-[15px]'}>
                                    Phương thức thanh toán
                                </div>
                                <div>
                                    <Radio.Group vertical className={'gap-1'} value={paymentMethod}
                                                 onChange={onChangeMethod}>
                                        <Radio value={EPaymentMethod.TRANSFER}>Thanh toán ngân hàng</Radio>
                                        <Radio value={EPaymentMethod.CASH}>Thanh toán khi nhận hàng</Radio>
                                    </Radio.Group>
                                </div>
                            </div>
                            {/*<button className="bg-black w-full py-2 font-thin rounded-md text-white">Xác nhận thông tin</button>*/}
                        </div>
                    </Card>
                    {/*BLOCK 2*/}
                    <Card className="order-1 md:order-2">
                        <div className="grid">
                            <div
                                className="dark:text-gray-500 bg-white flex flex-col justify-between">
                                <div>
                                    {/* CENTER */}
                                    <div className={`overflow-y-auto`}>
                                        {Array.isArray(listCartDetailResponseDTO) && listCartDetailResponseDTO.length > 0 && listCartDetailResponseDTO.map((item, index) => (
                                                <Fragment key={index}>
                                                    <div
                                                        className="text-[13.5px] grid grid-cols-12 gap-2 border-b border-dashed border-gray-400 py-3">
                                                        <div
                                                            className="inline-flex justify-center items-center col-span-4 gap-1">
                                                            <div>
                                                                <Badge content={item?.quantity} maxCount={9}>
                                                                    <img
                                                                        src={(item.productDetailResponseDTO as ProductDetailResponseDTO).images[0]?.url}
                                                                        className="w-[80px] object-cover"
                                                                        alt="Product"/>
                                                                </Badge>
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
                                                            <img className="w-24 h-24 object-cover"
                                                                 src="./OIP-removebg-preview.png"></img>
                                                        </div>
                                                        <div>
                                                            <span
                                                                className="font-thin">No have any product in your cart</span>
                                                        </div>
                                                    </div>
                                                </Fragment>
                                            )
                                        }
                                    </div>
                                    <br/>
                                    <hr/>
                                    <br/>

                                </div>
                                <div className={'grid grid-cols-6 gap-2 w-full'}>
                                    <div className={'col-span-4'}>
                                        <Input
                                            value={voucherCode}
                                            placeholder="Mã giảm giá"
                                            onChange={handleVoucherCodeChange}
                                        />
                                    </div>
                                    <div className={'col-span-2 w-full'}>
                                        <Button
                                            className={'w-full'}
                                            onClick={() => handleUseVoucher()}
                                        >Sử dụng</Button>
                                    </div>
                                </div>
                                {/* BOTTOM */}
                                <div className="text-sm">
                                    <div className="py-2 flex justify-between">
                                        <span>Tạm tính:</span>
                                        <span
                                            className="text-red-500 font-semibold">{(selectedCart as CartResponseDTO)?.subTotal?.toLocaleString('vi') ?? "n/a" + "₫"}</span>
                                    </div>
                                    <div className="py-2 flex justify-between">
                                        <span>Phí vận chuyển:</span>
                                        <span
                                            className="text-red-500 font-semibold">+ {(selectedCart as CartResponseDTO)?.deliveryFee?.toLocaleString('vi') + "₫"}</span>
                                    </div>
                                    <div className="py-2 flex justify-between">
                                        <span>Gỉảm giá:</span>
                                        <span
                                            className="text-red-500 font-semibold">- {(selectedCart as CartResponseDTO)?.discount?.toLocaleString('vi') + "₫"}</span>
                                    </div>
                                    <div className="py-2 flex justify-between">
                                        <span>Tổng tiền:</span>
                                        <span
                                            className="text-red-500 font-semibold">{(selectedCart as CartResponseDTO)?.total?.toLocaleString('vi') + "₫"}</span>
                                    </div>
                                    <button
                                        className="bg-black w-full py-2 font-thin rounded-md text-white"
                                        onClick={() => handleConfirmCart()}
                                    >Xác nhận đơn hàng
                                    </button>

                                </div>
                            </div>
                        </div>
                    </Card>

                </div>

            </div>
        </Fragment>
    )
}
export default Checkout