import { ColumnDef, DataTable, DataTableResetHandle, OnSortParam, Row } from "@/components/shared"
import { addRowItem, getCustomers, removeRowItem, setSelectedRows, setTableData, useAppDispatch, useAppSelector } from "../store"
import useThemeClass from "@/utils/hooks/useThemeClass"
import { useCallback, useEffect, useMemo, useRef } from "react"
import { useNavigate } from "react-router-dom"
import dayjs from "dayjs"
import { cloneDeep } from "lodash"

type Customer = {
    id: number
    name: string
    phone: string
    email: string
}

const CustomerColumn = ({ row }: { row: Customer }) => {
    const { textTheme } = useThemeClass()
    const navigate = useNavigate()

    const onView = useCallback(() => {
        navigate(`/app/sales/order-details/${row.id}`)
    }, [navigate, row.id])

    return (
        <span
            className={`cursor-pointer select-none font-semibold hover:${textTheme}`}
            onClick={onView}
        >
            #{row.id}
        </span>
    )
}

const OrdersTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)

    const dispatch = useAppDispatch()

    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.salesCustomerList.data.tableData
    )
    const loading = useAppSelector((state) => state.salesCustomerList.data.loading)

    const data = useAppSelector((state) => state.salesCustomerList.data.customerList)

    const fetchData = useCallback(() => {
        console.log('{ pageIndex, pageSize, sort, query }', {
            pageIndex,
            pageSize,
            sort,
            query,
        })
        dispatch(getCustomers({ pageIndex, pageSize, sort, query }))
    }, [dispatch, pageIndex, pageSize, sort, query])

    useEffect(() => {
        dispatch(setSelectedRows([]))
        fetchData()
    }, [dispatch, fetchData, pageIndex, pageSize, sort])

    useEffect(() => {
        tableRef.current?.resetSelected()
    }, [data])

    const tableData = useMemo(
        () => ({ pageIndex, pageSize, sort, query, total }),
        [pageIndex, pageSize, sort, query, total]
    )

    const columns: ColumnDef<Customer>[] = useMemo(
        () => [
            {
                header: 'Id',
                accessorKey: 'id',
                cell: (props) => <CustomerColumn row={props.row.original} />,
            },
            {
                header: 'Name',
                accessorKey: 'name',
            },
            {
                header: 'Phone',
                accessorKey: 'phone',
            },
            {
                header: 'Email',
                accessorKey: 'email',
            },
        ],
        []
    )

    const onPaginationChange = (page: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = page
        dispatch(setTableData(newTableData))
    }

    const onSelectChange = (value: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageSize = value
        newTableData.pageIndex = 1
        dispatch(setTableData(newTableData))
    }

    const onSort = (sort: OnSortParam) => {
        const newTableData = cloneDeep(tableData)
        newTableData.sort = sort
        dispatch(setTableData(newTableData))
    }

    const onRowSelect = (checked: boolean, row: Customer) => {
        if (checked) {
            dispatch(addRowItem([row.id]))
        } else {
            dispatch(removeRowItem(row.id))
        }
    }

    const onAllRowSelect = useCallback(
        (checked: boolean, rows: Row<Customer>[]) => {
            if (checked) {
                const selectedIds = rows.map((row) => row.original.id)
                dispatch(setSelectedRows(selectedIds))
            } else {
                dispatch(setSelectedRows([]))
            }
        },
        [dispatch]
    )

    return (
        <DataTable
            ref={tableRef}
            selectable
            columns={columns}
            data={data}
            loading={loading}
            pagingData={{
                total: total,
                pageIndex: pageIndex,
                pageSize: pageSize,
            }}
            onPaginationChange={onPaginationChange}
            onSelectChange={onSelectChange}
            onSort={onSort}
            onCheckBoxChange={onRowSelect}
            onIndeterminateCheckBoxChange={onAllRowSelect}
        />
    )
}

export default OrdersTable
