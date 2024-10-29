import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Option = {
    id: number;
    code: string;
    name: string;
    deleted: boolean;
    createdDate: string;
    modifiedDate: string;
};

export interface DetailedProduct {
    id: number;
    name?: string;
    code: string;
    product?: Option | null;
    size: Option;
    color: Option;
    brand?: Option | null;
    collar?: Option | null;
    elasticity?: Option | null;
    material?: Option | null;
    origin?: Option | null;
    sleeve?: Option | null; 
    style?: Option | null;
    texture?: Option | null;
    thickness?: Option | null;
    price: number;
    mass:number;
    quantity: number;
    deleted?: boolean;
    createdDate: string;
    modifiedDate: string;
    [key: string]: any;
}

export type AddDetailedProductState = {
    data: DetailedProduct[];
};

export const SLICE_NAME_DETAILED_PRODUCT = 'dataDetailedProduct';

const initialStateDetailedProduct: AddDetailedProductState = {
    data: [],
};

const detailedProductData = createSlice({
    name: SLICE_NAME_DETAILED_PRODUCT,
    initialState: initialStateDetailedProduct,
    reducers: {
        setCombinations: (state, action: PayloadAction<DetailedProduct[]>) => {
            state.data = action.payload;
        },
        removeCombination: (state, action: PayloadAction<string>) => {
            // Xóa sản phẩm theo mã code
            state.data = state.data.filter(product => product.code !== action.payload);
        },
        updateCombination: (state, action: PayloadAction<DetailedProduct>) => {
            const index = state.data.findIndex(product => product.code === action.payload.code);
            // Nếu tìm thấy sản phẩm
            if (index !== -1) {
                const updatedProduct = { ...state.data[index], ...action.payload };

                // Kiểm tra các thuộc tính cần thiết trước khi cập nhật
                if (typeof updatedProduct.price === 'number' && updatedProduct.price >= 0 &&
                    typeof updatedProduct.quantity === 'number' && updatedProduct.quantity >= 0) {
                    state.data[index] = updatedProduct; // Cập nhật sản phẩm
                } else {
                    console.error('Invalid update: Price or Quantity is invalid:', updatedProduct);
                }
            }
        },
    },
});

export const { setCombinations, removeCombination, updateCombination } = detailedProductData.actions;
export default detailedProductData.reducer;
