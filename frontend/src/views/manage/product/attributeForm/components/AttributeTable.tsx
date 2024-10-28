import { useEffect, useMemo, useRef, ReactNode, ChangeEvent } from 'react'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import DataTable from '@/components/shared/DataTable'
import { RiMoonClearLine, RiSunLine } from 'react-icons/ri'
import Switcher from '@/components/ui/Switcher'
import {
    Attribute,
    getAttributes,
    setTableData,
    setSelectedAttribute,
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
import ProductDeleteConfirmation from './AttributeDeleteConfirmation'
type AttributeTableProps = {
    apiFunc: any;
    apiDelete:any
    lablel:string
};

const withIcon = (component: ReactNode) => {
    return <div className="text-lg">{component}</div>
}

const AttributeColumn = ({ row }: { row: Attribute }) => {


    return (
        <div className="flex items-center">
            {/* {avatar} */}
            <span className={`ml-2 rtl:mr-2 font-semibold`}>{row.name}</span>
        </div>
    )
}

const getDeletedStatus = (deleted: boolean) => {
    if (deleted) {
        return {
            label: 'Dừng hoạt động',
            dotClass: 'bg-red-500',
            textClass: 'text-red-500',
        };
    } else {
        return {
            label: 'Đang hoạt động',
            dotClass: 'bg-emerald-500',
            textClass: 'text-emerald-500',
        };
    }
};



const AttributeTable = ({ apiFunc, apiDelete, lablel }: AttributeTableProps) => {
    const tableRef = useRef<DataTableResetHandle>(null)

    const dispatch = useAppDispatch()

    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.salesAttributeList.data.tableData
    )


    const loading = useAppSelector(
        (state) => state.salesAttributeList.data.loading
    )

    const data = useAppSelector(
        (state) => state.salesAttributeList.data.AttributeList
    )

    useEffect(() => {
        fetchData()
    }, [pageIndex, pageSize, sort])




    const tableData = useMemo(
        () => ({ pageIndex, pageSize, sort, query, total }),
        [pageIndex, pageSize, sort, query, total]
    )



    const fetchData = () => {
        const requestData = { pageIndex, pageSize, sort, query };
        dispatch(getAttributes({ apiFunc, requestData }));
    };


    const ActionColumn = ({ row }: { row: Attribute }) => {
        const dispatch = useAppDispatch()
        const onDelete = () => {
            dispatch(toggleDeleteConfirmation(true)) 
            dispatch(setSelectedAttribute(row.id))
        }

        const onSwitcherToggle = (val: boolean, e: ChangeEvent) => {
            onDelete()
        }
        return (
            <div className="flex w-full justify-start gap-2 items-center">
                <Switcher
                    className='text-sm'
                    unCheckedContent={withIcon(<RiMoonClearLine />)}
                    checkedContent={withIcon(<RiSunLine />)}
                    color="green-500"
                    checked={!row.deleted}
                    onChange={onSwitcherToggle} />
            </div>
        );
    };

    const columns: ColumnDef<Attribute>[] = useMemo(
        () => [
            {
                header: '#',
                id: 'index',
                cell: (props: any) => {
                    const { pageIndex, pageSize } = props.table.getState().pagination; // Lấy thông tin phân trang
                    const index = (pageIndex) * pageSize + (props.row.index + 1); // Tính số thứ tự
                    return <span>{index}</span>; // Hiển thị số thứ tự
                },
            },
            {
                header: 'Mã',
                accessorKey: 'code',
                cell: (props: any) => {
                    const row = props.row.original
                    return <span className="capitalize">{row.code}</span>
                },
            },
 

            {
                header: 'Tên',
                accessorKey: 'name',
                cell: (props: any) => {
                    const row = props.row.original
                    return <AttributeColumn row={row} />
                },
            },
            {
                header: 'Ngày tạo', 
                accessorKey: 'createdDate',
            },
            {
                header: 'Trạng thái',
                accessorKey: 'deleted', 
                cell: (props) => {
                    const { deleted } = props.row.original;
                    const status = getDeletedStatus(deleted);

                    return (
                        <div className="flex items-center gap-2">
                            <Badge className={status.dotClass} />
                            <span className={`capitalize font-semibold ${status.textClass}`}>
                                {status.label}
                            </span>
                        </div>
                    );
                },
            },

            {
                header: 'Hành động',
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
            />
            <ProductDeleteConfirmation apiDelete={apiDelete} apiFunc={apiFunc} lablel={lablel} />
        </>
    )
}

export default AttributeTable
