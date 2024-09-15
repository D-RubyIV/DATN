import { string } from "yup";

export type typeEnums = "" | "ONLINE" | "INSTORE"
export type statusEnums = "" | "PENDING" | "TOSHIP" | "TORECEIVE" | "DELIVERED" | "CANCELED" | "RETURNED"

export type TypeBill = {
    label: string,
    value: typeEnums
}

export type StatusBill = {
    label: string,
    value: statusEnums
}

export type EBillStatus =
    | 'PENDING'
    | 'PICKUP'
    | 'DELIVERY'
    | 'DELIVERED'
    | 'CANCELLED'
    | 'RETURNED';

export type EBillType = 'INSTORE' | 'ONLINE'; // Add more types if needed

type AddressResponseDTOS = {
    id: number,
    phone: string,
    detail: string
}

export type CustomerResponseDTO = {
    code: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    deleted: boolean;
    birthDay: string; // Consider using Date type if applicable
    addressResponseDTOS: AddressResponseDTOS[]; // Define this type if applicable
}

export type StaffResponseDTO = {
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

export type VoucherResponseDTO = {
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

export type HistoryResponseDTO = {
    id: number;
    status: 'DELIVERED'; // Adjust or add other statuses if needed
    note: string;
}

// Combine all types into one main type

export type BillResponseDTO = {
    id: number;
    code: string;
    address: string;
    phone: string;
    deleted: boolean;
    status: EBillStatus;
    type: EBillType;
    total: number;
    subTotal: number;
    customerResponseDTO: CustomerResponseDTO;
    staffResponseDTO: StaffResponseDTO;
    voucherResponseDTO: VoucherResponseDTO;
    orderDetailResponseDTOS: OrderDetailResponseDTO[];
    historyResponseDTOS: HistoryResponseDTO[];
}

export type Entity = {
    id: number;
    createdDate: string;
    updatedDate: string;
    code: string;
    name: string;
    deleted: boolean;
};

export type ProductDetail = Entity & {
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
    quantity: number;
    productDetail: ProductDetail;
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