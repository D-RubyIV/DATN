import Card from '@/components/ui/Card'
import { NumericFormat } from 'react-number-format'

type PaymentInfoProps = {
    label?: string
    value?: number
    isLast?: boolean
}

export type PaymentSummaryProps = {
    data?: {
        subTotal: number
        tax: number
        deliveryFees: number
        total: number
    }
}

const PaymentInfo = ({ label, value, isLast }: PaymentInfoProps) => {
    return (
        <li
            className={`flex items-center justify-between${
                !isLast ? ' mb-3' : ''
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
    return (
        <Card className="mb-4 h-[205px]">
            <h5 className="mb-4">Thông tin thanh toán</h5>
            <ul>
                <PaymentInfo label="Tổng tiền" value={data?.subTotal} />
                <PaymentInfo label="Phí vận chuyển" value={data?.deliveryFees} />
                <hr className="mb-3" />
                <PaymentInfo isLast label="Tổng thanh toán" value={data?.total} />
            </ul>
        </Card>
    )
}

export default PaymentSummary
