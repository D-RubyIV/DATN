
import { useState, useEffect, useRef, ChangeEvent } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import DataTable from '@/components/shared/DataTable'
import debounce from 'lodash/debounce'
import type { ColumnDef, OnSortParam } from '@/components/shared/DataTable'
import { Badge, DatePicker, Select } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import { StatusBill, EOrderStatusEnums, OrderTypeBill, EOrderTypeEnums } from '../../../../../@types/order'
import { Link } from 'react-router-dom'
import { HiEye, HiOutlineSearch } from 'react-icons/hi'
import instance from '@/axios/CustomAxios'
import { formatDistanceToNow, parse, format, subHours } from 'date-fns'
import { vi } from 'date-fns/locale'

type BadgeType =
    'countAll'
    | 'countPending'
    | 'countToShip'
    | 'countToReceive'
    | 'countDelivered'
    | 'countCancelled'
    | 'countReturned'

interface ICountStatus {
    countAll: number;    // Số lượng hóa đơn chờ xác nhận
    countPending: number;    // Số lượng hóa đơn chờ xác nhận
    countToShip: number;     // Số lượng hóa đơn chờ giao hàng
    countToReceive: number;  // Số lượng hóa đơn đang giao hàng
    countDelivered: number;  // Số lượng hóa đơn đang giao hàng
    countCancelled: number;  // Số lượng hóa đơn đã hủy
    countReturned: number;   // Số lượng hóa đơn trả hàng
}

type IOveriewBill = {
    id: number;
    code: string;
    phone: string;
    status: string;
    customerName: string;
    staffName: string;
    address: string;
    type: string;
    total: number;
    subTotal: number;
    createdDate: string
}

