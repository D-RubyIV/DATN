import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { TableQueries } from '@/@types/common'

export type Attribute = {
    id: number;
    code: string;
    name: string;
    deleted: boolean;
    createdDate: string;
    modifiedDate: string;
};

type Attributes = Attribute[]

type GetSalesAttributesResponse = {
    content: Attributes
    totalElements: number
}


export type SalesAttributeListState = {
    loading: boolean
    deleteConfirmation: boolean
    selectedAttribute: string
    tableData: TableQueries
    AttributeList: Attribute[]
}


export const SLICE_NAME = 'salesAttributeList'


type GetAttributesRequest = {
    apiFunc: (requestData: TableQueries) => Promise<{ data: GetSalesAttributesResponse }>;
    requestData: TableQueries;
};


export const getAttributes = createAsyncThunk<GetSalesAttributesResponse, GetAttributesRequest>(
    `${SLICE_NAME}/getAttributes`,
    async ({ apiFunc, requestData }) => {
        const response = await apiFunc(requestData);
        if (!response || !response.data) {
            throw new Error("Invalid response from API");
        }
        return response.data;
    }
);

export const deleteProduct = async (
    params: { id: string | string[] },
    apiCall: (id: string | string[]) => Promise<{ status: number }>
) => {
    try {
        const response = await apiCall(params.id);
        return response.status === 204;
    } catch (error) {
        throw error;
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

const initialState: SalesAttributeListState = {
    loading: false,
    deleteConfirmation: false,
    selectedAttribute: '',
    AttributeList: [],
    tableData: initialTableData,
 
}

const attributeListSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        updateAttributeList: (state, action) => {
            state.AttributeList = action.payload
        },
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        toggleDeleteConfirmation: (state, action) => {
            state.deleteConfirmation = action.payload
        },
        setSelectedAttribute: (state, action) => {
            state.selectedAttribute = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAttributes.fulfilled, (state, action) => {
                state.AttributeList = action.payload.content
                state.tableData.total = action.payload.totalElements
                state.loading = false
            })
            .addCase(getAttributes.pending, (state) => {
                state.loading = true
            })
    },
})

export const {
    updateAttributeList,
    setTableData,
    toggleDeleteConfirmation,
    setSelectedAttribute,
} = attributeListSlice.actions

export default attributeListSlice.reducer
