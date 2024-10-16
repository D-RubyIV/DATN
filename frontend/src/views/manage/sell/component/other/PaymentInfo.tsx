import { PaymentInfoProps, PaymentSummaryProps } from '@/@types/payment'
import { Card, Radio } from '@/components/ui'
import { NumericFormat } from 'react-number-format'
import { Fragment } from 'react/jsx-runtime'
import { EPaymentMethod } from '@/views/manage/sell'
import { useState } from 'react'

const PaymentInfo = ({ data }: PaymentSummaryProps) => {
    return (
        <Fragment>
            <PaymentSummary data={data}></PaymentSummary>
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

const PaymentSummary = ({ data }: PaymentSummaryProps) => {
    const [paymentMethod, setPaymentMethod] = useState<EPaymentMethod>(EPaymentMethod.CASH)

    const onChangeMethod = (val: EPaymentMethod) => {
        setPaymentMethod(val)
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