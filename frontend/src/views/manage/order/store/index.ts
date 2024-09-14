import { string } from "yup";

export type typeEnums = "" | "ONLINE" | "INSTORE"
export type statusEnums = "" | "PENDING" | "PICKUP" | "DELIVERY" | "DELIVERED" | "CANCELED" | "RETURNED"

export type TypeBill = {
    label: string,
    value: typeEnums
}


export type EBillStatus =
    | 'PENDING'
    | 'PICKUP'
    | 'DELIVERY'
    | 'DELIVERED'
    | 'CANCELLED'
    | 'RETURNED';

export type EBillType = 'INSTORE' | 'ONLINE'; // Add more types if needed

export type CustomerResponseDTO = {
    code: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    deleted: boolean;
    birthDay: string; // Consider using Date type if applicable
    addressResponseDTOS: any[]; // Define this type if applicable
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
    historyResponseDTOS: HistoryResponseDTO[];
}
