

// private
type OrderAddressResponseDTOS = {
    id: number,
    phone: string,
    detail: string
}
// public
export type EOrderTypeEnums = "" | "ONLINE" | "INSTORE"

export enum EOrderStatusEnums {
    EMPTY = "",
    PENDING = "PENDING",
    TOSHIP = "TOSHIP",
    TORECEIVE = "TORECEIVE",
    DELIVERED = "DELIVERED",
    CANCELED = "CANCELED",
    RETURNED = "RETURNED",
    PAID = "PAID",
    UNPAID = "UNPAID",
}


export type OrderTypeBill = {
    label: string,
    value: EOrderTypeEnums
}

export type StatusBill = {
    label: string,
    value: EOrderStatusEnums,
    badge: string
}

export type EOrderStatus = "PENDING" | "TOSHIP" | "TORECEIVE" | "DELIVERED" | "CANCELED" | "RETURNED" | "PAID" | "UNPAID"

export type EOrderType = 'INSTORE' | 'ONLINE'; // Add more types if needed

export type EOrderPayment = 'CASH' | 'TRANSFER'; // Add more types if needed

export type OrderCustomerResponseDTO = {
    code: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    deleted: boolean;
    birthDay: string; // Consider using Date type if applicable
    addressResponseDTOS: OrderAddressResponseDTOS[]; // Define this type if applicable
}

export type OrderStaffResponseDTO = {
    code: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    citizenId: string;
    address: string;
    province: string;
    district: string;
    ward: string;
    status: string; // Consider defining a more specific type if needed
    note: string;
    birthDay: string; // Consider using Date type if applicable
    deleted: boolean;
}

export type OrderVoucherResponseDTO = {
    code: string;
    name: string;
    quantity: number;
    minAmount: number;
    maxPercent: number;
    typeTicket: string; // Consider defining specific types if needed
    startDate: string; // Consider using Date type if applicable
    endDate: string; // Consider using Date type if applicable
    deleted: boolean;
}

export type OrderHistoryResponseDTO = {
    id?: number;
    status: EOrderStatus;
    note: string;
    createdBy?: string
}

export type OrderResponseDTO = {
    id: number;
    code: string;
    address: string;
    phone: string;
    deleted: boolean;
    status: EOrderStatus;
    type: EOrderType;
    payment: EOrderPayment;
    total: number;
    subTotal: number;
    provinceId: string;    // ID của tỉnh
    provinceName: string;  // Tên của tỉnh
    districtId: string;    // ID của quận/huyện
    districtName: string;  // Tên của quận/huyện
    wardId: string;        // ID của phường/xã
    wardName: string;      // Tên của phường/xã
    customerResponseDTO: OrderCustomerResponseDTO;
    staffResponseDTO: OrderStaffResponseDTO;
    voucherResponseDTO: OrderVoucherResponseDTO;
    orderDetailResponseDTOS: OrderDetailResponseDTO[];
    historyResponseDTOS: OrderHistoryResponseDTO[];
}

export type Entity = {
    id: number;
    createdDate: string;
    updatedDate: string;
    code: string;
    name: string;
    deleted: boolean;
};

export type OrderProductDetail = Entity & {
    price: number;
    quantity: number;
    size: Entity;
    color: Entity;
    product: Entity;
    texture: Entity;
    origin: Entity;
    brand: Entity;
    collar: Entity;
    sleeve: Entity;
    style: Entity;
    material: Entity;
    thickness: Entity;
    elasticity: Entity;
    image: Entity;
};

export type OrderDetailResponseDTO = {
    id: number;
    quantity: number;
    productDetail: OrderProductDetail;
};

export type ProductOrderDetail = {
    id: string
    name: string
    productCode: string
    img: string
    price: number
    quantity: number
    total: number
    details: Record<string, string[]>
}

export type OrderProductsProps = {
    data?: ProductOrderDetail[]
}

export type OrderDetailRequestForCreate = {
    quantity: number;
    orderId: number;
    productDetailId: number;
};

export type ProductDetailOverviewPhah04 = {
    id: number;
    code: string;
    name: string;
    deleted: boolean;
    quantity: number;
    price: number;
    sizeName: string;
    colorName: string;
    productName: string;
    textureName: string;
    originName: string;
    brandName: string;
    collarName: string;
    sleeveName: string;
    materialName: string;
    thicknessName: string;
    elasticityName: string;
};