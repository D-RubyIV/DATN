type BaseEntity = {
    id: number;
    createdDate: string;
    updatedDate: string;
    code: string;
    name: string;
    deleted: boolean;
};

type Event = {
    id: number;
    discountCode: string;
    name: string;
    discountPercent: number;
    startDate: string; // Có thể đổi thành Date nếu cần parse và xử lý ngày
    endDate: string;   // Tương tự, đổi thành Date nếu cần
    quantityDiscount: number;
    status: string;
};

export type Image = BaseEntity & {
    url: string;
};

export type Size = BaseEntity;
export type Color = BaseEntity;
export type Product = BaseEntity & {
    eventDTOList: Event[];
};
export type ProductDetailResponseDTO = {
    id: number;
    name: string;
    code: string;
    price: number;
    quantity: number;
    size: Size;
    color: Color;
    brand: BaseEntity;
    product: Product;
    material: BaseEntity;
    images: Image[];
};

export type CartDetailResponseDTO = {
    id: number;
    quantity: number;
    productDetailResponseDTO: ProductDetailResponseDTO
}