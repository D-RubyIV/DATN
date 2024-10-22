import { useState, useMemo, useEffect } from 'react'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import { Avatar, Button, Notification, toast } from '@/components/ui'
import { NumericFormat } from 'react-number-format'
import { HiMinus, HiMinusCircle, HiPlusCircle } from 'react-icons/hi'
import { OrderResponseDTO, OrderDetailResponseDTO } from '@/@types/order'
import instance from '@/axios/CustomAxios'
import { useToastContext } from '@/context/ToastContext'

type Option = {
    value: number
    label: string
}

const { Tr, Th, Td, THead, TBody } = Table


const pageSizeOption = [
    { value: 5, label: '5 / page' },
    { value: 10, label: '10 / page' },
    { value: 20, label: '20 / page' },
    { value: 30, label: '30 / page' },
    { value: 40, label: '40 / page' },
    { value: 50, label: '50 / page' }
]

const SellProductTable = ({ selectedOrder, fetchData }: {
    selectedOrder: OrderResponseDTO,
    fetchData: () => Promise<void>
}) => {
    const [data, setData] = useState<OrderDetailResponseDTO[]>([])
    const [totalData, setTotalData] = useState(0)
    const [pageSize, setPageSize] = useState(5)

    const { openNotification } = useToastContext()


    const handleUpdateQuantity = async (id: number, quantity: number) => {
        await instance.get(`/order-details/quantity/update/${id}?quantity=${quantity}`)
            .then(function() {
                fetchData()
            })
            .catch(function(err) {
                console.error('Error updating quantity:', err)
                if (err.response) {
                    console.log('Status code:', err.response.status) // Trạng thái HTTP từ phản hồi
                    if (err.response.status === 400) {
                        openNotification(err.response.data.error)
                    }
                } else {
                    console.log('Error message:', err.message) // Nếu không có phản hồi từ máy chủ
                }
            })
    }


    const getAllOrderDetailWithIdOrder = async (id: number) => {
        console.log(table)
        instance.get(`/order-details/get-by-order/${id}?page=${table.getState().pagination.pageIndex}&size=${table.getState().pagination.pageSize}`).then(function(response) {
            setData(response.data.content)
            setTotalData(response.data.totalElements)
        })

    }

    useEffect(() => {
        const fetchData = async () => {
            if (selectedOrder && selectedOrder.id) {
                console.log('Thay đổi selectedOrder')
                await getAllOrderDetailWithIdOrder(selectedOrder.id)
            }
        }

        fetchData()
    }, [selectedOrder])


    const columns = useMemo<ColumnDef<OrderDetailResponseDTO>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Sản phẩm',
                cell: (props) => {
                    const row = props.row.original as OrderDetailResponseDTO
                    return <ProductColumn row={row} />
                }
            },
            {
                accessorKey: 'quantity',
                header: 'Số lượng',
                cell: (props) => {
                    return (
                        <div className="flex gap-1 items-center justify-start">
                            {
                                (<button className="p-2 text-xl" onClick={() => {
                                    handleUpdateQuantity(props.row.original.id, props.row.original.quantity + 1)
                                }}><HiPlusCircle /></button>)
                            }

                            <label>{props.row.original.quantity} </label>
                            {
                                (<button className="p-2 text-xl" onClick={() => {
                                    handleUpdateQuantity(props.row.original.id, props.row.original.quantity - 1)
                                }}><HiMinusCircle /></button>)
                            }

                        </div>
                    )
                }
            },
            {
                accessorKey: 'price',
                header: 'Giá',
                cell: (props) => {
                    const row = props.row.original as OrderDetailResponseDTO
                    return <PriceAmount amount={row.productDetail.price} />
                }
            },
            {
                // accessorKey: 'price',
                header: 'Tổng',
                cell: (props) => {
                    const row = props.row.original as OrderDetailResponseDTO
                    return <PriceAmount amount={row.quantity * row.productDetail.price} />
                }
            },
            {
                // accessorKey: 'price',
                header: 'Hành động',
                cell: (props) => {
                    const row = props.row.original as OrderDetailResponseDTO
                    return (
                        <div>
                            <Button
                                icon={<HiMinus />}
                                variant="plain"
                                onClick={() => openDeleteConfirm(row.id)}
                            ></Button>
                        </div>
                    )
                }
            }
        ],
        []
    )

    const table = useReactTable({
        data,
        columns,
        // Pipeline
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    })

    useEffect(() => {
        table.setPageSize(Number(pageSize))
    }, [pageSize, table.initialState.pagination.pageIndex])


    const onPaginationChange = (page: number) => {
        table.setPageIndex(page - 1)
    }

    const onSelectChange = (value = 0) => {
        setPageSize(value)
    }

    const PriceAmount = ({ amount }: { amount: number }) => {
        return (
            <NumericFormat
                displayType="text"
                value={(Math.round(amount * 100) / 100).toFixed(2)}
                suffix={'₫'}
                thousandSeparator={true}
            />
        )
    }

    const ProductColumn = ({ row }: { row: OrderDetailResponseDTO }) => {
        return (
            <div className="flex">
                <Avatar size={90} src={'https://www.bunyanbug.com/images/gone-fishing/fly%20fishing-1.png'} />
                <div className="ltr:ml-2 rtl:mr-2">
                    <h6 className="mb-2">{row.productDetail.name}</h6>
                    <div className="mb-1">
                        <span className="capitalize">Cỡ: </span>
                        <span className="font-semibold">{row.productDetail.size.name}</span>
                    </div>
                    <div className="mb-1">
                        <span className="capitalize">Màu: </span>
                        <span className="font-semibold">{row.productDetail.color.name}</span>
                    </div>
                </div>
            </div>
        )
    }

    const closeNotification = (key: string | Promise<string>) => {
        if (typeof key !== 'string') {
            key.then((resolvedValue) => {
                toast.remove(resolvedValue)
            })
        } else {
            toast.remove(key)
        }
    }

    const openDeleteConfirm = async (idOrderDetail: number) => {
        const notificationKey = toast.push(
            <Notification title="Thông báo" duration={8000}>
                <div>
                    Xác nhận xóa sản phẩm này khỏi giỏ hàng ?
                </div>
                <div className="text-right mt-3">
                    <Button
                        size="sm"
                        variant="solid"
                        className="mr-2 bg-red-600"
                        onClick={async () => {
                            closeNotification(notificationKey as string | Promise<string>)
                            await instance.delete(`/order-details/${idOrderDetail}`)
                            await fetchData()
                        }}
                    >
                        Xác nhận
                    </Button>
                    <Button
                        size="sm"
                        onClick={() =>
                            closeNotification(notificationKey as string | Promise<string>)
                        }
                    >
                        Hủy
                    </Button>
                </div>
            </Notification>
        )
    }

    return (
        <div>
            <Table>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <Th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </Th>
                                )
                            })}
                        </Tr>
                    ))}
                </THead>
                <TBody>
                    {table.getRowModel().rows.map((row) => {
                        return (
                            <Tr key={row.id}>
                                {row.getVisibleCells().map((cell) => {
                                    return (
                                        <Td key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </Td>
                                    )
                                })}
                            </Tr>
                        )
                    })}
                </TBody>
            </Table>
            <div className="flex items-center justify-between mt-4">
                <Pagination
                    pageSize={table.getState().pagination.pageSize}
                    currentPage={table.getState().pagination.pageIndex + 1}
                    total={totalData}
                    onChange={onPaginationChange}
                />
                <div style={{ minWidth: 130 }}>
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOption.filter(
                            (option) =>
                                option.value ===
                                table.getState().pagination.pageSize
                        )}
                        options={pageSizeOption}
                        onChange={(option) => onSelectChange(option?.value)}
                    />
                </div>
            </div>
        </div>
    )
}

export default SellProductTable

