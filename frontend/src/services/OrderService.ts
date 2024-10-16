import instance from '@/axios/CustomAxios'


const updateOrder = async (idOrder: number, data: any) => {
    return instance.put(`/orders/${idOrder}`, data)
}

export { updateOrder }