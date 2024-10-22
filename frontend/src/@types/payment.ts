export type PaymentInfoProps = {
    label?: string
    value?: number
    isLast?: boolean
    prefix?: string
}

export type PaymentSummaryProps = {
    total: number | undefined
    deliveryFee: number | undefined
    subTotal: number | undefined
    discount: number | undefined
    tax: number | undefined
}