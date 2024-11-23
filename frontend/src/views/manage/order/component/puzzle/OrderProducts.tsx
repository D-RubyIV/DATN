import { useState } from 'react'
import AdaptableCard from '@/components/shared/AdaptableCard'
import Table from '@/components/ui/Table'
import Avatar from '@/components/ui/Avatar'
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper
} from '@tanstack/react-table'
import { NumericFormat } from 'react-number-format'
import { Button, Drawer } from '@/components/ui'
import { HiLockClosed, HiMinus, HiMinusCircle, HiPlusCircle, HiViewList } from 'react-icons/hi'
import {
    OrderResponseDTO,
    OrderDetailResponseDTO,
    OrderProductDetail
} from '@/@types/order'
import History from './History'
import { ConfirmDialog } from '@/components/shared'
import instance from '@/axios/CustomAxios'
import { useToastContext } from '@/context/ToastContext'
import { FiPackage } from 'react-icons/fi'
import SellProductModal from '@/views/manage/sell/component/dialog/SellProductModal'
import { useOrderContext } from '@/views/manage/order/component/context/OrderContext'


const OrderProducts = ({ data, selectObject, fetchData }: {
    data: OrderDetailResponseDTO[],
    selectObject: OrderResponseDTO,
    fetchData: () => Promise<void>
}) => {
    const { Tr, Th, Td, THead, TBody } = Table

    // FUCTION
    const { openNotification } = useToastContext()

    const columnHelper = createColumnHelper<OrderDetailResponseDTO>()

    const hasSaleEvent = (item: OrderProductDetail) => {
        return item.product.eventDTOList.length > 0

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
            </div>

        )
    }


    const [openDelete, setOpenDelete] = useState(false)
    const [selectedOrderDetailId, setSelectedOrderDetailId] = useState<number>()

    const handleCloseDelete = () => {
        console.log('Close')
        setOpenDelete(false)
    }

    const handleConfirmDelete = async () => {
        console.log('Confirm')
        setOpenDelete(false)
        await instance.delete(`/order-details/${selectedOrderDetailId}`).then(function() {
            fetchData()
        })
    }

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


    const onOpenDeleteOrderDetail = (id: number) => {
        setOpenDelete(true)
        setSelectedOrderDetailId(id)
    }

    const ActionColumn = ({ row }: { row: OrderDetailResponseDTO }) => {
        return (
            <div>
                {
                    selectObject.status === 'PENDING' ? (
                        <div className="flex gap-2">
                            {/*<button><HiPencil size={20}></HiPencil></button>*/}
                            <button onClick={() => onOpenDeleteOrderDetail(row.id)}><HiMinus size={20}></HiMinus>
                            </button>
                        </div>
                    ) : (
                        <button><HiLockClosed size={20}></HiLockClosed></button>
                    )
                }

            </div>
        )
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

    const columns = [
        columnHelper.accessor('productDetailResponseDTO.name', {
            header: 'Sản phẩm',
            cell: (props) => {
                const row = props.row.original
                return <ProductColumn row={row} />
            }
        }),
        columnHelper.accessor('quantity', {
            header: 'Số lượng',
            cell: (props) => {
                return (
                    <div className="flex gap-1 items-center justify-start">
                        {
                            selectObject.status === 'PENDING' && (<button className="p-2 text-xl" onClick={() => {
                                handleUpdateQuantity(props.row.original.id, props.row.original.quantity + 1)
                            }}><HiPlusCircle /></button>)
                        }

                        <label>{props.row.original.quantity} </label>
                        {
                            selectObject.status === 'PENDING' && (<button className="p-2 text-xl" onClick={() => {
                                handleUpdateQuantity(props.row.original.id, props.row.original.quantity - 1)
                            }}><HiMinusCircle /></button>)
                        }

                    </div>
                )
            }
        }),
        columnHelper.accessor('productDetailResponseDTO.price', {
            header: 'Giá',
            cell: (props) => {
                const row = props.row.original
                return (
                    <div className={'flex gap-3 text-red-600'}>
                        <div className={`${hasSaleEvent(row.productDetailResponseDTO) ? 'line-through' : 'hidden'}`}>
                            <PriceAmount amount={row.productDetailResponseDTO.price} />
                        </div>
                        <PriceAmount amount={getFinalPriceInThePart(row)} />
                    </div>
                )
            }
        }),
        columnHelper.accessor('productDetailResponseDTO', {
            header: 'Tổng',
            cell: (props) => {
                const row = props.row.original
                return (
                    <div className={'flex gap-3 text-red-600'}>
                        <PriceAmount amount={row.quantity * getFinalPriceInThePart(row)} />
                    </div>
                )
            }
        }),
        columnHelper.accessor('productDetailResponseDTO.id', {
            header: 'Hành động',
            cell: (props) => {
                const row = props.row.original
                return <ActionColumn row={row} />
            }
        })
    ]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel()
    })

    const [isOpen, setIsOpen] = useState<boolean>(false)

    const openDrawer = () => {
        setIsOpen(true)
    }

    const onDrawerClose = (e: MouseEvent) => {
        console.log('onDrawerClose', e)
        setIsOpen(false)
    }

    const [isOpenProductModal, setIsOpenProductModal] = useState<boolean>(false)


    const handleCloseOverride = () => {
        console.log('Close')
        setIsOpenOverrideConfirm(false)
    }

    const handleConfirmOverride = async () => {
        console.log('Confirm')
        setIsOpenOverrideConfirm(false)
        console.log(selectedOrderRequestContext)
        await instance.post('/order-details', selectedOrderRequestContext).then(function() {
            fetchData()
        })
    }

    const { isOpenOverrideConfirm, setIsOpenOverrideConfirm, selectedOrderRequestContext } = useOrderContext()

    return (
        <div className="h-[680px]">
            <ConfirmDialog
                isOpen={openDelete}
                type={'danger'}
                title={'Xóa'}
                confirmButtonColor={'red-600'}
                onClose={handleCloseDelete}
                onRequestClose={handleCloseDelete}
                onCancel={handleCloseDelete}
                onConfirm={handleConfirmDelete}
            >
                <p>Xác nhận muốn xóa ?</p>
            </ConfirmDialog>
            <ConfirmDialog
                isOpen={isOpenOverrideConfirm}
                type={'warning'}
                title={'Xác nhận tạo bản ghi mới ?'}
                confirmButtonColor={'red-600'}
                onClose={handleCloseOverride}
                onRequestClose={handleCloseOverride}
                onCancel={handleCloseOverride}
                onConfirm={handleConfirmOverride}
            >
                <p>Đợt giảm giá cho đơn này đã có sự thay đổi</p>
            </ConfirmDialog>
            {/*  */}
            {isOpenProductModal && <SellProductModal fetchData={fetchData} setIsOpenProductModal={setIsOpenProductModal}
                                                     selectOrder={selectObject}></SellProductModal>}
            {/*  */}
            <div className="">
                <Drawer
                    title="Lịch sử"
                    isOpen={isOpen}
                    onClose={(e) => onDrawerClose(e)}
                    width={600}
                    onRequestClose={(e) => onDrawerClose(e)}
                >
                    <History selectObject={selectObject}></History>
                </Drawer>
            </div>
            <AdaptableCard className="mb-4 h-full">
                <div className="flex justify-end items-center pb-4 gap-2">
                    <Button block variant="default" size="sm" className="bg-indigo-500 !w-auto"
                            icon={<HiViewList />} onClick={() => openDrawer()}>
                        Xem lịch sử
                    </Button>
                    {
                        selectObject.status === 'PENDING' && (
                            <Button block variant="solid" size="sm" className="bg-indigo-500 !w-36" icon={<HiPlusCircle />}
                                    onClick={() => setIsOpenProductModal(true)}>
                                Thêm sản phẩm
                            </Button>
                        )
                    }

                </div>
                <div className="max-h-[450px] overflow-y-auto">
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
                </div>
            </AdaptableCard>
        </div>
    )
}

export default OrderProducts


