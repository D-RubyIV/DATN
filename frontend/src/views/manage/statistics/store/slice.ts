import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import apiFetchOverviewStatistic from '@/views/manage/statistics/service/StatisticService'


export type OverViewMonth = {
    createDate: Date,
    month: number,
    year: number,
    quantityOrder: number,
    totalRevenue: number
}

type DashboardDataResponse = {
    data: OverViewMonth[]
}

export type StatisticState = {
    startDate: string; // Change from Date to string
    endDate: string; // Change from Date to string
    loading: boolean
    overviewOneMonthData: OverViewMonth[]
}

export const SLICE_NAME = 'statisticSlice'

export const getStatisticOverview = createAsyncThunk(
    SLICE_NAME + '/getSalesDashboardData',
    async () => {
        const data = {
            'from': initialState.startDate,
            'to': initialState.endDate
        }
        const response = await apiFetchOverviewStatistic<DashboardDataResponse>(data)
        console.log("RESULT: ")
        return response.data
    },
)

// KHỞI TẠO DỮ LIỆU GỐC
const initialState: StatisticState = {
    startDate: dayjs().subtract(1, 'month').toDate().toISOString(),
    endDate: new Date().toISOString(),
    loading: true,
    overviewOneMonthData: []
}

// TẠO SLICE
const statisticSlice = createSlice({
    name: 'StatisticsSlice',
    initialState: initialState,
    // REDUCERS
    reducers: {
        setStartDate: (state, action: PayloadAction<string>) => {
            state.startDate = action.payload
        },
        setEndDate: (state, action: PayloadAction<string>) => {
            state.endDate = action.payload
        }
    },
    // REDUCERS EXTRA
    extraReducers: (builder) => {
        builder
            .addCase(getStatisticOverview.fulfilled, (state, action) => {
                state.overviewOneMonthData = action.payload
                state.loading = false
            })
            .addCase(getStatisticOverview.pending, (state) => {
                state.loading = true
            })

    }
})
export const { setStartDate, setEndDate } = statisticSlice.actions

export default statisticSlice.reducer
