import {
    createSlice,
    createAsyncThunk,
    current,
    PayloadAction,
} from '@reduxjs/toolkit'
import {
    apiGetSalesCustomers,
} from '@/services/CustomerService'
import type { TableQueries } from '@/@types/common'

type Customer = {
    id: number
    name: string
    phone: string
    email: string
}

type Customers = Customer[]

type GetSalesCustomersResponse = {
    data: Customers
    total: number
}

export type SalescustomerListState = {
    loading: boolean
    customerList: Customers
    tableData: TableQueries
    deleteMode: 'single' | 'batch' | ''
    selectedRows: number[] // Kiểu number[] chính xác
    selectedRow: number // Kiểu number chính xác
}

export const SLICE_NAME = 'salesCustomerList'

export const getCustomers = createAsyncThunk(
    SLICE_NAME + '/getCustomers',
    async (data: TableQueries) => {
        const response = await apiGetSalesCustomers<GetSalesCustomersResponse, TableQueries>(data)
        return response.data
    }
)

const initialState: SalescustomerListState = {
    loading: false,
    customerList: [],
    tableData: {
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        query: '',
        sort: {
            order: '',
            key: '',
        },
    },
    selectedRows: [],
    selectedRow: 0,
    deleteMode: '',
}

const customerListSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setcustomerList: (state, action: PayloadAction<Customers>) => {
            state.customerList = action.payload
        },
        setTableData: (state, action: PayloadAction<TableQueries>) => {
            state.tableData = action.payload
        },
        setSelectedRows: (state, action: PayloadAction<number[]>) => {
            state.selectedRows = action.payload
        },
        setSelectedRow: (state, action: PayloadAction<number>) => {
            state.selectedRow = action.payload
        },
        addRowItem: (state, { payload }: PayloadAction<number[]>) => {
            const currentState = current(state)
            if (!currentState.selectedRows.includes(payload)) {
                state.selectedRows = [...currentState.selectedRows, ...payload]
            }
        },
        removeRowItem: (state, { payload }: PayloadAction<number>) => {
            const currentState = current(state)
            if (currentState.selectedRows.includes(payload)) {
                state.selectedRows = currentState.selectedRows.filter(
                    (id) => id !== payload
                )
            }
        },
        setDeleteMode: (state, action: PayloadAction<'single' | 'batch' | ''>) => {
            state.deleteMode = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCustomers.fulfilled, (state, action) => {
                state.customerList = action.payload.data
                state.tableData.total = action.payload.total
                state.loading = false
            })
            .addCase(getCustomers.pending, (state) => {
                state.loading = true
            })
    },
})

export const {
    setcustomerList,
    setTableData,
    setSelectedRows,
    setSelectedRow,
    addRowItem,
    removeRowItem,
    setDeleteMode,
} = customerListSlice.actions

export default customerListSlice.reducer
