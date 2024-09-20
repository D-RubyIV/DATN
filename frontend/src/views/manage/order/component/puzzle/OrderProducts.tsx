import { Fragment, useState } from 'react'
import AdaptableCard from '@/components/shared/AdaptableCard'
import Table from '@/components/ui/Table'
import Avatar from '@/components/ui/Avatar'
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table'
import { NumericFormat } from 'react-number-format'
import isLastChild from '@/utils/isLastChild'
import { Link } from 'react-router-dom'
import { Button, Drawer, Notification, toast } from '@/components/ui'
import { HiPlusCircle, HiViewList } from 'react-icons/hi'
import { BillResponseDTO, OrderDetailResponseDTO, OrderProductsProps, ProductOrderDetail } from '../../store'
import History from './History'



const { Tr, Th, Td, THead, TBody } = Table

const columnHelper = createColumnHelper<OrderDetailResponseDTO>()

const ProductColumn = ({ row }: { row: OrderDetailResponseDTO }) => {
    return (
        <div className="flex">
            <Avatar size={90} src={"https://www.bunyanbug.com/images/gone-fishing/fly%20fishing-1.png"} />
            <div className="ltr:ml-2 rtl:mr-2">
                <h6 className="mb-2">{row.productDetail.name}</h6>
                <div className="mb-1">
                    <span className="capitalize">Size: </span>
                    <span className="font-semibold">{row.productDetail.size.name}</span>
                </div>
                <div className="mb-1">
                    <span className="capitalize">Color: </span>
                    <span className="font-semibold">{row.productDetail.color.name}</span>
                </div>
            </div>
        </div>
    )
}

const PriceAmount = ({ amount }: { amount: number }) => {
    return (
        <NumericFormat
            displayType="text"
            value={(Math.round(amount * 100) / 100).toFixed(2)}
            prefix={'$'}
            thousandSeparator={true}
        />
    )
}

const columns = [
    columnHelper.accessor('productDetail.name', {
        header: 'Product',
        cell: (props) => {
            const row = props.row.original
            return <ProductColumn row={row} />
        },
    }),
    columnHelper.accessor('quantity', {
        header: 'Quantity',
        cell: (props) => {
            const row = props.row.original
            return <PriceAmount amount={row.productDetail.price} />
        },
    }),
    columnHelper.accessor('productDetail.price', {
        header: 'Price',
        cell: (props) => {
            const row = props.row.original
            return <PriceAmount amount={row.productDetail.price} />
        },
    }),
    columnHelper.accessor('productDetail', {
        header: 'Total',
        cell: (props) => {
            const row = props.row.original
            return <PriceAmount amount={row.quantity * row.productDetail.price} />
        },
    }),
]


const OrderProducts = ({ data, selectObject }: { data: OrderDetailResponseDTO[], selectObject: BillResponseDTO }) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const [isOpen, setIsOpen] = useState<boolean>(false)

    const openDrawer = () => {
        setIsOpen(true)
    }

    const onDrawerClose = (e: MouseEvent | any) => {
        console.log('onDrawerClose', e)
        setIsOpen(false)
    }

    return (
        <div>
            <div className=''>
                <Drawer
                    title="History"
                    isOpen={isOpen}
                    onClose={(e) => onDrawerClose(e)}
                    width={600}
                    onRequestClose={(e) => onDrawerClose(e)}
                >
                    <History selectObject={selectObject}></History>
                </Drawer>

            </div>
            <AdaptableCard className="mb-4">
                <div className='flex justify-end items-center pb-4 gap-2'>
                    <Button onClick={() => openDrawer()} block variant="default" size="sm" className='bg-indigo-500 !w-auto' icon={<HiViewList />} >
                        History
                    </Button>
                    <Button block variant="solid" size="sm" className='bg-indigo-500 !w-32' icon={<HiPlusCircle />} >
                        Add Product
                    </Button>
                </div>
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
            </AdaptableCard>
        </div>
    )
}

export default OrderProducts


