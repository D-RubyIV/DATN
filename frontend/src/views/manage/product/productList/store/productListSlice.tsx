import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetSalesProducts,
    apiDeleteSalesProducts,
} from '@/services/ProductSalesService'
import type { TableQueries } from '@/@types/common'
import { get } from 'lodash'

type Product = {
    id: string
    name: string
    code: string
    // price: number
    deleted: boolean
    // createdDate: string;
    quantity: number;
}

type Products = Product[]

type GetSalesProductsResponse = {
    content: Products
    totalElements: number
}

type FilterQueries = {
    name: string
    category: string[]
    status: number[]
    productStatus: number
}

export type SalesProductListState = {
    loading: boolean
    deleteConfirmation: boolean
    selectedProduct: string
    tableData: TableQueries
    filterData: FilterQueries
    productList: Product[]
}

type GetSalesProductsRequest = TableQueries & { filterData?: FilterQueries }

export const SLICE_NAME = 'salesProductList'

export const getProducts = createAsyncThunk(
    SLICE_NAME + '/getProducts',
    async (data: GetSalesProductsRequest) => {
        const response = await apiGetSalesProducts<
            GetSalesProductsResponse,
            GetSalesProductsRequest
        >(data)
        return response.data
    }
)

export const deleteProduct = async (params: { id: string | string[] }) => {
    try {
        const response = await apiDeleteSalesProducts<boolean>(params.id);
        console.log(response); // Kiểm tra phản hồi từ API

        // Kiểm tra trạng thái HTTP
        if (response.status === 204) {
            console.log('Product deleted successfully'); // Xóa thành công
            return true; // Hoặc bất kỳ giá trị nào để chỉ ra rằng xóa thành công
        } else {
            console.error('Unexpected response status:', response.status);
            return false; // Xử lý trường hợp không thành công
        }
    } catch (error) {
        console.error('Error deleting product:', error); // In lỗi ra console
        throw error; // Ném lại lỗi nếu cần xử lý tiếp
    }
};



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

const initialState: SalesProductListState = {
    loading: false,
    deleteConfirmation: false,
    selectedProduct: '',
    productList: [],
    tableData: initialTableData,
    filterData: {
        name: '',
        category: ['bags', 'cloths', 'devices', 'shoes', 'watches'],
        status: [0, 1, 2],
        productStatus: 0,
    },
}

const productListSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        updateProductList: (state, action) => {
            state.productList = action.payload
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
            state.selectedProduct = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.fulfilled, (state, action) => {
                state.productList = action.payload.content
                state.tableData.total = action.payload.totalElements
                state.loading = false
            })
            .addCase(getProducts.pending, (state) => {
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
} = productListSlice.actions

export default productListSlice.reducer
