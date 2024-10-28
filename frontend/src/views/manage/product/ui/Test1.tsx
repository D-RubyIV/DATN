import { useEffect, useRef } from 'react';
import DataTable from '@/components/shared/DataTable';
import { getProducts, useAppDispatch, useAppSelector } from './store';
import type { DataTableResetHandle, OnSortParam } from '@/components/shared/DataTable';

type Product = {
    id: string;
    name: string;
    code: string;
    deleted: boolean;
    quantity: number;
};

const ProductTable = ({ tableData, onTableDataChange }) => {
    const tableRef = useRef<DataTableResetHandle>(null);
    const dispatch = useAppDispatch();
    const { pageIndex, pageSize, sort, query } = tableData;

    const loading = useAppSelector(state => state.salesProductList.data.loading);
    const data = useAppSelector(state => state.salesProductList.data.productList);

    useEffect(() => {
        fetchData();
    }, [pageIndex, pageSize, sort]);

    const fetchData = () => {
        dispatch(getProducts({ pageIndex, pageSize, sort, query }));
    };

    const onPaginationChange = (page: number) => {
        onTableDataChange({ pageIndex: page });
    };

    const onSelectChange = (value: number) => {
        onTableDataChange({ pageSize: Number(value), pageIndex: 1 });
    };

    const onSort = (sort: OnSortParam) => {
        onTableDataChange({ sort });
    };

    return (
        <>
            <DataTable
                ref={tableRef}
                columns={columns} // Đảm bảo columns đã được định nghĩa ở đâu đó
                data={data}
                loading={loading}
                pagingData={{
                    total: tableData.total,
                    pageIndex,
                    pageSize,
                }}
                onPaginationChange={onPaginationChange}
                onSelectChange={onSelectChange}
                onSort={onSort}
            />
        </>
    );
};

export default ProductTable;
