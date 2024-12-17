import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    apiGetDataProductDetailQuery
} from '@/services/ProductSalesService';

export type FormAttribute = {
    id: number;
    code: string;
    name: string;
    deleted: boolean;
};

type ProductDetail = {
    id: number;
    code: string;
    name: string;
    createdDate: string;
    size: FormAttribute;
    color: FormAttribute;
    brand?: FormAttribute;
    collar?: FormAttribute;
    elasticity?: FormAttribute;
    material?: FormAttribute;
    origin?: FormAttribute;
    sleeve?: FormAttribute;
    style?: FormAttribute;
    texture?: FormAttribute;
    thickness?: FormAttribute;
}

export type AttributeState = {
    loading: boolean;
    attributeFormData: ProductDetail[];
    error: string | null; 
};

type DataProductDetailQuery = ProductDetail[];

export const DATA_NAME = 'datas';

// Thunk action to fetch product details
export const getDataProductDetailQuery = createAsyncThunk(
    DATA_NAME + '/getDataProductDetailQuery',
    async (data: { productId: string }) => {
        const response = await apiGetDataProductDetailQuery<DataProductDetailQuery, { productId: string }>(data);
        return response.data;
    }
);

const initialState: AttributeState = {
    loading: false, // initially set to false (not loading)
    attributeFormData: [],
    error: null, // error initially null
};

// Create the slice
const attributeSlice = createSlice({
    name: DATA_NAME,
    initialState,
    reducers: {
        // You can add other reducers here if needed
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDataProductDetailQuery.pending, (state) => {
                state.loading = true;
                state.error = null; // Reset error when request starts
            })
            .addCase(getDataProductDetailQuery.fulfilled, (state, action) => {
                state.loading = false;
                state.attributeFormData = action.payload; // Set the fetched data to the state
            })
            .addCase(getDataProductDetailQuery.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Something went wrong'; // Capture error message if rejected
            });
    },
});

export default attributeSlice.reducer;
