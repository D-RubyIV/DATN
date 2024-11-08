import { TableQueries } from "@/@types/common";
import { apiGetSalesVoucher, apiDeleteSalesVouchers } from "@/services/VoucherService";
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

type Voucher = {
    id: number;
    code: string;
    name: string;
    typeTicket: string;
    quantity: number;
    maxPercent: number;
    minAmount: number;
    startDate: Date;
    endDate: Date;
    status: string;
}


type Vouchers = Voucher[];

type GetSalesVouchersResponse = {
    data: Vouchers
    total: number
}


type FilterQueries = {
    name: string
    category: string[]
    status: number[]
    voucherStatus: number
}


export type SalesVoucherListState = {
    loading: boolean
    deleteConfirmation: boolean
    selectedVoucher: string
    tableData: TableQueries
    filterData: FilterQueries
    voucherList: Voucher[]
}

type GetSalesVouchersRequest = TableQueries & {filterData?: FilterQueries}

export const SLICE_NAME = 'salesVoucherList'

export const getVouchers = createAsyncThunk(
    SLICE_NAME + '/getVouchers',
    async ( data: GetSalesVouchersRequest) => {
        const response = await apiGetSalesVoucher<GetSalesVouchersResponse, GetSalesVouchersRequest>(data); // sua o service
        return response.data;
    }
)

export const deleteVoucher = async (data: { id: string | string[] }) => {
    const response = await apiDeleteSalesVouchers<
        boolean,
        { id: string | string[] }
    >(data)
    return response.data
}

export const initialTableData: TableQueries = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
        order: '',
        key: '',
    },
}


const initialState: SalesVoucherListState = {
    loading: false,
    deleteConfirmation: false,
    selectedVoucher: '',
    voucherList: [],
    tableData: initialTableData,
    filterData: {
        name: '',
        category: ['bags', 'cloths', 'devices', 'shoes', 'watches'], // suawr sau
        status: [0, 1, 2],
        voucherStatus: 0,
    },
}

const voucherListSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        updateProductList: (state, action) => {
            state.voucherList = action.payload
        },
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        setFilterData: (state, action) => {
            state.filterData = action.payload
        },
        toggleDeleteConfirmation: (state, action) => {
            state.deleteConfirmation = action.payload
        },
        setSelectedProduct: (state, action) => {
            state.selectedVoucher = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getVouchers.fulfilled, (state, action) => {
                state.voucherList = action.payload.data
                state.tableData.total = action.payload.total
                state.loading = false
            })
            .addCase(getVouchers.pending, (state) => {
                state.loading = true
            })
    },
})


export const {
    updateProductList,
    setTableData,
    setFilterData,
    toggleDeleteConfirmation,
    setSelectedProduct,
} = voucherListSlice.actions

export default voucherListSlice.reducer
