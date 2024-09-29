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
import axios from 'axios'
import type { ChangeEvent } from 'react'
import type { CheckboxProps } from '@/components/ui/Checkbox'
import type { ColumnDef } from '@tanstack/react-table'

type Customer = {
    id: number
    name: string
    phone: string
    email: string
}

type CheckBoxChangeEvent = ChangeEvent<HTMLInputElement>

interface IndeterminateCheckboxProps extends Omit<CheckboxProps, 'onChange'> {
    onChange: (event: CheckBoxChangeEvent) => void
    indeterminate: boolean
    onCheckBoxChange?: (event: CheckBoxChangeEvent) => void
    onIndeterminateCheckBoxChange?: (event: CheckBoxChangeEvent) => void
}

const { Tr, Th, Td, THead, TBody } = Table

function IndeterminateCheckbox({
    indeterminate,
    onChange,
    ...rest
}: IndeterminateCheckboxProps) {
    const ref = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (typeof indeterminate === 'boolean' && ref.current) {
            ref.current.indeterminate = !rest.checked && indeterminate
        }
    }, [ref, indeterminate])

    return <Checkbox ref={ref} onChange={(_, e) => onChange(e)} {...rest} />
}

interface TableCustomerProps {
    onSelectedCustomersChange: (selectedCustomers: Customer[]) => void
}

function TableCustomer ({ onSelectedCustomersChange }: TableCustomerProps) {
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
    const [data, setData] = useState<Customer[]>([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/customer/get-all')
            setData(response.data)
        } catch (error) {
            console.error('Failed to fetch customer data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    // Lắng nghe sự thay đổi của rowSelection và truyền dữ liệu ra ngoài component
    useEffect(() => {
        const selectedCustomerIds = Object.keys(rowSelection).filter(key => rowSelection[key]);
        const selectedCustomers = data.filter(customer => selectedCustomerIds.includes(customer.id.toString()));
    
        // Handle when no customer is selected
        if (selectedCustomers.length > 0) {
            onSelectedCustomersChange(selectedCustomers);
        } else {
            onSelectedCustomersChange([]);
        }
    }, [rowSelection, data, onSelectedCustomersChange]);
    

    const columns = useMemo<ColumnDef<Customer>[]>(() => {
        return [
            {
                id: 'select',
                header: ({ table }) => (
                    <IndeterminateCheckbox
                        checked={table.getIsAllRowsSelected()}
                        indeterminate={table.getIsSomeRowsSelected()}
                        onChange={table.getToggleAllRowsSelectedHandler()}
                    />
                ),
                cell: ({ row }) => (
                    <div className="px-1">
                        <IndeterminateCheckbox
                            checked={row.getIsSelected()}
                            disabled={!row.getCanSelect()}
                            indeterminate={row.getIsSomeSelected()}
                            onChange={row.getToggleSelectedHandler()}
                        />
                    </div>
                ),
            },
            {
                header: 'Tên ',
                accessorKey: 'name',
            },
            {
                header: 'Số điện thoại',
                accessorKey: 'phone',
            },
            {
                header: 'Email',
                accessorKey: 'email',
            },
        ]
    }, [])

    const table = useReactTable({
        data,
        columns,
        state: {
            rowSelection,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    if (loading) {
        return <div>Loading...</div>
    }

    if (data.length === 0) {
        return <div>No customer data available or failed to fetch data.</div>
    }

    return (
        <Table>
            <THead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <Tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <Th key={header.id} colSpan={header.colSpan}>
                                {flexRender(header.column.columnDef.header, header.getContext())}
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
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </Td>
                        ))}
                    </Tr>
                ))}
            </TBody>
        </Table>
    )
}

export default TableCustomer
