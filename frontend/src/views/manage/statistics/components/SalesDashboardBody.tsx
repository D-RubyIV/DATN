import { Fragment } from 'react'
import Statistic from '@/views/manage/statistics/components/Statistic'
import SalesReport from '@/views/manage/statistics/components/SalesReport'

type SalesReportProps = {
    data?: {
        series?: {
            name: string
            data: number[]
        }[]
        categories?: string[]
    }
    className?: string
}

const salesReportData = {
    data: {
        series: [
            {
                name: 'Revenue',
                data: [50000, 70000, 45000, 80000, 60000, 95000, 110000] // sample revenue data for each category
            },
            {
                name: 'Orders',
                data: [20, 25, 15, 30, 28, 35, 40] // sample order count data for each category
            }
        ],
        categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] // sample categories, e.g., days of the week
    },
    className: 'chart-container' // optional custom CSS class for styling
}

const SalesDashboardBody = () => {

    return (
        <Fragment>
            <Statistic />
            <SalesReport data={salesReportData.data}></SalesReport>
        </Fragment>
    )
}

export default SalesDashboardBody