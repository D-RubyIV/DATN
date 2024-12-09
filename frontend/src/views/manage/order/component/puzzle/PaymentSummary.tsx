import Card from '@/components/ui/Card'
import { NumericFormat } from 'react-number-format'
import { PaymentInfoProps, PaymentSummaryProps } from '@/@types/payment'
import { HiExternalLink } from 'react-icons/hi'
import { OrderResponseDTO } from '@/@types/order'
import SuggestVoucher from '@/views/manage/util/SuggestVoucher'
import UseVoucherBox from '@/views/manage/util/UseVoucherBox'

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

const PaymentSummary = ({ selectObject, fetchData, data, unAllowUseVoucher = false }: {
    selectObject: OrderResponseDTO,
    fetchData: () => Promise<void>,
    data: PaymentSummaryProps,
    unAllowUseVoucher?: boolean
}) => {
    return (
        <Card className="h-auto">
            <h5 className="mb-4">Thông tin thanh toán</h5>
            <PaymentRow label="Tổng tiền các sản phẩm" value={data?.subTotal} />
            <PaymentRow label={
                (
                    <div className={'flex gap-2'}>
                        <p>Phí vận chuyển</p>
                        <img src={'https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-GHN-Blue-Orange-350x88.png'}
                             width={'60px'} />
                    </div>
                )
            } value={data?.deliveryFee} prefix={' + '} />
            <PaymentRow label={`Khuyến mãi phiếu giảm giá (${selectObject.discountVoucherPercent}%)`}
                        value={data?.discount} prefix={' - '} />
            <PaymentRow label="Tổng thanh toán" value={data?.totalAfterDiscountAndFee} />
            <div hidden={unAllowUseVoucher}>
                <UseVoucherBox selectedOrder={selectObject} fetchSelectedOrder={fetchData}></UseVoucherBox>
                <SuggestVoucher fetchSelectedOrder={fetchData} selectedOrder={selectObject}></SuggestVoucher>
            </div>
            <HiExternalLink className="text-xl hidden group-hover:block" />
            <hr className="my-5" />

            <PaymentRow label="Đã thanh toán" value={data?.totalPaid} />
            <PaymentRow label="Cần thanh toán" value={data?.total} />

            <HiExternalLink className="text-xl hidden group-hover:block" />
            <HiExternalLink className="text-xl hidden group-hover:block" />
            <hr className="my-5" />
            <PaymentRow label="(Phụ phí)" value={data?.surcharge} prefix={''} />
            <PaymentRow isLast label="(Hoàn trả)" value={data?.refund} prefix={''} />


        </Card>
    )
}

export default PaymentSummary
