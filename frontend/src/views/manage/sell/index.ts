export type OrderDetailOverview = {
    image: string,
    name: string,
    quantity: number,
    price: number
}
export type SellCustomerOverview = {
    id: number
    name: string,
    phone: string,
    email: string
}
export enum EPaymentMethod {
    TRANSFER = 'TRANSFER',
    CASH = 'CASH'
}
