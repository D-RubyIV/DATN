import ApiService from './ApiService'

// export async function apiGetSalesDashboardData<
//     T extends Record<string, unknown>
// >() {
//     return ApiService.fetchData<T>({
//         url: '/sales/dashboard',
//         method: 'post',
//     })
// }

export async function apiGetSalesProducts<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/product/overview',
        method: 'post',
        data,
    })
}
export async function apiGetSalesProductDetails<T, U extends Record<string, unknown>>(
    data: U,
    params: U

) {
    return ApiService.fetchData<T>({
        url: 'http://localhost:8080/api/v1/productDetails/details',
        method: 'post',
        data,
        params
    });
}

export async function apiDeleteSalesProducts<T>(id: string | string[]) {
    // Đảm bảo id là kiểu string trước khi đưa vào URL
    const productId = Array.isArray(id) ? id[0] : id; // Lấy ID đầu tiên nếu là mảng
    return ApiService.fetchData<T>({
        url: `http://localhost:8080/api/v1/product/delete/${productId}`, // Sử dụng path parameters
        method: 'delete',
    });
}


// export async function apiGetSalesProduct<T, U extends Record<string, unknown>>(
//     params: U
// ) {
//     return ApiService.fetchData<T>({
//         url: '/sales/product',
//         method: 'get',
//         params,
//     })
// }

// export async function apiPutSalesProduct<T, U extends Record<string, unknown>>(
//     data: U
// ) {
//     return ApiService.fetchData<T>({
//         url: '/sales/products/update',
//         method: 'put',
//         data,
//     })
// }

// export async function apiCreateSalesProduct<
//     T,
//     U extends Record<string, unknown>
// >(data: U) {
//     return ApiService.fetchData<T>({
//         url: '/sales/products/create',
//         method: 'post',
//         data,
//     })
// }

// export async function apiGetSalesOrders<T, U extends Record<string, unknown>>(
//     params: U
// ) {
//     return ApiService.fetchData<T>({
//         url: '/sales/orders',
//         method: 'get',
//         params,
//     })
// }

// export async function apiDeleteSalesOrders<
//     T,
//     U extends Record<string, unknown>
// >(data: U) {
//     return ApiService.fetchData<T>({
//         url: '/sales/orders/delete',
//         method: 'delete',
//         data,
//     })
// }

// export async function apiGetSalesOrderDetails<
//     T,
//     U extends Record<string, unknown>
// >(params: U) {
//     return ApiService.fetchData<T>({
//         url: '/sales/orders-details',
//         method: 'get',
//         params,
//     })
// }
