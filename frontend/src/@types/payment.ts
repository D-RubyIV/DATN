export type PaymentInfoProps = {
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