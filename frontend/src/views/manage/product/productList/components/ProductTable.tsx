import { useEffect, useMemo, useRef, ReactNode, ChangeEvent } from 'react'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import DataTable from '@/components/shared/DataTable'
import { RiMoonClearLine, RiSunLine } from 'react-icons/ri'
import ProductDeleteConfirmation from './ProductDeleteConfirmation'
import Switcher from '@/components/ui/Switcher'
import {
    getProducts,
    setTableData,
    setSelectedProduct,
    toggleDeleteConfirmation,
    useAppDispatch,
    useAppSelector,
} from '../store'
import { useNavigate } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
import type {
    DataTableResetHandle,
    OnSortParam,
    ColumnDef,
} from '@/components/shared/DataTable'

type Product = {
    id: string
    name: string
    code: string
    // price: number
    deleted: boolean
    // createdDate: string;
    quantity: number;
}
const getInventoryStatus = (quantity: number) => {
    if (quantity > 10) {
        return {
            label: 'còn hàng',
            dotClass: 'bg-emerald-500',
            textClass: 'text-emerald-500',
        };
    } else if (quantity > 0) {
        return {
            label: 'sắp hết hàng',
            dotClass: 'bg-amber-500',
            textClass: 'text-amber-500',
        };
    } else {
        return {
            label: 'hết hàng',
            dotClass: 'bg-red-500',
            textClass: 'text-red-500',
        };
    }
};

const withIcon = (component: ReactNode) => {
    return <div className="text-lg">{component}</div>
}
const ActionColumn = ({ row }: { row: Product }) => {
    const dispatch = useAppDispatch()
    const onDelete = () => {
        dispatch(toggleDeleteConfirmation(true))
        dispatch(setSelectedProduct(row.id))
    }

    const onSwitcherToggle = (val: boolean, e: ChangeEvent) => {
        onDelete()
    }
    return (
        <div className="flex justify-end text-lg">
            <Switcher
                unCheckedContent={withIcon(<RiMoonClearLine />)}
                checkedContent={withIcon(<RiSunLine />)}
                color="green-500"
                checked={!row.deleted}
                onChange={onSwitcherToggle} />
        </div>
    );
};

const ProductColumn = ({ row }: { row: Product }) => {


    return (
        <div className="flex items-center">
            {/* {avatar} */}
            <span className={`ml-2 rtl:mr-2 font-semibold`}>{row.name}</span>
        </div>
    )
}

const ProductTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)

    const dispatch = useAppDispatch()

    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.salesProductList.data.tableData
    )

    const filterData = useAppSelector(
        (state) => state.salesProductList.data.filterData
    )

    const loading = useAppSelector(
        (state) => state.salesProductList.data.loading
    )

    const data = useAppSelector(
        (state) => state.salesProductList.data.productList
    )

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize, sort])

    useEffect(() => {
        if (tableRef) {
            tableRef.current?.resetSorting()
        }
    }, [filterData])

    const tableData = useMemo(
        () => ({ pageIndex, pageSize, sort, query, total }),
        [pageIndex, pageSize, sort, query, total]
    )


    const fetchData = () => {
        dispatch(getProducts({ pageIndex, pageSize, sort, query, filterData }))

    }

    const columns: ColumnDef<Product>[] = useMemo(
        () => [
            {
                header: '#',
                id: 'index',
                cell: (props) => {
                    const { pageIndex, pageSize } = props.table.getState().pagination; // Lấy thông tin phân trang
                    const index = (pageIndex) * pageSize + (props.row.index + 1); // Tính số thứ tự
                    return <span>{index}</span>; // Hiển thị số thứ tự
                },
            },
            {
                header: 'Mã',
                accessorKey: 'code',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="capitalize">{row.code}</span>
                },
            },
            {
                header: 'Tên',
                accessorKey: 'name',
                cell: (props) => {
                    const row = props.row.original
                    return <ProductColumn row={row} />
                },
            },
            {
                header: 'Số Lượng',
                accessorKey: 'quantity',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="capitalize">{row.quantity}</span>
                },
            },
            {
                header: 'Trạng thái',
                accessorKey: 'status',
                cell: (props) => {
                    const { quantity } = props.row.original;
                    const status = getInventoryStatus(quantity);

                    return (
                        <div className="flex items-center gap-2">
                            <Badge className={status.dotClass} />
                            <span
                                className={`capitalize font-semibold ${status.textClass}`}
                            >
                                {status.label}
                            </span>
                        </div>
                    );
                },
            },
            {
                header: '',
                id: 'action',
                cell: (props) => <ActionColumn row={props.row.original} />,
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
        newTableData.pageSize = Number(value)
        newTableData.pageIndex = 1
        dispatch(setTableData(newTableData))
    }

    const onSort = (sort: OnSortParam) => {
        const newTableData = cloneDeep(tableData)
        newTableData.sort = sort
        dispatch(setTableData(newTableData))
    }

    const navigate = useNavigate();

    const handleRowClick = (row: any) => {
        const id = row.id
        navigate(`/manage/product/ProductDetail-list/${id}`);
    };

    return (
        <>
            <DataTable
                ref={tableRef}
                columns={columns}
                data={data}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ className: 'rounded-md' }}
                loading={loading}
                pagingData={{
                    total: tableData.total as number,
                    pageIndex: tableData.pageIndex as number,
                    pageSize: tableData.pageSize as number,
                }}
                onPaginationChange={onPaginationChange}
                onSelectChange={onSelectChange}
                onSort={onSort}
                onRowClick={handleRowClick}
            />
            <ProductDeleteConfirmation />
        </>
    )
}

export default ProductTable
