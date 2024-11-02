import { injectReducer } from '@/store'
import React from 'react'
import SalesDashboardBody from '@/views/manage/statistics/components/SalesDashboardBody'
import reducer from '@/views/manage/statistics/store'


injectReducer('STATISTIC_SLICE', reducer)

const SalesDashboard = () => {
    return (
        <div className="flex flex-col gap-4 h-full">
            <SalesDashboardBody />
        </div>
    )
}

export default SalesDashboard
