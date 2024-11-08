import Card from '@/components/ui/Card'
import { NumericFormat } from 'react-number-format'
import { PaymentInfoProps, PaymentSummaryProps } from '@/@types/payment'


const PaymentRow = ({ label, value, isLast, prefix }: PaymentInfoProps) => {
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

const PaymentSummary = ({ data }: { data: PaymentSummaryProps }) => {
    return (
        <Card className="mb-4 h-[205px]">
            <h5 className="mb-4">Thông tin thanh toán</h5>
            <PaymentRow label="Tổng tiền" value={data?.subTotal} />
            <PaymentRow label="Phí vận chuyển" value={data?.deliveryFee} prefix={' + '} />
            <PaymentRow label="Giảm giá" value={data?.discount} prefix={' - '} />
            <PaymentRow isLast label="Tổng thanh toán" value={data?.total} />
        </Card>
    )
}

export default PaymentSummary
