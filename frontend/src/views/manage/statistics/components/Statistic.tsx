import Card from '@/components/ui/Card'
import { NumericFormat } from 'react-number-format'
import GrowShrinkTag from '@/components/shared/GrowShrinkTag'
import { getStatisticOverview, OverViewMonth, useAppDispatch, useAppSelector } from '../store'
import dayjs from 'dayjs'
import { useEffect, useMemo } from 'react'

type StatisticCardProps = {
    value: string
    growShrink: number
    label: string
    valuePrefix?: string
    date: string
}
const StatisticCard = ({
                           value,
                           growShrink,
                           label,
                           valuePrefix,
                           date
                       }: StatisticCardProps) => {
    return (
        <Card>
            <h6 className="font-semibold mb-4 text-sm">{label}</h6>
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="font-bold">
                        <NumericFormat
                            thousandSeparator
                            displayType="text"
                            value={value}
                            prefix={valuePrefix}
                        />
                    </h3>
                    <p>
                        so với 1 tháng trước{' '}
                        <span className="font-semibold">
                            {dayjs(date).format('DD MMM')}
                        </span>
                    </p>
                </div>
                <GrowShrinkTag value={growShrink} suffix="%" />
            </div>
        </Card>
    )
}

const Statistic = () => {
    const dispatch = useAppDispatch()
    const startDate = useAppSelector((state) => state.statistic.startDate)
    const salesData = useAppSelector((state) => state.statistic.overviewOneMonthData)

    const today = new Date()
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    const calculateSummary = (data: OverViewMonth[], periodStart: Date) => {
        return data.reduce(
            (acc, sale) => {
                const saleDate = new Date(sale.createDate)
                if (saleDate >= periodStart) {
                    acc.quantityOrder += sale.quantityOrder
                    acc.totalRevenue += sale.totalRevenue
                }
                return acc
            },
            { quantityOrder: 0, totalRevenue: 0 }
        )
    }

    const summaryToday = useMemo(() => {
        const startOfDay =  dayjs().startOf('day').toDate();
        console.log("startOfDay")
        console.log(startOfDay)
        return calculateSummary(salesData, startOfDay)
    }, [salesData])

    const summaryWeek = useMemo(() => calculateSummary(salesData, startOfWeek), [startOfWeek])
    const summaryMonth = useMemo(() => calculateSummary(salesData, startOfMonth), [startOfMonth])


    useEffect(() => {
        console.log(salesData)
    }, [salesData])

    useEffect(() => {
        dispatch(getStatisticOverview())
    }, [])

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <StatisticCard value={summaryToday.totalRevenue.toFixed(2)} growShrink={6} label="Doanh số hôm nay"
                           date={startDate} />
            <StatisticCard value={summaryWeek.totalRevenue.toFixed(2)} growShrink={-6} label="Doanh số tuần này"
                           date={startDate} />
            <StatisticCard value={summaryMonth.totalRevenue.toFixed(2)} growShrink={0} label="Doanh số tháng này"
                           date={startDate} />
        </div>
    )
}

export default Statistic
