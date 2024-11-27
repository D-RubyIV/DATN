import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiDeleteSalesProductDetail,
    apiGetSalesProductDetails,
} from '@/services/ProductSalesService'
import type { TableQueries } from '@/@types/common'
type ChildObject = {
    code: string;
    createdDate: string;
    deleted: boolean;
    id: number;
    name: string; 
};
type Image = {
    id: number;
    code: string;
    url: string;
    deleted: boolean;
    createdDate: string;
    modifiedDate: string;
};


type ProductDetail = {
    id: number;
    code: string;
    name: string;
    createdDate: string;
    size: ChildObject;
    color: ChildObject;
    brand?: ChildObject;
    collar?: ChildObject;
    elasticity?: ChildObject;
    material?: ChildObject;
    origin?: ChildObject;
    sleeve?: ChildObject;
    style?: ChildObject;
    texture?: ChildObject;
    thickness?: ChildObject;
    price?: number;
    quantity?: number;
    mass?:number
    images?: Image[]
    deleted: boolean;
}

type ProductDetails = ProductDetail[]

type GetSalesProductDetailsResponse = {
    content: ProductDetails
    totalElements: number
}


export type SalesProductDetailListState = {
    loading: boolean
    deleteConfirmation: boolean
    selectedProductDetail: string
    tableData: TableQueries
    productDetailList: ProductDetail[]
     productId: number,
}

type GetSalesProductDetailsRequest = TableQueries 
type QueryParam  = {
    createdFrom: string,
    createdTo: string,
    productId: number, 
}
export const SLICE_NAME = 'salesProductDetailList'
export const getProductDetails = createAsyncThunk(
    SLICE_NAME + '/getProductDetails',
    async (data: GetSalesProductDetailsRequest, { getState }) => {
        const state = getState() as { salesProductDetailList: SalesProductDetailListState };
        const params: QueryParam = {
            createdFrom: '',
            createdTo: '',
            productId: state.salesProductDetailList.data.productId, // Sử dụng productId đã lấy từ state
        };
        const response = await apiGetSalesProductDetails<
            GetSalesProductDetailsResponse,
            GetSalesProductDetailsRequest
        >(data, params);

        return response.data;
    } 
);


export const deleteProductDetail = async (param: { id: string }) => {
    const response = await apiDeleteSalesProductDetail<
        boolean,
        { id: string  }
        >(param)
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

const initialState: SalesProductDetailListState = {
    loading: false,
    deleteConfirmation: false,
    selectedProductDetail: '',
    productDetailList: [],
    tableData: initialTableData,
    productId:0
}

const productDetailListSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        updateProductDetailList: (state, action) => {
            state.productDetailList = action.payload
        },
        setTableData: (state, action) => {
            state.tableData = action.payload
           
        },
        setProductId: (state, action) => {
            state.productId = action.payload
        },
        toggleDeleteConfirmation: (state, action) => {
            state.deleteConfirmation = action.payload
        },
        setSelectedProductDetail: (state, action) => {
            state.selectedProductDetail = action.payload
        },
    },
    extraReducers: (builder) => { 
        builder
            .addCase(getProductDetails.fulfilled, (state, action) => {
                state.productDetailList = action.payload.content
                state.tableData.total = action.payload.totalElements
                state.loading = false
            })
            .addCase(getProductDetails.pending, (state) => {
                state.loading = true
            })
    },
})

export const {
    updateProductDetailList,
    setTableData,
    setProductId,
    toggleDeleteConfirmation,
    setSelectedProductDetail,
} = productDetailListSlice.actions

export default productDetailListSlice.reducer

