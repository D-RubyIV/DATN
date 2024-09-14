import { useState, useEffect, useMemo } from 'react';
import { ColumnDef, DataTable } from "@/components/shared";
import { Button } from "@/components/ui";
import axios from "axios";
import Tag from '@/components/ui/Tag';

type IVoucher = {
    id: number;
    code: string;
    name: string;
    typeTicket: string;
    quantity: number;
    maxPercent: number;
    minAmount: number;
    startDate: Date;
    endDate: Date;
    status: string;
}

const VoucherTable = () => {
    const [data, setData] = useState<IVoucher[]>([]);
    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState<{
        pageIndex: number;
        pageSize: number;
        sort: {
            order: '' | 'asc' | 'desc';
            key: string | number;
        };
        query: string;
        total: number;
    }>({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        query: '',
        sort: {
            order: '',
            key: '',
        },
    });

    const columns: ColumnDef<IVoucher>[] = useMemo(() => [
        {
            header: 'Code',
            accessorKey: 'code'
        },
        {
            header: 'Name',
            accessorKey: 'name'
        },
        {
            header: 'Type Ticket',
            accessorKey: 'typeTicket'
        },
        {
            header: 'Quantity',
            accessorKey: 'quantity'
        },
        {
            header: 'Max Percent',
            accessorKey: 'maxPercent'
        },
        {
            header: 'Min Amount',
            accessorKey: 'minAmount'
        },
        {
            header: 'Start Date',
            accessorKey: 'startDate'
        },
        {
            header: 'End Date',
            accessorKey: 'endDate'
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: ({ row }) => {
                const status = row.original.status;
                const statusColor = status === 'Not started yet' ? 'text-green-500' :
                                    status === 'In progress' ? 'text-red-500' :
                                    status === 'Expired' ? 'text-yellow-500' : 'text-gray-500';
                return (
                    <Tag className={`${statusColor} font-bold`}>
                        {status}
                    </Tag>
                );
            }
        },
        {
            header: '',
            id: 'action',
            cell: ({ row }: { row: any }) => (
                <Button size="xs" onClick={() => console.log('Action clicked', row)}>
                    Action
                </Button>
            ),
        },
    ], []);

    const handlePaginationChange = (pageIndex: number) => {
        setTableData((prevData) => ({ ...prevData, pageIndex }));
    };

    const handleSelectChange = (pageSize: number) => {
        setTableData((prevData) => ({ ...prevData, pageSize }));
    };

    const handleSort = ({ order, key }: { order: '' | 'asc' | 'desc'; key: string | number }) => {
        setTableData((prevData) => ({
            ...prevData,
            sort: { order, key }
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const params = new URLSearchParams({
                pageIndex: tableData.pageIndex.toString(),
                pageSize: tableData.pageSize.toString(),
                sortKey: tableData.sort.key.toString(),
                sortOrder: tableData.sort.order,
                query: tableData.query,
            });

            try {
                const res = await axios.get(`http://localhost:8080/api/v1/voucher?${params.toString()}`);
                console.log(res);
                if (res.data) {
                    setData(res.data.data);
                    setTableData((prevData) => ({
                        ...prevData,
                        total: res.data.totalPages,
                    }));
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [tableData.pageIndex, tableData.sort, tableData.pageSize, tableData.query]);

    return (
        <DataTable<IVoucher>
            columns={columns}
            data={data}
            loading={loading}
            pagingData={{
                total: tableData.total,
                pageIndex: tableData.pageIndex,
                pageSize: tableData.pageSize,
            }}
            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}
            onSort={handleSort}
        />
    );
}

export default VoucherTable;
