import { useEffect, useMemo, useRef, ReactNode, ChangeEvent } from 'react'
import DataTable from '@/components/shared/DataTable'
import { useParams } from 'react-router-dom';
import Switcher from '@/components/ui/Switcher'
import { RiMoonClearLine, RiSunLine } from 'react-icons/ri'
import Badge from '@/components/ui/Badge'
import { FaPen, FaEye } from 'react-icons/fa'
import useThemeClass from '@/utils/hooks/useThemeClass'
import {
    getProductDetails,
    setTableData,
    setProductId,
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
}

// const inventoryStatusColor: Record<
//     number,
//     {
//         label: string
//         dotClass: string
//         textClass: string
//     }
// > = {
//     0: {
//         label: 'In Stock',
//         dotClass: 'bg-emerald-500',
//         textClass: 'text-emerald-500',
//     },
//     1: {
//         label: 'Limited',
//         dotClass: 'bg-amber-500',
//         textClass: 'text-amber-500',
//     },
//     2: {
//         label: 'Out of Stock',
//         dotClass: 'bg-red-500',
//         textClass: 'text-red-500',
//     },
// }
const withIcon = (component: ReactNode) => {
    return <div className="text-lg">{component}</div>
}
const ActionColumn = ({ row }: { row: ProductDetail }) => {
    const { textTheme } = useThemeClass()
    return (
        <div className="flex justify-end text-lg">
            <span
                className={`cursor-pointer p-2 hover:${textTheme}`}
            >
                <FaPen />
            </span>
            <span
                className={`cursor-pointer p-2 hover:${textTheme}`}
            >
                <FaEye />
            </span>
            <Switcher
                unCheckedContent={withIcon(<RiMoonClearLine />)}
                checkedContent={withIcon(<RiSunLine />)}
                color="green-500"
              
            ></Switcher>  
            
        </div>
    )
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


    return (
        <div className="flex items-center">
            {/* {avatar} */}
            <span className={`ml-2 rtl:mr-2 font-semibold`}>{row.name}</span>
        </div>
    )
}


const ProductDetailTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)
    const dispatch = useAppDispatch()
    const{ id } = useParams();
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

    const columns: ColumnDef<ProductDetail>[] = useMemo(
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
                    return <ProductDetailColumn row={row} />
                },
            },
            {
                header: 'Màu Sắc',
                accessorKey: 'color.name',
                cell: (props) => {
                    const row = props.row.original
                    // Màu nền dựa trên tên màu
                    return <span className=" block w-20 h-4"
                        style={{
                            backgroundColor: row.color.name
                        }} >
                    </span>
                },
            },
            {
                header: 'Kích Thước',
                accessorKey: 'size.name',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="capitalize">{row.size.name}</span>
                },
            },
            {
                header: 'Giá',
                accessorKey: 'price',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="capitalize">{row.price}</span>
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
        const newTableData = cloneDeep(tableData);
        newTableData.sort = sort;
        dispatch(setTableData(newTableData));
    };
    const handleRowClick = (row: any) => {
        console.log('Row clicked:', row);
        // window.location.href = `/manage/product/ProductDetails/${row.id}`;
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
            {/* <ProductDeleteConfirmation /> */}
        </>
    )
}

export default ProductDetailTable
