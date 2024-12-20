import { useEffect, useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Avatar, Button, Notification, toast } from '@/components/ui'
import { NumericFormat } from 'react-number-format'
import { HiMinus, HiMinusCircle, HiPlusCircle } from 'react-icons/hi'
import { OrderDetailResponseDTO, OrderResponseDTO } from '@/@types/order'
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
                        openNotification(err.response.data.error, "Thông báo", "warning", 1500)
                    }
                } else {
                    console.log('Error message:', err.message) // Nếu không có phản hồi từ máy chủ
                }
                fetchData()
            })
    }

    const getAllOrderDetailWithIdOrder = async (id: number) => {
        instance.get(`/order-details/get-by-order/${id}?page=${tableData.pageIndex - 1}&size=${tableData.pageSize}`).then(function(response) {
            setData(response.data.content)
            setTableData((prevData) => ({
                ...prevData,
                ...{
                    total: response.data.totalElements
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
                header: 'Kho',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className={`${row.productDetailResponseDTO.quantity >= props.row.original.quantity ? "text-green-600" : "text-red-600"} `}>
                            <p>{row.productDetailResponseDTO.quantity}</p>
                        </div>
                    )
                }
            },
            {
                accessorKey: 'price',
                header: 'Giá Gốc',
                cell: (props) => {
                    const row = props.row.original as OrderDetailResponseDTO
                    return (
                        <div>
                            {
                                row.averageDiscountEventPercent ? (
                                        <div className={'flex gap-2 flex-col'}>
                                            <PriceAmount
                                                className={'text-gray-900 line-through'}
                                                amount={row.productDetailResponseDTO.price}
                                            />
                                            <PriceAmount
                                                className={'text-red-600'}
                                                amount={getFinalPriceInThePart(row)}
                                            />
                                        </div>
                                    ) :
                                    (
                                        <div>
                                            <PriceAmount
                                                className={'text-red-600'}
                                                amount={getFinalPriceInThePart(row)}
                                            />
                                        </div>
                                    )
                            }
                        </div>
                    )
                }
            },
            {
                // accessorKey: 'price',
                header: 'Tổng',
                cell: (props) => {
                    const row = props.row.original as OrderDetailResponseDTO
                    return <PriceAmount
                        className={'text-red-600'}
                        amount={row.quantity * getFinalPriceInThePart(row)}
                    />
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
    const PriceAmount = ({ amount, className }: { amount: number; className?: string }) => {
        return (
            <NumericFormat
                displayType="text"
                value={(Math.round(amount * 100) / 100).toFixed(2)}
                suffix={'₫'}
                thousandSeparator={true}
                className={className} // Áp dụng className
            />
        )
    }

    const hasChangeEventPercent = (item: OrderDetailResponseDTO) => {
        const nowPercent = item.averageDiscountEventPercent
        const partPercent = item.productDetailResponseDTO.product.nowAverageDiscountPercentEvent
        return nowPercent === partPercent
    }

    const getFinalPriceInThePart = (item: OrderDetailResponseDTO) => {
        const discountPercent = item.averageDiscountEventPercent > 0
            ? item.averageDiscountEventPercent
            : 0

        return Math.round(item.productDetailResponseDTO.price * (1 - discountPercent / 100))
    }

    const availableQuantityProvide = (item: OrderDetailResponseDTO) => {
        const product_detail_quantity = item.productDetailResponseDTO.quantity
        return product_detail_quantity > 0;
    }

    const ProductColumn = ({ row }: { row: OrderDetailResponseDTO }) => {
        return (
            <div>
                <div className="flex gap-3">
                    <div className={'relative'}>
                        {
                            Array.isArray(row.productDetailResponseDTO.images) && row.productDetailResponseDTO.images.length > 0 ?
                                (
                                    <Avatar
                                        size={100}
                                        src={row.productDetailResponseDTO.images[0].url}
                                    />
                                )
                                : (
                                    <Avatar size={100} icon={<FiPackage />} />
                                )
                        }
                        {
                            row?.averageDiscountEventPercent ? (
                                <div
                                    className={'absolute -top-2 -right-2 text-white p-[2px] bg-red-600 text-[12px] border border-black'}>
                                    {
                                        <p>-{row.averageDiscountEventPercent}%</p>
                                    }
                                </div>
                            ) : (<div></div>)
                        }

                    </div>
                    <div className="ltr:ml-2 rtl:mr-2">
                        <h6 className="mb-2">
                            ({row.productDetailResponseDTO?.product.name})
                            {row.productDetailResponseDTO?.name}</h6>
                        <div className="mb-1">
                            <span className="capitalize">Mã SCPT: </span>
                            <span className="font-semibold">{row.productDetailResponseDTO?.code}</span>
                        </div>
                        <div className="mb-1">
                            <span className="capitalize">Kích cỡ: </span>
                            <span className="font-semibold">{row.productDetailResponseDTO?.size.name}</span>
                        </div>
                        <div className="mb-1">
                            <span className="capitalize">Màu sắc: </span>
                            <span className="font-semibold">{row.productDetailResponseDTO?.color.name}</span>
                        </div>
                    </div>
                </div>
                <div className={'text-orange-700'}>
                    {hasChangeEventPercent(row) ? '' : `Có sự thay đổi về khuyễn mãi sự kiện hiện tại là ${row.productDetailResponseDTO.product.nowAverageDiscountPercentEvent}%`}
                </div>
                <div className={'text-orange-700'}>
                    {availableQuantityProvide(row) ? '' : `Sản phẩm này hiện không đủ số lượng cung ứng thêm`}
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
                                await fetchData()
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

