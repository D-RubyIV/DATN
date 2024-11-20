import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { changeOrderStatus } from '@/services/OrderService'
import { EOrderStatusEnums, OrderHistoryResponseDTO } from '@/@types/order'
import { useLoadingContext } from '@/context/LoadingContext'
import { Loading } from '@/components/shared'
import { Button } from '@/components/ui'
import instance from "@/axios/CustomAxios";

type OrderResponseDTO = {
    id: number;
    code: string;
    address: string;
    phone: string;
    recipientName: string | null;
    provinceId: string;
    provinceName: string;
    districtId: string;
    districtName: string;
    wardId: string;
    wardName: string;
    deleted: boolean;
    status: 'TOSHIP' | string; // Assuming the status can be a string, but with "TOSHIP" being a common value.
    type: 'ONLINE' | string; // Assuming the type can be "ONLINE" or any other string value.
    payment: 'TRANSFER' | string; // Assuming the payment method can be "TRANSFER" or other strings.
    total: number;
    deliveryFee: number;
    discount: number;
    subTotal: number;
};


const PaymentCallback = () => {
    const location = useLocation()
    const { sleep } = useLoadingContext()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [selectedOrderId, setSelectedOrderId] = useState<number>()
    const [selectedOrder, setSelectedOrder] = useState<OrderResponseDTO>()
    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const transactionId = params.get('vnp_TxnRef') // Mã giao dịch từ VNPay
        const responseCode = params.get('vnp_ResponseCode') // Mã phản hồi từ VNPay
        const idOrder = params.get('orderId') // Mã phản hồi từ VNPay
        console.log("transactionId: ", transactionId)
        console.log("responseCode: ", responseCode)
        console.log("idOrder: ", idOrder)
        setSelectedOrderId(Number(idOrder));

        // Xử lý phản hồi từ VNPay
        if (responseCode === '00') {
            console.log(`Giao dịch thành công với mã giao dịch: ${transactionId} Id Order: ${idOrder}`)
            // Thực hiện logic cho giao dịch thành công
        } else {
            console.log('Giao dịch thất bại.')
            // Thực hiện logic cho giao dịch thất bại
        }

        setIsLoading(true)
        handleChangePaidOrder(Number(idOrder)).then(() => {
            sleep(500).then(() => {
                setIsLoading(false)
            })
            instance.get(`orders/${idOrder}`).then(function (response){
                if(response.status === 200){
                    setSelectedOrder(response.data)
                }
            })
        })
    }, [location])



    const handleChangePaidOrder = async (idOrder: number) => {
        const data: OrderHistoryResponseDTO = {
            status: EOrderStatusEnums.TOSHIP,
            note: 'Chờ vận chuyển'
        }
        const response = await changeOrderStatus(idOrder, data)
        console.log('=> response: ')
        console.log(response)
        setSelectedOrder(response.data)
    }

    return (
        <Loading loading={isLoading} type={'cover'}>
            <div className="flex justify-center h-full items-center">
                <div className="p-8 w-full text-center">
                    <h1 className="text-2xl font-bold text-indigo-600 mb-4">Thanh Toán Thành Công!</h1>
                    <p className="text-gray-700 mb-4">Cảm ơn bạn đã thanh toán. Đơn hàng của bạn đã được xử lý.</p>
                    <div className="border-t border-gray-200 mt-4 pt-4">
                        <h2 className="text-lg font-semibold text-indigo-400">Thông tin đơn hàng:</h2>
                        <p className="text-gray-600">Mã đơn hàng: <span className="font-bold">#{(selectedOrder as OrderResponseDTO)?.code ?? ""}</span></p>
                        <p className="text-gray-600">Tổng tiền: <span className="font-bold">#{(selectedOrder as OrderResponseDTO)?.total.toLocaleString('vi')  ?? ""} VND</span></p>
                        <p className="text-gray-600">Trạng thái đơn hàng: <span className="font-bold">#{(selectedOrder as OrderResponseDTO)?.status  ?? ""}</span></p>
                    </div>
                    <div className={'py-6'}>
                     <Link to={`/user/purchase/${(selectedOrder as OrderResponseDTO)?.code}`}>
                         <Button className={''} variant="default">
                             Xem chi tiết đơn hàng
                         </Button>
                     </Link>
                    </div>
                </div>
            </div>
        </Loading>

    )
}
export default PaymentCallback