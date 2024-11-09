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
    date: string,
    message: string
}

const StatisticCard = ({
                           value,
                           growShrink,
                           label,
                           valuePrefix,
                           date,
                           message
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
                        {message}{' '}
                        {/*<span className="font-semibold">*/}
                        {/*    {dayjs(date).format('DD MMM')}*/}
                        {/*</span>*/}
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

    // Tính ngày hôm qua
    const yesterday = dayjs().subtract(1, 'day').startOf('day').toDate()

    // Tính tuần trước
    const startOfWeekISO = new Date(today)
    const day = today.getDay()
    const diff = (day === 0 ? -6 : 1) - day
    startOfWeekISO.setDate(today.getDate() + diff)
    const startOfLastWeekISO = new Date(startOfWeekISO)
    startOfLastWeekISO.setDate(startOfWeekISO.getDate() - 7)
    const endOfLastWeekISO = new Date(startOfWeekISO)  // Ngày kết thúc của tuần trước

    // Tính tháng trước
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)  // Ngày cuối tháng trước

    const calculateSummary = (data: OverViewMonth[], periodStart: Date, periodEnd: Date) => {
        return Array.isArray(data) && data.reduce(
            (acc, sale) => {
                const saleDate = new Date(sale.createDate)
                if (saleDate >= periodStart && saleDate < periodEnd) {
                    acc.quantityOrder += sale.quantityOrder
                    acc.totalRevenue += sale.totalRevenue
                }
                return acc
            },
            { quantityOrder: 0, totalRevenue: 0 }
        )
    }

    const summaryToday = useMemo(() => {
        const startOfDay = dayjs().startOf('day').toDate()
        return calculateSummary(salesData, startOfDay, new Date(today))
    }, [salesData])

    const summaryWeek = useMemo(() => calculateSummary(salesData, startOfWeekISO, new Date(today)), [salesData])
    const summaryMonth = useMemo(() => calculateSummary(salesData, startOfMonth, new Date(today)), [salesData])

    const summaryYesterday = useMemo(() => calculateSummary(salesData, yesterday, new Date(today)), [salesData])
    const summaryLastWeek = useMemo(() => calculateSummary(salesData, startOfLastWeekISO, endOfLastWeekISO), [salesData])
    const summaryLastMonth = useMemo(() => calculateSummary(salesData, startOfLastMonth, endOfLastMonth), [salesData])

    useEffect(() => {
        dispatch(getStatisticOverview())
    }, [dispatch])

    const calculateGrowth = (symbol: string, current: number, previous: number) => {
        console.log(current, previous)
        if (previous === 0) return 100 // Trường hợp đặc biệt khi doanh số trước đó bằng 0
        return ((current - previous) / previous) * 100
    }

    // Tính toán tăng trưởng
    const growthToday = calculateGrowth("day", summaryToday?.totalRevenue ?? 0, summaryYesterday?.totalRevenue ?? 0)
    const growthWeek = calculateGrowth("week", summaryWeek?.totalRevenue ?? 0, summaryLastWeek?.totalRevenue ?? 0)
    const growthMonth = calculateGrowth("month", summaryMonth?.totalRevenue ?? 0, summaryLastMonth?.totalRevenue ?? 0)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <StatisticCard
                value={summaryToday?.totalRevenue?.toFixed(2) ?? "0"}
                growShrink={Math.round(growthToday)}
                message={"So với " + dayjs(yesterday).format('DD-MM-YYYY')}
                label="Doanh số hôm nay"
                date={startDate}
            />
            <StatisticCard
                value={summaryWeek?.totalRevenue?.toFixed(2) ?? "0"}
                growShrink={Math.round(growthWeek)}
                message={"So với tuần trước"}
                label="Doanh số tuần này"
                date={startDate}
            />
            <StatisticCard
                value={summaryMonth?.totalRevenue?.toFixed(2) ?? "0"}
                growShrink={Math.round(growthMonth)}
                message={"So với tháng trước"}
                label="Doanh số tháng này"
                date={startDate}
            />
        </div>
    )
}

export default Statistic
