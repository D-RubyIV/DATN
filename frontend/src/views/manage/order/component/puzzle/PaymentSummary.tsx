import Card from '@/components/ui/Card'
import { NumericFormat } from 'react-number-format'
import { PaymentInfoProps, PaymentSummaryProps } from '@/@types/payment'
import { HiExternalLink } from 'react-icons/hi'


const PaymentRow = ({ label, value, isLast, prefix }: PaymentInfoProps) => {
    return (
        <li
            className={`flex items-center justify-between${!isLast ? ' mb-3' : ''
            }`}
        >
            <span className={'text-black'}>{label}</span>
            <span className="font-semibold text-red-600">
                <NumericFormat
                    displayType="text"
                    value={(Math.round((value as number) * 100) / 100).toFixed(0)}
                    prefix={prefix}
                    suffix={' ₫'}
                    thousandSeparator={true}
                    allowNegative={false}
                />
            </span>
        </li>
    )
}

const PaymentSummary = ({ data }: { data: PaymentSummaryProps }) => {
    return (
        <Card className="mb-4 h-[330px]">
            <h5 className="mb-4">Thông tin thanh toán</h5>
            <PaymentRow label="Tổng tiền" value={data?.subTotal} />
            <PaymentRow label="Phí vận chuyển" value={data?.deliveryFee} prefix={' + '} />
            <PaymentRow label="Giảm giá" value={data?.discount} prefix={' - '} />
            <PaymentRow label="Đã thanh toán" value={data?.totalPaid} prefix={' - '} />
            <PaymentRow label="Tổng thanh toán" value={data?.total} />
            <HiExternalLink className="text-xl hidden group-hover:block" />
            <HiExternalLink className="text-xl hidden group-hover:block" />
            <hr className="my-5" />
            <PaymentRow label="(Phụ phí)" value={data?.surcharge} prefix={''} />
            <PaymentRow isLast label="(Hoàn trả)" value={data?.refund} prefix={''} />


        </Card>
    )
}

export default PaymentSummary
