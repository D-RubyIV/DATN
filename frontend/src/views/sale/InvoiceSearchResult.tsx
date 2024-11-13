import React, {Fragment, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import instance from "@/axios/CustomAxios";
import {OrderResponseDTO} from "@/@types/order";
import {Avatar,  Steps} from "@/components/ui";
import {FiPackage} from "react-icons/fi";

const InvoiceSearchResult = () => {
    const {codeOrder} = useParams();
    const [orderResponseDTO, setOrderResponseDTO] = useState<OrderResponseDTO>()

    const getDetailOrder = () => {
        instance.get(`orders/by-code/${codeOrder}`).then(function (response) {
            console.log(response)
            if (response.status === 200 && response.data) {
                setOrderResponseDTO(response.data)
            }
        })
    }

    useEffect(() => {
        console.log("ID ORDER: ", codeOrder)
        getDetailOrder()
    }, []);

    return (
        <Fragment>
            <div className={'p-10 grid grid-cols-12 gap-10'}>
                {/**/}
                <div className={'col-span-2 border-r-2 border-black'}>
                    <div className={'pb-10'}>
                        <p className={'text-xl font-semibold text-black'}>Lịch sử đơn hàng</p>
                    </div>
                    {
                        orderResponseDTO && Array.isArray(orderResponseDTO.historyResponseDTOS) &&
                        (
                            <Steps current={orderResponseDTO.historyResponseDTOS.length} vertical>
                                {
                                    orderResponseDTO.historyResponseDTOS.map((item, index) => (
                                        <Steps.Item
                                            key={index}
                                            title={item.status}
                                            description={item.note}>
                                        </Steps.Item>
                                    ))
                                }
                            </Steps>
                        )

                    }
                </div>

                {/**/}
                <div className={'grid grid-cols-2 col-span-3 border-r-2 border-black'}>
                    <div>
                        <div>
                            <p className={'text-xl font-semibold text-black'}>Thông tin đơn hàng</p>
                        </div>
                        <div className={'pb-5 flex flex-col gap-2 py-2'}>
                            <div>
                                <p>Tên người nhận: {orderResponseDTO?.recipientName}</p>
                            </div>
                            <div>
                                <p>Số điện thoại: {orderResponseDTO?.phone}</p>
                            </div>
                            <div>
                                <p>Địa chỉ: {orderResponseDTO?.address}</p>
                            </div>
                            <div>
                                <p>Hình thức thanh
                                    toán: {orderResponseDTO?.payment === "CASH" ? "Tiền mặt" : "Chuyển khoản"}</p>
                            </div>
                            <div>
                                <p>Tổng tiền
                                    toán: {orderResponseDTO?.payment === "CASH" ? "Tiền mặt" : "Chuyển khoản"}</p>
                            </div>
                            <div>
                                <p>Giảm giá
                                    toán: {orderResponseDTO?.payment === "CASH" ? "Tiền mặt" : "Chuyển khoản"}</p>
                            </div>
                            <div>
                                <p>Tổng thanh toán
                                    toán: {orderResponseDTO?.payment === "CASH" ? "Tiền mặt" : "Chuyển khoản"}</p>
                            </div>
                        </div>
                        <div className={'pb-5'}>
                            <div>
                                <p className={'text-xl font-semibold text-black'}>Trạng thái đơn hàng</p>
                                <div>
                                    <p>Trạng thái: {orderResponseDTO?.status}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                {/*    */}
                <div className={'border-r-2 border-black col-span-2'}>
                    <div>
                        <p className={'text-xl font-semibold text-black'}>Thông tin thanh toán</p>
                    </div>
                    <div className={'pb-5 flex flex-col gap-2 py-2'}>
                        <div>
                            <p className={'text-red-500'}>Tổng
                                tiền: {Math.round(Number(orderResponseDTO?.subTotal)).toLocaleString('vi') + "đ"}</p>
                        </div>
                        <div>
                            <p className={'text-red-500'}>Giảm
                                giá: {Math.round(Number(orderResponseDTO?.subTotal)).toLocaleString('vi') + "đ"}</p>
                        </div>
                        <div>
                            <p className={'text-red-500'}>Tổng thanh
                                toán: {Math.round(Number(orderResponseDTO?.subTotal)).toLocaleString('vi') + "đ"}</p>
                        </div>
                    </div>
                </div>
                {/**/}
                <div className={'col-span-5'}>
                    <div className={'pb-5'}>
                        <div>
                            <p className={'text-xl font-semibold text-black'}>Danh sách sản phẩm</p>
                            <div>
                                {
                                    orderResponseDTO?.orderDetailResponseDTOS && Array.isArray(orderResponseDTO?.orderDetailResponseDTOS) &&
                                    orderResponseDTO?.orderDetailResponseDTOS.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center shadow p-2">
                                            <div className="product-image">
                                                {
                                                    item.productDetailResponseDTO.images.length > 0 ? (
                                                        <Avatar size={120}
                                                                src={item.productDetailResponseDTO.images[0].url}/>
                                                    ) : (
                                                        <Avatar size={120} icon={<FiPackage/>}/>
                                                    )
                                                }
                                            </div>
                                            <div className="ltr:ml-2 rtl:mr-2">
                                                <h6 className="mb-2">{item.productDetailResponseDTO?.name}</h6>
                                                <div className="mb-1">
                                                    <span className="capitalize">Cỡ: </span>
                                                    <span
                                                        className="font-semibold">{item.productDetailResponseDTO?.size.name}</span>
                                                </div>
                                                <div className="mb-1">
                                                    <span className="capitalize">Màu: </span>
                                                    <span
                                                        className="font-semibold">{item.productDetailResponseDTO?.color.name}</span>
                                                </div>
                                                <div className="mb-1">
                                                    <span className="capitalize">Đơn giá: </span>
                                                    <span
                                                        className="font-semibold text-red-500">{Math.round(item.productDetailResponseDTO?.price).toLocaleString('vi') + "đ"}</span>
                                                </div>
                                                <div className="mb-1">
                                                    <span className="capitalize">Số lượng: </span>
                                                    <span
                                                        className="font-semibold">{item.quantity}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="mb-1">
                                                    <span className="capitalize">Thành tiền: </span>
                                                    <span
                                                        className="font-semibold text-red-500">{Math.round(item.productDetailResponseDTO?.price * item.quantity).toLocaleString("vi") + "đ"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }


                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </Fragment>
    );
};

export default InvoiceSearchResult;
