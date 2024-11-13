import React, {Fragment, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import instance from "@/axios/CustomAxios";
import {OrderResponseDTO} from "@/@types/order";
import {Avatar} from "@/components/ui";
import {FiPackage} from "react-icons/fi";

const InvoiceSearchResult = () => {
    const {idOrder} = useParams();
    const [orderResponseDTO, setOrderResponseDTO] = useState<OrderResponseDTO>()

    const getDetailOrder = () => {
        instance.get(`orders/${idOrder}`).then(function (response) {
            console.log(response)
            if (response.status === 200 && response.data) {
                setOrderResponseDTO(response.data)
            }
        })
    }

    useEffect(() => {
        console.log("ID ORDER: ", idOrder)
        getDetailOrder()
    }, []);

    return (
        <Fragment>
            <div className={'p-20 grid grid-cols-2'}>
                <div>
                    <div>
                        <div>
                            <p className={'text-xl font-semibold text-black'}>Thông tin đơn hàng</p>
                        </div>
                        <div>
                            <p>Mã đơn hàng: {orderResponseDTO?.code}</p>
                            <p>Mã đơn hàng: {orderResponseDTO?.code}</p>
                        </div>
                    </div>
                    <div>
                        <div>
                            <p className={'text-xl font-semibold text-black'}>Trạng thái đơn hàng</p>
                            <div>
                                <p>Trạng thái: {orderResponseDTO?.status}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                        <div>
                            <p className={'text-xl font-semibold text-black'}>Danh sách sản phẩm</p>
                            <div>
                                {
                                    orderResponseDTO?.images && Array.isArray(orderResponseDTO?.images) && orderResponseDTO?.images.length > 0 ?
                                        (<div>
                                            <Avatar src={orderResponseDTO?.images[0].url}></Avatar>
                                        </div>) :
                                        (<div>
                                            <Avatar icon={<FiPackage/>}></Avatar>
                                        </div>)
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
