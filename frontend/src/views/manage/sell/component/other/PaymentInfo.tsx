import { PaymentInfoProps, PaymentSummaryProps } from '@/@types/payment'
import { Card, Radio } from '@/components/ui'
import { NumericFormat } from 'react-number-format'
import { Fragment } from 'react/jsx-runtime'
import { EPaymentMethod } from '@/views/manage/sell'
import { SetStateAction, useEffect, useState } from 'react'
import { updateOrder } from '@/services/OrderService'
import { OrderResponseDTO } from '@/@types/order'
import SuggestVoucher from '@/views/manage/util/SuggestVoucher'
import UseVoucherBox from '@/views/manage/util/UseVoucherBox'


const PaymentInfo = ({ setIsOpenVoucherModal, selectedOrder, data, fetchSelectedOrder }: {
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

const PaymentRow = ({ label, value, isLast, prefix }: PaymentInfoProps) => {
    return (
        <li
            className={`flex items-center justify-between${!isLast ? ' mb-3' : ''
            }`}
        >
            <span>{label}</span>
            <span className="font-semibold text-red-600">
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

const PaymentSummary = ({ selectedOrder, data, fetchSelectedOrder, setIsOpenVoucherModal }: {
    selectedOrder: OrderResponseDTO,
    data: PaymentSummaryProps,
    fetchSelectedOrder: () => Promise<void>,
    setIsOpenVoucherModal: React.Dispatch<SetStateAction<boolean>>,
}) => {
    const [paymentMethod, setPaymentMethod] = useState<EPaymentMethod>(EPaymentMethod.CASH)

    useEffect(() => {
        setPaymentMethod(selectedOrder.payment as EPaymentMethod)
    }, [data])

    const onChangeMethod = async (val: EPaymentMethod) => {
        setPaymentMethod(val)
        const response = await updateOrder(selectedOrder.id, { payment: val })
        console.log(response)
        await fetchSelectedOrder()
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
                <PaymentRow label="Tổng tiền" value={data?.subTotal} />
                <PaymentRow label="Phí vận chuyển" value={data?.deliveryFee} prefix={' + '} />
                <PaymentRow label="Giảm giá" value={data?.discount} prefix={' - '} />
                <div className={'pb-4'}>
                    <UseVoucherBox fetchSelectedOrder={fetchSelectedOrder} selectedOrder={selectedOrder} />
                    <SuggestVoucher selectedOrder={selectedOrder}
                                    fetchSelectedOrder={fetchSelectedOrder}></SuggestVoucher>

                </div>
                <PaymentRow isLast label="Tổng thanh toán" value={data?.total} />
            </ul>
        </Card>
    )
}

export default PaymentInfo