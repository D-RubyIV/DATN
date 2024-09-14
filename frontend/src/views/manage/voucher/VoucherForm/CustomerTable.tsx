import { useRef, useEffect, useMemo, useState } from 'react'
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table'
import Table from '@/components/ui/Table'
import Checkbox from '@/components/ui/Checkbox'
import type { ChangeEvent } from 'react'
import type { CheckboxProps } from '@/components/ui/Checkbox'
import type { ColumnDef } from '@tanstack/react-table'

type Person = {
    id: number;
    name: string;
    phone: string;
    email: string;
}

interface CustomerTableProps {
    onRowSelect?: (customer: { id: number }) => void;
}

type CheckBoxChangeEvent = ChangeEvent<HTMLInputElement>

const { Tr, Th, Td, THead, TBody } = Table

interface IndeterminateCheckboxProps extends Omit<CheckboxProps, 'onChange'> {
    onChange: (event: CheckBoxChangeEvent) => void;
    indeterminate: boolean;
}

function IndeterminateCheckbox({
    indeterminate,
    onChange,
    ...rest
}: IndeterminateCheckboxProps) {
    const ref = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        if (ref.current) {
            ref.current.indeterminate = !rest.checked && indeterminate
        }
    }, [indeterminate, rest.checked])

    return <Checkbox ref={ref} onChange={(_, e) => onChange(e)} {...rest} />
}

function CustomerTable({ onRowSelect }: CustomerTableProps) {
    const [rowSelection, setRowSelection] = useState({})
    const [data, setData] = useState<Person[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [globalFilter, setGlobalFilter] = useState('') // State for global search

    const columns = useMemo<ColumnDef<Person>[]>(() => [
        {
            id: 'select',
            header: ({ table }) => (
                <IndeterminateCheckbox
                    {...{
                        checked: table.getIsAllRowsSelected(),
                        indeterminate: table.getIsSomeRowsSelected(),
                        onChange: table.getToggleAllRowsSelectedHandler(),
                    }}
                />
            ),
            cell: ({ row }) => (
                <div className="px-1">
                    <IndeterminateCheckbox
                        {...{
                            checked: row.getIsSelected(),
                            disabled: !row.getCanSelect(),
                            indeterminate: row.getIsSomeSelected(),
                            onChange: row.getToggleSelectedHandler(),
                        }}
                    />
                </div>
            ),
        },
        {
            header: 'Id',
            accessorKey: 'id',
        },
        {
            header: 'Name',
            accessorKey: 'name',
        },
        {
            header: 'Phone Number',
            accessorKey: 'phone',
        },
        {
            header: 'Email',
            accessorKey: 'email',
        },
    ], [])

    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await fetch('http://localhost:8080/api/v1/customer/get-all')
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                const data = await response.json()
                setData(data)
            } catch (error: any) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const table = useReactTable({
        data,
        columns,
        state: {
            rowSelection,
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
    })

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    return (
        <div>
            <div className="mb-4">
                <input
                    type="text"
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search..."
                    className="border p-2 rounded"
                />
            </div>
            <Table>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <Th key={header.id} colSpan={header.colSpan}>
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </THead>
                <TBody>
                    {table.getRowModel().rows.map((row) => (
                        <Tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <Td key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </Td>
                            ))}
                        </Tr>
                    ))}
                </TBody>
            </Table>
            <div className="mt-4 flex justify-between items-center">
                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                     className="px-2 py-1 bg-gray-300 text-black rounded"
                >
                      &lt;
                </button>
                <span>
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                   className="px-2 py-1 bg-gray-300 text-black rounded"
                >
                     &gt;
                </button>
            </div>
        </div>
    )
}

export default CustomerTable