export const OrderTable = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [countAnyStatus, setCountAnyStatus] = useState<ICountStatus>({
        countAll: 0,
        countPending: 0,
        countToShip: 0,
        countCancelled: 0,
        countDelivered: 0,
        countReturned: 0,
        countToReceive: 0,
    })
    const [queryParam, setQueryParam] = useState<{
        type: EOrderTypeEnums,
        status: EOrderStatusEnums | string,
        createdFrom: string,
        createdTo: string
    }>({
        type: '',
        status: '',
        createdFrom: '',
        createdTo: ''
    })

    const setFromDateParam = (p: string) => {
        setQueryParam(prevState => ({
            ...prevState,
            createdFrom: p
        }))
    }

    const setToDateParam = (p: string) => {
        setQueryParam(prevState => ({
            ...prevState,
            createdTo: p
        }))
    }

    const setTypeParam = (p: EOrderTypeEnums) => {
        setQueryParam(prevState => ({
            ...prevState,
            type: p
        }))
    }

    const setStatusParam = (p: EOrderStatusEnums) => {
        setQueryParam(prevState => ({
            ...prevState,
            status: p
        }))
    }

    const [tableData, setTableData] = useState<{
        pageIndex: number
        pageSize: number
        sort: {
            order: '' | 'asc' | 'desc'
            key: string | number;
        };
        query: string
        total: number
    }>({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        query: '',
        sort: {
            order: '',
            key: ''
        }
    })

    const inputRef = useRef(null)

    const debounceFn = debounce(handleDebounceFn, 500)

    function handleDebounceFn(val: string) {
        console.log(val)
        if (typeof val === 'string' && (val.length > 1 || val.length === 0)) {
            setTableData((prevData) => ({
                ...prevData,
                ...{ query: val, pageIndex: 1 }
            }))
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        debounceFn(e.target.value)
    }

    const calculateDistanceTime = (formattedDate: string) => {
        const date = parse(formattedDate, 'HH:mm dd-MM-yyyy', new Date())
        const dateMinus12Hours = subHours(date, 0)
        const distance = formatDistanceToNow(dateMinus12Hours, { addSuffix: true, locale: vi })
        return distance
    }


    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])


    const handleRangePickerChange = (date: [Date | null, Date | null]) => {
        console.log('Selected range date', date)

        if (date[0]) {
            const formattedFromDate = format(date[0], 'yyyy-MM-dd\'T\'HH:mm:ss')
            console.log(formattedFromDate)
            setFromDateParam(formattedFromDate)
        } else {
            setFromDateParam('')
        }

        if (date[1]) {
            const formattedToDate = format(date[1], 'yyyy-MM-dd\'T\'HH:mm:ss')
            console.log(formattedToDate)
            setToDateParam(formattedToDate)
        } else {
            setToDateParam('')
        }

        setDateRange(date)
    }


    const columns: ColumnDef<IOveriewBill>[] = [
        {
            header: '#',
            cell: (props) => (
                props.row.index + 1
            )
        },
        {
            header: 'Mã',
            accessorKey: 'code'
        },
        {
            header: 'Khách hàng',
            accessorKey: 'customer___name',
            cell: (props) => (
                props.row.original.customerName ?? 'N/a'
            )
        },
        {
            header: 'Nhân viên',
            accessorKey: 'staff___name',
            cell: (props) => (
                props.row.original.staffName ?? 'N/a'
            )
        },
        {
            header: 'SĐT',
            accessorKey: 'phone',
            cell: (props) => (
                props.row.original.phone || 'N/a'
            )
        },
        {
            header: 'Tổng tiền',
            accessorKey: 'total',
            cell: (props) => (
                Math.round(props.row.original.total).toLocaleString('vi') + 'đ'
            )
        },
        {
            header: 'Thời gian tạo',
            accessorKey: 'createdDate',
            cell: (props) => (
                calculateDistanceTime(props.row.original.createdDate)
            )
        },
        {
            header: 'Trạng thái',
            accessorKey: 'status',
            cell: (props) => (
                <Button
                    size="xs"
                    block
                    variant="solid"
                    className={`bg-white ${props.row.original.status === 'PENDING'
                        ? '!text-yellow-500'
                        : props.row.original.status === 'TOSHIP'
                            ? '!text-blue-500'
                            : props.row.original.status === 'TORECEIVE'
                                ? '!text-green-500'
                                : props.row.original.status === 'DELIVERED'
                                    ? '!text-purple-500'
                                    : props.row.original.status === 'CANCELED'
                                        ? '!text-red-500'
                                        : props.row.original.status === 'RETURNED'
                                            ? '!text-orange-500'
                                                    : '!text-gray-500'
                        }`}
                >
                    <span className={`flex items-center font-bold`}>
                        <span
                            className={`inline-block w-2 h-2 rounded-full mr-2 ${props.row.original.status === 'PENDING'
                                ? '!bg-yellow-500'
                                : props.row.original.status === 'TOSHIP'
                                    ? '!bg-blue-500'
                                    : props.row.original.status === 'TORECEIVE'
                                        ? '!bg-green-500'
                                        : props.row.original.status === 'DELIVERED'
                                            ? '!bg-purple-500'
                                            : props.row.original.status === 'CANCELED'
                                                ? '!bg-red-500'
                                                : props.row.original.status === 'RETURNED'
                                                    ? '!bg-orange-500'
                                                            : '!bg-gray-500'
                                }`}></span>
                        <span>
                            <p>
                                {props.row.original.status === 'PENDING'
                                    ? 'Chờ xác nhân'
                                    : props.row.original.status === 'TOSHIP'
                                        ? 'Chờ vận chuyển'
                                        : props.row.original.status === 'TORECEIVE'
                                            ? 'Đang vận chuyển'
                                            : props.row.original.status === 'DELIVERED'
                                                ? 'Đã hoàn thành'
                                                : props.row.original.status === 'CANCELED'
                                                    ? 'Đã hủy đơn'
                                                    : props.row.original.status === 'RETURNED'
                                                        ? 'Đã trả hàng'
                                                                : 'Không xác định'}
                            </p>
                        </span>
                    </span>
                </Button>

            )
        },
        {
            header: 'Loại hóa đon',
            accessorKey: 'type',
            cell: (props) => (
                <Button
                    size="xs"
                    block
                    variant="solid"
                    className={'bg-white'}
                >

                    <span
                        className={`flex items-center font-bold ${props.row.original.type === 'INSTORE' ? 'text-green-600' : 'text-red-600'}`}>
                        <span
                            className={`inline-block w-2 h-2 rounded-full mr-2 ${props.row.original.type === 'INSTORE' ? 'bg-green-600' : 'bg-red-600'}`}
                        ></span>
                        <span>
                            <p>
                                {props.row.original.type === 'INSTORE'
                                    ? 'Tại của hàng'
                                    : props.row.original.type === 'ONLINE'
                                        ? 'Trực tuyến'
                                        : 'Không xác định'}
                            </p>
                        </span>
                    </span>
                </Button>
            )
        },
        {
            header: 'Hành động',
            id: 'action',
            cell: (props) => (
                <Button size="xs" className="w-full flex justify-start items-center" variant="plain">
                    <Link to={`order-details/${props.row.original.id}`}><HiEye size={20} className="mr-3 text-2xl"
                        style={{ cursor: 'pointer' }} /></Link>
                </Button>

            )
        }
    ]

    const statusBills: StatusBill[] = [
        { label: 'TẤT CẢ', value: EOrderStatusEnums.EMPTY, badge: 'countAll' },
        { label: 'CHỜ XÁC NHẬN', value: EOrderStatusEnums.PENDING, badge: 'countPending' },
        { label: 'CHỜ VẬN CHUYỂN', value: EOrderStatusEnums.TOSHIP, badge: 'countToShip' },
        { label: 'ĐANG VẬN CHUYỂN', value: EOrderStatusEnums.TORECEIVE, badge: 'countToReceive' },
        { label: 'ĐÃ HOÀN THÀNH', value: EOrderStatusEnums.DELIVERED, badge: 'countDelivered' },
        { label: 'ĐÃ HỦY', value: EOrderStatusEnums.CANCELED, badge: 'countCancelled' },
        { label: 'TRẢ HÀNG', value: EOrderStatusEnums.RETURNED, badge: 'countReturned' }
    ]

    const handlePaginationChange = (pageIndex: number) => {
        setTableData((prevData) => ({ ...prevData, ...{ pageIndex } }))
    }

    const handleSelectChange = (pageSize: number) => {
        setTableData((prevData) => ({
            ...prevData,
            pageSize: pageSize, // Cập nhật pageSize mới
            pageIndex: 1 // Đặt pageIndex về 1
        }))
    }

    const handleSort = ({ order, key }: OnSortParam) => {
        console.log({ order, key })
        setTableData((prevData) => ({
            ...prevData,
            sort: {
                order,
                key: (key as string).replace('___', '.')
            }
        }))
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const response = await instance.post('/orders/overview', tableData,
                {
                    params: queryParam
                }
            )
            console.log(response)
            if (response.data) {
                setData(response.data.content)
                setLoading(false)
                setTableData((prevData) => ({
                    ...prevData,
                    ...{ total: response.data.totalElements }
                }))
            }
        }
        fetchCountAnyStatus()
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        tableData.pageIndex,
        tableData.sort,
        tableData.pageSize,
        tableData.query,
        queryParam
    ])

    const listTypeBillOptions: OrderTypeBill[] = [
        { label: 'Tất cả', value: '' },
        { label: 'Tại cửa hàng', value: 'INSTORE' },
        { label: 'Trực tuyến', value: 'ONLINE' }
    ]

    const fetchCountAnyStatus = async () => {
        instance.get('orders/count-any-status').then(function (response) {
            if (response.data) {
                setCountAnyStatus(response.data as ICountStatus)
            }
        })

    }

    return (
        <>
            <div>
                <h1 className="font-semibold text-xl text-black mb-4 text-transform: uppercase">Quản lý hóa đơn</h1>
            </div>
            <div className="grid grid-cols-3 gap-2 py-2">
                <div>
                    <div className="relative mr-4">
                        <Input
                            ref={inputRef}
                            placeholder="Tìm kiếm theo mã, tên nhân viên, tên khách hàng ..."
                            size="sm"
                            className="lg:w-full"
                            onChange={handleChange}
                            prefix={<HiOutlineSearch className="text-lg" />}
                        />
                    </div>
                </div>
                <div className="flex justify-between gap-5">
                    <DatePicker.DatePickerRange
                        placeholder="Chọn khoảng ngày"
                        value={dateRange}
                        dateViewCount={2}
                        onChange={handleRangePickerChange}
                    />
                </div>
                <div>
                    <Select
                        placeholder="Loại hóa đơn"
                        options={listTypeBillOptions}
                        onChange={(el) => {
                            setTypeParam((el as OrderTypeBill).value) // Sử dụng as để xác nhận kiểu
                        }}
                    ></Select>

                </div>
            </div>
            <div className="py-2">
                <TabList className="flex justify-evenly gap-4 w-full bg-white pt-3 pb-1">
                    {
                        statusBills.map((item, index) => (
                            <TabNav key={index}
                                className={`w-full rounded ${queryParam.status === item.value ? 'bg-opacity-80 bg-blue-100 text-indigo-600' : ''}`}
                                value={item.value}>
                                <Badge className="mr-5" content={(countAnyStatus[item.badge as BadgeType] as number)}
                                    maxCount={99} innerClass="bg-red-50 text-red-500">
                                    <button className="p-2 w-auto" onClick={() => setStatusParam(item.value)}>
                                        {item.label}
                                    </button>
                                </Badge>
                            </TabNav>
                        ))
                    }
                </TabList>
            </div>

            <div className="py-4 px-2">
                <DataTable
                    columns={columns}
                    data={data}
                    loading={loading}
                    pagingData={tableData}
                    onPaginationChange={handlePaginationChange}
                    onSelectChange={handleSelectChange}
                    onSort={handleSort}
                />
            </div>
        </>
    )
}

