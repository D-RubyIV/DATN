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
    const getFinalPrice = (item: OrderProductDetail) => {
        const discountPercent = item.product.eventDTOList.length > 0
            ? item.product.averageDiscountPercentEvent
            : 0

        return Math.round(item.price * (1 - discountPercent / 100))
    }

    const ProductColumn = ({ row }: { row: OrderDetailResponseDTO }) => {
        return (
            <div className="flex">
                <div className={'relative'}>
                    {
                        Array.isArray(row.productDetailResponseDTO.images)
                        && row.productDetailResponseDTO.images.length > 0 ?
                            (
                                <Avatar size={90} src={row.productDetailResponseDTO.images[0]?.url} />

                            ) :
                            (
                                <Avatar size={90} icon={<FiPackage />} />

                            )
                    }
                    {
                        row.productDetailResponseDTO.product.averageDiscountPercentEvent > 0 && (
                            <div
                                className={'text-[10px] absolute top-0 right-0 bg-red-600 text-white border border-black px-[4px] py-[1px]'}>
                                <span>-{row.productDetailResponseDTO.product.averageDiscountPercentEvent}%</span>
                            </div>
                        )
                    }
                </div>
                <div className="ltr:ml-2 rtl:mr-2">
                    <h6 className="mb-2">{row.productDetailResponseDTO.name}</h6>
                    <div className="mb-1">
                        <span className="capitalize">Cỡ: </span>
                        <span className="font-semibold">{row.productDetailResponseDTO.size.name}</span>
                    </div>
                    <div className="mb-1">
                        <span className="capitalize">Màu: </span>
                        <span className="font-semibold">{row.productDetailResponseDTO.color.name}</span>
                    </div>
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
        await instance.delete(`/order-details/${selectedOrderDetailId}`).then(function(response) {
            fetchData()
        })
    }

    const handleUpdateQuantity = async (id: number, quantity: number) => {
        await instance.get(`/order-details/quantity/update/${id}?quantity=${quantity}`)
            .then(function(response) {
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
                const row = props.row.original
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
                        <PriceAmount amount={getFinalPrice(row.productDetailResponseDTO)} />
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
                        <PriceAmount amount={row.quantity * getFinalPrice(row.productDetailResponseDTO)} />
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

    const onDrawerClose = (e: MouseEvent | any) => {
        console.log('onDrawerClose', e)
        setIsOpen(false)
    }

    const [isOpenProductModal, setIsOpenProductModal] = useState<boolean>(false)


    return (
        <div className="h-[585px]">
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
                    <Button onClick={() => openDrawer()} block variant="default" size="sm"
                            className="bg-indigo-500 !w-auto" icon={<HiViewList />}>
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


