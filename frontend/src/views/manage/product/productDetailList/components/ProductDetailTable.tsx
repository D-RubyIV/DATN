import { useEffect, useMemo, useRef, ReactNode, ChangeEvent } from 'react'
import DataTable from '@/components/shared/DataTable'
import { useParams } from 'react-router-dom';
import Switcher from '@/components/ui/Switcher'
import { RiMoonClearLine, RiSunLine } from 'react-icons/ri'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import { FaPen, FaEye } from 'react-icons/fa'
import ProducttDetailUpdateConfirmation from './ProducttDetailUpdateConfirmation'
import ProductDetailDeleteConfirmation from './ProductDetailDeleteConfirmation'
import { FiPackage } from 'react-icons/fi'
import {
    getProductDetailId,
    getProductDetails,
    setTableData,
    setProductId,
    toggleUpdateConfirmation,
    toggleDeleteConfirmation,
    setSelectedProductDetail,
    useAppDispatch,
    useAppSelector,
} from '../store'
import cloneDeep from 'lodash/cloneDeep'
import type {
    DataTableResetHandle,
    OnSortParam,
    ColumnDef,
} from '@/components/shared/DataTable'
type ChildObject = {
    code: string;
    createdDate: string;
    deleted: boolean;
    id: number;
    name: string;
};
 type Image = {
    id: number;
    code: string;
    url: string;
    deleted: boolean;
    createdDate: string;
    modifiedDate: string;
};

type ProductDetail = {
    id: number;
    code: string;
    name: string;
    createdDate: string;
    size: ChildObject;
    color: ChildObject;
    brand?: ChildObject;
    collar?: ChildObject;
    elasticity?: ChildObject;
    material?: ChildObject;
    origin?: ChildObject;
    sleeve?: ChildObject;
    style?: ChildObject;
    texture?: ChildObject;
    thickness?: ChildObject;
    price?: number;
    quantity: number;
    images?: Image[]
    deleted: boolean;
}


const withIcon = (component: ReactNode) => {
    return <div className="text-lg">{component}</div>
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

const ProductDetailColumn = ({ row }: { row: ProductDetail }) => {
    const avatar = row.images ? (
        <Avatar src={row.images && row.images[0]?.url} />
    ) : (
        <Avatar icon={<FiPackage />} />
    )

    return (
        <div className="flex items-center">
            {avatar}
            <span className={`ml-2 rtl:mr-2 font-semibold`}>{row.name}</span>
        </div>
    )
}


const ProductDetailTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)
    const dispatch = useAppDispatch()
    const{ id  } = useParams();
    const productId = parseInt(id, 10);
    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.salesProductDetailList.data.tableData
    )

    const loading = useAppSelector(
        (state) => state.salesProductDetailList.data.loading
    )

    const data = useAppSelector(
        (state) => state.salesProductDetailList.data.productDetailList
    )

    useEffect(() => {
        fetchData()
        dispatch(setProductId(productId)); 
    }, [pageIndex, pageSize, sort, id])

    const tableData = useMemo(
        () => ({ pageIndex, pageSize, sort, query, total }),
        [pageIndex, pageSize, sort, query, total]
    )


    const fetchData = () => {
        dispatch(getProductDetails({ pageIndex, pageSize, sort, query }))

    }
    const ActionColumn = ({ row }: { row: ProductDetail }) => {
        const dispatch = useAppDispatch()
        const onUpdate = () => {
            dispatch(toggleUpdateConfirmation(true))
            dispatch(getProductDetailId({ id: row.id }));
        }
        const onDelete = () => {
            dispatch(toggleDeleteConfirmation(true))
            dispatch(setSelectedProductDetail(row.id))
        }

        const onSwitcherToggle = (val: boolean, e: ChangeEvent) => {
            onDelete()
        }
        return (
            <div className="flex justify-end text-lg">
                <FaEye
                    onClick={onUpdate}
                    size={20}
                    className="mr-3 text-2xl"
                    style={{ cursor: 'pointer' }}
                />
                <Switcher
                    className='text-sm'
                    unCheckedContent={withIcon(<RiMoonClearLine />)}
                    checkedContent={withIcon(<RiSunLine />)}
                    color="green-500"
                    checked={!row.deleted}
                    onChange={onSwitcherToggle}
                ></Switcher>

            </div>
        )
    }

    const columns: ColumnDef<ProductDetail>[] = useMemo(
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
                header: 'Tên',
                accessorKey: 'name',
                cell: (props: any) => {
                    const row = props.row.original
                    return <ProductDetailColumn row={row} />
                },
            },
            {
                header: 'Màu Sắc',
                accessorKey: 'color.name',
                cell: (props: any) => {
                    const row = props.row.original
                    return <span className=" block w-16 h-5 rounded-xl"
                        style={{
                            backgroundColor: row.color.name
                        }} >
                    </span>
                },
            },
            {
                header: 'Kích Thước',
                accessorKey: 'size.name',
                cell: (props: any) => {
                    const row = props.row.original
                    return <span className="capitalize">{row.size.name}</span>
                },
            },
            {
                header: 'Giá',
                accessorKey: 'price',
                cell: (props: any) => {
                    const row = props.row.original
                    return <span className="capitalize">{row.price}</span>
                },
            },
            {
                header: 'Số Lượng',
                accessorKey: 'quantity',
                cell: (props: any) => {
                    const row = props.row.original
                    return <span className="capitalize">{row.quantity}</span>
                },
            },
            {
                header: 'Trạng thái',
                accessorKey: 'status',
                cell: (props: any) => {
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
                cell: (props: any) => <ActionColumn row={props.row.original} />,
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
        const newTableData = cloneDeep(tableData);
        newTableData.sort = sort;
        dispatch(setTableData(newTableData));
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
            />
            <ProducttDetailUpdateConfirmation />
            <ProductDetailDeleteConfirmation/>
        </>
    )
}

export default ProductDetailTable
