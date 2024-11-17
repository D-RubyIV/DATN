import {PaymentInfoProps, PaymentSummaryProps} from '@/@types/payment'
import {Button, Card, Radio} from '@/components/ui'
import {NumericFormat} from 'react-number-format'
import {Fragment} from 'react/jsx-runtime'
import {EPaymentMethod} from '@/views/manage/sell'
import {SetStateAction, useEffect, useState} from 'react'
import {updateOrder} from '@/services/OrderService'
import {OrderResponseDTO} from '@/@types/order'
import {Input} from '@/components/ui/Input'
import {HiTicket} from 'react-icons/hi'
import instance from "@/axios/CustomAxios";

const PaymentInfo = ({setIsOpenVoucherModal, selectedOrder, data, fetchSelectedOrder}: {
    setIsOpenVoucherModal: React.Dispatch<SetStateAction<boolean>>,
    selectedOrder: OrderResponseDTO,
    data: PaymentSummaryProps,
    fetchSelectedOrder: () => Promise<void>
}) => {
    return (
        <Fragment>
            <PaymentSummary
                data={data}
                selectedOrder={selectedOrder}
                fetchSelectedOrder={fetchSelectedOrder}
                setIsOpenVoucherModal={setIsOpenVoucherModal}
            />
        </Fragment>
    )
}

const PaymentRow = ({label, value, isLast, prefix}: PaymentInfoProps) => {
    return (
        <li
            className={`flex items-center justify-between${!isLast ? ' mb-3' : ''
            }`}
        >
            <span>{label}</span>
            <span className="font-semibold">
                <NumericFormat
                    displayType="text"
                    value={(Math.round((value as number) * 100) / 100).toFixed(
                        2
                    )}
                    prefix={prefix}
                    suffix={'₫'}
                    thousandSeparator={true}
                    allowNegative={false}
                />
            </span>
        </li>
    )
}

const PaymentSummary = ({selectedOrder, data, fetchSelectedOrder, setIsOpenVoucherModal}: {
    selectedOrder: OrderResponseDTO,
    data: PaymentSummaryProps,
    fetchSelectedOrder: () => Promise<void>,
    setIsOpenVoucherModal: React.Dispatch<SetStateAction<boolean>>,
}) => {
    const [paymentMethod, setPaymentMethod] = useState<EPaymentMethod>(EPaymentMethod.CASH)
    const [listVoucherSuggest, setListVoucherSuggest] = useState([])


    useEffect(() => {
        setPaymentMethod(selectedOrder.payment as EPaymentMethod)
    }, [data])

    const getBetterVoucher = async () => {
        await instance.get(`voucher/better-voucher?amount=${selectedOrder.subTotal}`).then(
            function (response) {
                console.log(response)
                setListVoucherSuggest(response.data)
            }
        )
    }
    useEffect(() => {
        getBetterVoucher()
    }, [selectedOrder]);

    const onChangeMethod = async (val: EPaymentMethod) => {
        setPaymentMethod(val)
        const response = await updateOrder(selectedOrder.id, {payment: val})
        console.log(response)
        fetchSelectedOrder()
    }

    return (
        <Card className="mb-4 h-auto">
            <div className="flex justify-between">
                <div>
                    <h5 className="mb-4">Thông tin thanh toán</h5>
                </div>
                <div className="flex gap-3 justify-between">
                    <div>
                        <div className="text-black">
                            <div className="font-semibold">
                                <Radio.Group value={paymentMethod} onChange={onChangeMethod}>
                                    <Radio value={EPaymentMethod.TRANSFER}>Chuyển khoản</Radio>
                                    <Radio value={EPaymentMethod.CASH}>Tiền mặt</Radio>
                                </Radio.Group>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ul>
                <PaymentRow label="Tổng tiền" value={data?.subTotal}/>
                <PaymentRow label="Phí vận chuyển" value={data?.deliveryFee} prefix={' + '}/>
                <PaymentRow label="Giảm giá" value={data?.discount} prefix={' - '}/>
                <div className={'pb-4'}>
                    <Input placeholder={'Nhập mã giảm giá nếu có'} suffix={
                        (<Button className={'cursor-pointer'} variant={'plain'} icon={<HiTicket/>}
                                 onClick={() => setIsOpenVoucherModal(true)}>

                        </Button>)
                    }></Input>
                    {
                        (Array.isArray(listVoucherSuggest) && listVoucherSuggest.length > 0) ? (
                                <div>
                                    {
                                        listVoucherSuggest[0]?.minAmount > selectedOrder.subTotal ? (
                                                <div className={'py-2 flex'}>
                                                    <p className={'text-red-500'}>Cần mua thêm tối
                                                        thiểu {Math.round(listVoucherSuggest[0]?.minAmount - selectedOrder.subTotal).toLocaleString('vi') + "đ"} giá
                                                        trị đơn hàng
                                                        để có thể sử dụng khuyễn mãi tốt hơn
                                                        giảm {listVoucherSuggest[0]?.maxPercent} %
                                                    </p>
                                                </div>
                                            ) :
                                            (
                                                <div className={'py-2 flex'}>
                                                    <p className={'text-red-500'}>Khuyễn mãi tốt nhất cho bạn {listVoucherSuggest[0]?.maxPercent} %

                                                    </p>
                                                </div>
                                            )

                                    }
                                </div>
                            )
                            :
                            (
                                <div className={'pt-2 flex'}>
                                    <p>Không có voucher phù hợp hơn</p>
                                </div>
                            )
                    }
                </div>
                <PaymentRow isLast label="Tổng thanh toán" value={data?.total}/>
            </ul>
        </Card>
    )
}

export default PaymentInfo