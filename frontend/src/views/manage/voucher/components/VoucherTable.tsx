import { useState, useEffect, useMemo } from 'react'
import { ColumnDef, DataTable } from '@/components/shared'
import { Button, Input } from '@/components/ui'
import axios from 'axios'
import Tag from '@/components/ui/Tag'

type IVoucher = {
    id: number
    code: string
    name: string
    typeTicket: string
    quantity: number
    maxPercent: number
    minAmount: number
    startDate: Date
    endDate: Date
    status: string
}

const VoucherTable = () => {
    const [data, setData] = useState<IVoucher[]>([])
    const [loading, setLoading] = useState(false)
    const [searchKeyword, setSearchKeyword] = useState('')
    const [tableData, setTableData] = useState<{
        pageIndex: number
        pageSize: number
        sort: {
            order: '' | 'asc' | 'desc'
            key: string | number
        }
        query: string
        total: number
    }>({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        query: '',
        sort: {
            order: '',
            key: '',
        },
    })

    const columns: ColumnDef<IVoucher>[] = useMemo(
        () => [
            {
                header: 'Mã',
                accessorKey: 'code',
            },
            {
                header: 'Tên ',
                accessorKey: 'name',
            },
            {
                header: 'Loại Phiếu',
                accessorKey: 'typeTicket',
            },
            {
                header: 'Số Lượng',
                accessorKey: 'quantity',
            },
            {
                header: 'Phần Trăm Tối Đa',
                accessorKey: 'maxPercent',
            },
            {
                header: 'Số Lượng Tối Thiếu',
                accessorKey: 'minAmount',
            },
            {
                header: 'Ngày Bắt Đầu',
                accessorKey: 'startDate',
            },
            {
                header: 'Ngày Kết Thúc',
                accessorKey: 'endDate',
            },
            {
                header: 'Trạng Thái',
                accessorKey: 'status',
                cell: ({ row }) => {
                    const status = row.original.status
                    const statusColor =
                        status === 'Not started yet'
                            ? 'bg-green-500 text-white'
                            : status === 'In progress'
                              ? 'bg-red-500 text-white'
                              : status === 'Expired'
                                ? 'bg-yellow-500 text-white'
                                : 'bg-gray-500 text-white'
                    return (
                        <Tag
                            className={`${statusColor} font-bold px-2 py-1 rounded`}
                        >
                            {status}
                        </Tag>
                    )
                },
            },
            {
                header: '',
                id: 'action',
                cell: ({ row }: { row: any }) => (
                    <Button
                        size="xs"
                        onClick={() => console.log('Action clicked', row)}
                    >
                        Action
                    </Button>
                ),
            },
        ],
        [],
    )

    const handlePaginationChange = (pageIndex: number) => {
        setTableData((prevData) => ({ ...prevData, pageIndex }))
    }

    const handleSelectChange = (pageSize: number) => {
        setTableData((prevData) => ({ ...prevData, pageSize }))
    }

    const handleSort = ({
        order,
        key,
    }: {
        order: '' | 'asc' | 'desc'
        key: string | number
    }) => {
        setTableData((prevData) => ({
            ...prevData,
            sort: { order, key },
        }))
    }

    useEffect(() => {
        setTableData((prevData) => ({
            ...prevData,
            query: searchKeyword,
            pageIndex: 1, // Reset lại page khi tìm kiếm mới
        }))
    }, [searchKeyword])

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const params = new URLSearchParams({
                pageIndex: tableData.pageIndex.toString(),
                pageSize: tableData.pageSize.toString(),
                sortKey: tableData.sort.key.toString(),
                sortOrder: tableData.sort.order,
                query: tableData.query,
            })

            try {
                const res = await axios.get(
                    `http://localhost:8080/api/v1/voucher?${params.toString()}`,
                )
                console.log(res)
                if (res.data) {
                    setData(res.data.data)
                    setTableData((prevData) => ({
                        ...prevData,
                        total: res.data.totalPages,
                    }))
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [
        tableData.pageIndex,
        tableData.sort,
        tableData.pageSize,
        tableData.query,
    ])

    return (
        <div>
            <Input
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Nhập từ khóa tìm kiếm..."
            />
            <DataTable<IVoucher>
                columns={columns}
                data={data}
                loading={loading}
                pagingData={{
                    total: tableData.total,
                    pageIndex: tableData.pageIndex,
                    pageSize: tableData.pageSize,
                }}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
            />
        </div>
    )
}

export default VoucherTable
