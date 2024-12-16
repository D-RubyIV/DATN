import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    apiGetSalesBrands,
    apiGetSalesOrigins,
    apiGetSalesStyles,
    apiGetSalesCollars,
    apiGetSalesSleeves,
    apiGetSalesThickness,
    apiGetSalesTextures,
    apiGetSalesElasticitys,
    apiGetSalesColors,
    apiGetSalesSizes,
    apiGetSalesMaterials,
} from '@/services/ProductSalesService';

export type FormAttribute = {
    id: number;
    code: string;
    name: string;
    deleted: boolean;
};



export type AttributeFormData = {
    data: FormAttribute[];
};





type AttributeDataResponse = AttributeFormData;

export type AttributeState = {
    loading: boolean;
    brandData: FormAttribute[];
    originData: FormAttribute[];
    styleData: FormAttribute[];
    collarData: FormAttribute[];
    sleeveData: FormAttribute[];
    thicknessData: FormAttribute[];
    textureData: FormAttribute[];
    elasticityData: FormAttribute[];
    colorData: FormAttribute[];
    sizeData: FormAttribute[];
    materialData: FormAttribute[];
  
};



export const ATTRIBUTE_NAME = 'atrributeList';

export const getBrandData = createAsyncThunk(
    ATTRIBUTE_NAME + '/getBrandData',
    async () => {
        const response = await apiGetSalesBrands<AttributeDataResponse>();
        return response.data;
    }
);

export const getOriginData = createAsyncThunk(
    ATTRIBUTE_NAME + '/getOriginData',
    async () => {
        const response = await apiGetSalesOrigins<AttributeDataResponse>();
        return response.data;
    }
);

export const getStyleData = createAsyncThunk(
    ATTRIBUTE_NAME + '/getStyleData',
    async () => {
        const response = await apiGetSalesStyles<AttributeDataResponse>();
        return response.data;
    }
);

export const getCollarData = createAsyncThunk(
    ATTRIBUTE_NAME + '/getCollarData',
    async () => {
        const response = await apiGetSalesCollars<AttributeDataResponse>();
        return response.data;
    }
);

export const getSleeveData = createAsyncThunk(
    ATTRIBUTE_NAME + '/getSleeveData',
    async () => {
        const response = await apiGetSalesSleeves<AttributeDataResponse>();
        return response.data;
    }
);

export const getThicknessData = createAsyncThunk(
    ATTRIBUTE_NAME + '/getThicknessData',
    async () => {
        const response = await apiGetSalesThickness<AttributeDataResponse>();
        return response.data;
    }
);

export const getTextureData = createAsyncThunk(
    ATTRIBUTE_NAME + '/getTextureData',
    async () => {
        const response = await apiGetSalesTextures<AttributeDataResponse>();
        return response.data;
    }
);

export const getElasticityData = createAsyncThunk(
    ATTRIBUTE_NAME + '/getElasticityData',
    async () => {
        const response = await apiGetSalesElasticitys<AttributeDataResponse>();
        return response.data;
    }
);

export const getColorData = createAsyncThunk(
    ATTRIBUTE_NAME + '/getColorData',
    async () => {
        const response = await apiGetSalesColors<AttributeDataResponse>();
        return response.data;
    }
);

export const getSizeData = createAsyncThunk(
    ATTRIBUTE_NAME + '/getSizeData',
    async () => {
        const response = await apiGetSalesSizes<AttributeDataResponse>();
        return response.data;
    }
);

export const getMaterialData = createAsyncThunk(
    ATTRIBUTE_NAME + '/getMaterialData',
    async () => {
        const response = await apiGetSalesMaterials<AttributeDataResponse>();
        return response.data;
    }
);


const initialState: AttributeState = {
    loading: true,
    brandData: [],
    originData: [],
    styleData: [],
    collarData: [],
    sleeveData: [],
    thicknessData: [],
    textureData: [],
    elasticityData: [],
    colorData: [],
    sizeData: [],
    materialData: [],
};



const AttributeSlice = createSlice({
    name: `${ATTRIBUTE_NAME}/state`,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getBrandData.fulfilled, (state, action) => {
                state.brandData = action.payload.data;
                state.loading = false;
            })
            .addCase(getBrandData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getBrandData.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getOriginData.fulfilled, (state, action) => {
                state.originData = action.payload.data;
                state.loading = false;
            })
            .addCase(getOriginData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getOriginData.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getStyleData.fulfilled, (state, action) => {
                state.styleData = action.payload.data;
                state.loading = false;
            })
            .addCase(getStyleData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getStyleData.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getCollarData.fulfilled, (state, action) => {
                state.collarData = action.payload.data;
                state.loading = false;
            })
            .addCase(getCollarData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCollarData.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getSleeveData.fulfilled, (state, action) => {
                state.sleeveData = action.payload.data;
                state.loading = false;
            })
            .addCase(getSleeveData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSleeveData.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getThicknessData.fulfilled, (state, action) => {
                state.thicknessData = action.payload.data;
                state.loading = false;
            })
            .addCase(getThicknessData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getThicknessData.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getTextureData.fulfilled, (state, action) => {
                state.textureData = action.payload.data;
                state.loading = false;
            })
            .addCase(getTextureData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTextureData.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getElasticityData.fulfilled, (state, action) => {
                state.elasticityData = action.payload.data;
                state.loading = false;
            })
            .addCase(getElasticityData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getElasticityData.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getColorData.fulfilled, (state, action) => {
                state.colorData = action.payload.data;
                state.loading = false;
            })
            .addCase(getColorData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getColorData.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getSizeData.fulfilled, (state, action) => {
                state.sizeData = action.payload.data;
                state.loading = false;
            })
            .addCase(getSizeData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSizeData.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getMaterialData.fulfilled, (state, action) => {
                state.materialData = action.payload.data;
                state.loading = false;
            })
            .addCase(getMaterialData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMaterialData.rejected, (state) => {
                state.loading = false;
            })
    },
});

export default AttributeSlice.reducer;  
