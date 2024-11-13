type BaseEntity = {
    id: number;
    createdDate: string;
    updatedDate: string;
    code: string;
    name: string;
    deleted: boolean;
};

export type Image = BaseEntity & {
    url: string;
};

export type Size = BaseEntity;
export type Color = BaseEntity;
export type Product = BaseEntity & {
    events: any[];
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
    material: BaseEntity;
    images: Image[];
};

export type CartDetailResponseDTO = {
    id: number;
    quantity: number;
    productDetailResponseDTO: ProductDetailResponseDTO
}