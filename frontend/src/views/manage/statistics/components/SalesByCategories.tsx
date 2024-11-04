import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Chart from '@/components/shared/Chart'
import { COLORS } from '@/constants/chart.constant'
import {
    getSaleByCategories, OrderCounts,
    useAppDispatch,
    useAppSelector
} from '../store'
import { useEffect } from 'react'

type SalesByCategoriesProps = {
    labels: string[]
    data: number[]
}

const SalesByCategories = () => {
    const dispatch = useAppDispatch()
    const result = useAppSelector((state) => state.statistic.saleByCategoriesData)

    const resultData: SalesByCategoriesProps = {
        data: [
            (result as OrderCounts)?.countPending,
            (result as OrderCounts)?.countUnPaid,
            (result as OrderCounts)?.countToShip,
            (result as OrderCounts)?.countToReceive,
            (result as OrderCounts)?.countDelivered,
            (result as OrderCounts)?.countCancelled,
            (result as OrderCounts)?.countReturned
        ],
        labels: ['Chờ xác nhận', 'Chờ thanh toán', 'Chờ vận chuyển', 'Đang vận chuyển', 'Đã hoàn thành', 'Đã hủy hàng', 'Đã trả hàng']
    }

    useEffect(() => {
        dispatch(getSaleByCategories())
        console.log('dispatch(getSaleByCategories())')
        console.log(resultData)
        console.log((result as OrderCounts)?.countDelivered)
    }, [])

    return (
        <Card>
            <h4>Danh mục</h4>
            <div className="mt-6">
                {resultData.data.length > 0 && (
                    <div className={'grid grid-cols-2 gap-4'}>
                        <div>
                            <Chart
                                donutTitle={`${resultData.data.reduce(
                                    (a, b) => a + b,
                                    0
                                )}`}
                                donutText="Product Sold"
                                series={resultData.data}
                                customOptions={{ labels: resultData.labels }}
                                type="donut"
                            />
                        </div>
                        {resultData.data.length === resultData.labels.length && (
                            <div className="mt-6 grid grid-cols-1 gap-4 w-4/5 mx-auto">
                                {resultData.labels.map((value, index) => (
                                    <div
                                        key={value}
                                        className="flex items-center gap-1"
                                    >
                                        <Badge
                                            badgeStyle={{
                                                backgroundColor: COLORS[index]
                                            }}
                                        />
                                        <span className="font-semibold">
                                            {value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>
    )
}

export default SalesByCategories
