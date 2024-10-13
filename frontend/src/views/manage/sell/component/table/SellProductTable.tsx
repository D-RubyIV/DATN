
import { useState, useMemo } from 'react'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import { fakeOrderDetail, OrderDetailOverview } from '../..'
import { Avatar, Button } from '@/components/ui'
import { NumericFormat } from 'react-number-format'
import { HiDocumentRemove, HiMinus, HiPencil, HiPlusCircle } from 'react-icons/hi'

type Option = {
    value: number
    label: string
}

const { Tr, Th, Td, THead, TBody } = Table

const totalData = fakeOrderDetail.length

const pageSizeOption = [
    { value: 10, label: '10 / page' },
    { value: 20, label: '20 / page' },
    { value: 30, label: '30 / page' },
    { value: 40, label: '40 / page' },
    { value: 50, label: '50 / page' },
]

const columnHelper = createColumnHelper<OrderDetailOverview>()

const SellProductTable = () => {
    const columns = useMemo<ColumnDef<OrderDetailOverview>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Sản phẩm',
                cell: (props) => {
                    const row = props.row.original as OrderDetailOverview;
                    return <ProductColumn row={row} />;
                },
            },
            {
                accessorKey: 'quantity',
                header: 'Số lượng',
                cell: (props) => {
                    const row = props.row.original as OrderDetailOverview;
                    return (
                        <div className='flex gap-1 items-center justify-start'>
                            <button className='p-2 text-xl'><HiPlusCircle /></button>
                            <label>{props.row.original.quantity} </label>
                            <button className='p-2 text-xl'><HiMinus /></button>
                        </div>
                    )
                },
            },
            {
                accessorKey: 'price',
                header: 'Giá',
                cell: (props) => {
                    const row = props.row.original as OrderDetailOverview;
                    return <PriceAmount amount={row.price} />
                },
            },
            {
                // accessorKey: 'price',
                header: 'Tổng',
                cell: (props) => {
                    const row = props.row.original as OrderDetailOverview;
                    return <PriceAmount amount={row.quantity * row.price} />
                },
            },
            {
                // accessorKey: 'price',
                header: 'Hành động',
                cell: (props) => {
                    const row = props.row.original as OrderDetailOverview;
                    return (
                        <div>
                            <Button icon={<HiMinus />} variant='plain'></Button>
                        </div>
                    )
                },
            }
        ],
        []
    )


    const [data] = useState(fakeOrderDetail)

    const table = useReactTable({
        data,
        columns,
        // Pipeline
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    const onPaginationChange = (page: number) => {
        table.setPageIndex(page - 1)
    }

    const onSelectChange = (value = 0) => {
        table.setPageSize(Number(value))
    }

    const ActionColumn = ({ row }: { row: OrderDetailOverview }) => {
        return (
            <div className="flex gap-2">
                <button><HiPencil size={20} ></HiPencil></button>
                <button><HiMinus size={20}></HiMinus ></button>
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

    const ProductColumn = ({ row }: { row: OrderDetailOverview }) => {
        return (
            <div className="flex">
                <Avatar size={90} src={"https://www.bunyanbug.com/images/gone-fishing/fly%20fishing-1.png"} />
                <div className="ltr:ml-2 rtl:mr-2">
                    <h6 className="mb-2">{row.name}</h6>
                    <div className="mb-1">
                        <span className="capitalize">Cỡ: </span>
                        <span className="font-semibold">{"L"}</span>
                    </div>
                    <div className="mb-1">
                        <span className="capitalize">Màu: </span>
                        <span className="font-semibold">{"Xanh"}</span>
                    </div>
                </div>
            </div>
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

