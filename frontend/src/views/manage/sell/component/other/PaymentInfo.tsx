import { PaymentInfoProps, PaymentSummaryProps } from '@/@types/payment'
import { Card, Radio } from '@/components/ui'
import { NumericFormat } from 'react-number-format'
import { Fragment } from 'react/jsx-runtime'
import { EPaymentMethod } from '@/views/manage/sell'
import { useEffect, useState } from 'react'
import { updateOrder } from '@/services/OrderService'
import { BillResponseDTO } from '@/views/manage/order/store'

const PaymentInfo = ({ selectedOrder, data }: { selectedOrder: BillResponseDTO, data: PaymentSummaryProps }) => {
    return (
        <Fragment>
            <PaymentSummary data={data} selectedOrder={selectedOrder}></PaymentSummary>
        </Fragment>
    )
}

const PaymentRow = ({ label, value, isLast }: PaymentInfoProps) => {
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
                    suffix={'₫'}
                    thousandSeparator={true}
                />
            </span>
        </li>
    )
}

const PaymentSummary = ({ selectedOrder, data }: { selectedOrder: BillResponseDTO, data: PaymentSummaryProps }) => {
    const [paymentMethod, setPaymentMethod] = useState<EPaymentMethod>(EPaymentMethod.CASH)

    useEffect(() => {
        setPaymentMethod(selectedOrder.payment as EPaymentMethod)
    }, [data])

    const onChangeMethod = (val: EPaymentMethod) => {
        setPaymentMethod(val)
        const response = updateOrder(selectedOrder.id, { payment: val })
        console.log(response)
    }

    return (
        <Card className="mb-4 h-[205px]">
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
                <PaymentRow label="Tổng tiền" value={data?.subTotal} />
                <PaymentRow label="Phí vận chuyển" value={data?.deliveryFees} />
                <hr className="mb-3" />
                <PaymentRow isLast label="Tổng thanh toán" value={data?.total} />
            </ul>
        </Card>
    )
}

export default PaymentInfo