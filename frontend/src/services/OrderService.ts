import instance from '@/axios/CustomAxios'
import { OrderHistoryResponseDTO } from '@/@types/order'


const updateOrder = async (idOrder: number, data: any) => {
    return instance.put(`/orders/${idOrder}`, data)
}
const changeOrderStatus = async (idOrder: number, data: OrderHistoryResponseDTO) => {
    return instance.put(`/orders/status/change/${idOrder}`, data)
}
export { updateOrder, changeOrderStatus }