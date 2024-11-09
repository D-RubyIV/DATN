import { useState, useMemo, useEffect } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Avatar, Button, Notification, toast } from '@/components/ui'
import { NumericFormat } from 'react-number-format'
import { HiMinus, HiMinusCircle, HiPlusCircle } from 'react-icons/hi'
import { OrderResponseDTO, OrderDetailResponseDTO } from '@/@types/order'
import instance from '@/axios/CustomAxios'
import { useToastContext } from '@/context/ToastContext'
import DataTable, { type OnSortParam } from '../../../../../components/shared/DataTable'
import { FiPackage } from 'react-icons/fi'

const SellProductTable = ({ selectedOrder, fetchData }: {
    selectedOrder: OrderResponseDTO,
    fetchData: () => Promise<void>
}) => {
    const [data, setData] = useState<OrderDetailResponseDTO[]>([])
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
        pageSize: 5,
        query: '',
        sort: {
            order: '',
            key: ''
        }
    })
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
        instance.get(`/order-details/get-by-order/${id}?page=${tableData.pageIndex - 1}&size=${tableData.pageSize}`).then(function(response) {
            setData(response.data.content)
            setTableData((prevData) => ({
                ...prevData,
                ...{
                    total: response.data.totalElements,
                }
            }))
        })

    }
    const fetchOrderData = async () => {
        if (selectedOrder && selectedOrder.id) {
            console.log('Thay đổi selectedOrder')
            await getAllOrderDetailWithIdOrder(selectedOrder.id)
        }
    }
    useEffect(() => {
        fetchOrderData()
    }, [selectedOrder, tableData.pageSize, tableData.pageIndex])


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
                    return <PriceAmount amount={row?.productDetailResponseDTO?.price} />
                }
            },
            {
                // accessorKey: 'price',
                header: 'Tổng',
                cell: (props) => {
                    const row = props.row.original as OrderDetailResponseDTO
                    return <PriceAmount amount={row.quantity * row?.productDetailResponseDTO?.price} />
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
                <Avatar size={90} icon={<FiPackage />} />
                <div className="ltr:ml-2 rtl:mr-2">
                    <h6 className="mb-2">{row?.productDetailResponseDTO?.name}</h6>
                    <div className="mb-1">
                        <span className="capitalize">Cỡ: </span>
                        <span className="font-semibold">{row?.productDetailResponseDTO?.size?.name}</span>
                    </div>
                    <div className="mb-1">
                        <span className="capitalize">Màu: </span>
                        <span className="font-semibold">{row?.productDetailResponseDTO?.color?.name}</span>
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
                            const response = await instance.delete(`/order-details/${idOrderDetail}`)
                            if (response.status === 200) {
                                console.log('response', response)
                                await getAllOrderDetailWithIdOrder(selectedOrder.id)
                            }
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
            <DataTable
                columns={columns}
                data={data}
                pagingData={tableData}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
            />
        </div>
    )
}

export default SellProductTable

