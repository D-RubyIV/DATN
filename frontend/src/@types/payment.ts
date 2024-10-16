export type PaymentInfoProps = {
    label?: string
    value?: number
    isLast?: boolean
}

export type PaymentSummaryProps = {
    total: number | undefined
    deliveryFees: number | undefined
    subTotal: number | undefined
    tax: number | undefined
}