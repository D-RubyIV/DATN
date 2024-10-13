import { PaymentInfoProps, PaymentSummaryProps } from "@/@types/payment";
import { Card, Switcher } from "@/components/ui";
import { NumericFormat } from "react-number-format";
import { Fragment } from "react/jsx-runtime";

const PaymentInfo = ({ data }: PaymentSummaryProps) => {
    return (
        <Fragment>
            <PaymentSummary data={data}></PaymentSummary>
        </Fragment>
    );
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
    return (
        <Card className="mb-4 h-[205px]">
            <h5 className="mb-4">Thông tin thanh toán</h5>
            <ul>
                <PaymentRow label="Tổng tiền" value={data?.subTotal} />
                <PaymentRow label="Phí vận chuyển" value={data?.deliveryFees} />
                <hr className="mb-3" />
                <PaymentRow isLast label="Tổng thanh toán" value={data?.total} />
            </ul>
        </Card>
    )
}

export default PaymentInfo;