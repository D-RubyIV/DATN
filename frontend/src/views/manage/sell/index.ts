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
export const fakeOrderDetail: OrderDetailOverview[] = [
    {
        image: "https://product.hstatic.net/200000690725/product/thiet_ke_chua_co_ten__1__9074b85ed0384a0a9360158a2d908bbd_master.png", // URL của hình ảnh
        name: "Product Name",                     // Tên sản phẩm
        quantity: 2,                              // Số lượng
        price: 100                                // Giá (có thể là giá của 1 sản phẩm)
    },
    {
        image: "https://product.hstatic.net/200000690725/product/thiet_ke_chua_co_ten__1__9074b85ed0384a0a9360158a2d908bbd_master.png", // URL của hình ảnh
        name: "Product Name",                     // Tên sản phẩm
        quantity: 2,                              // Số lượng
        price: 100                                // Giá (có thể là giá của 1 sản phẩm)
    },
    {
        image: "https://product.hstatic.net/200000690725/product/thiet_ke_chua_co_ten__1__9074b85ed0384a0a9360158a2d908bbd_master.png", // URL của hình ảnh
        name: "Product Name",                     // Tên sản phẩm
        quantity: 2,                              // Số lượng
        price: 100                                // Giá (có thể là giá của 1 sản phẩm)
    },
    {
        image: "https://product.hstatic.net/200000690725/product/thiet_ke_chua_co_ten__1__9074b85ed0384a0a9360158a2d908bbd_master.png", // URL của hình ảnh
        name: "Product Name",                     // Tên sản phẩm
        quantity: 2,                              // Số lượng
        price: 100                                // Giá (có thể là giá của 1 sản phẩm)
    },
    {
        image: "https://product.hstatic.net/200000690725/product/thiet_ke_chua_co_ten__1__9074b85ed0384a0a9360158a2d908bbd_master.png", // URL của hình ảnh
        name: "Product Name",                     // Tên sản phẩm
        quantity: 2,                              // Số lượng
        price: 100                                // Giá (có thể là giá của 1 sản phẩm)
    },
];
