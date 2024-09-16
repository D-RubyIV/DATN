import React, { useState, useEffect, useMemo, useCallback } from 'react';
import DataTable from '@/components/shared/DataTable';
import type { ColumnDef, Row } from '@/components/shared/DataTable';

type Customer = {
    id: number;
    name: string;
    phone: string;
    email: string;
};

type CustomersTableProps = {
    onSelectedCustomersChange: (selectedCustomers: number[]) => void;
};

const CustomersTable: React.FC<CustomersTableProps> = ({ onSelectedCustomersChange }) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tableData, setTableData] = useState({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
    });

    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8080/api/v1/customer/get-all');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Fetched data:', data);
            if (Array.isArray(data)) {
                setCustomers(data);
                setTableData(prevData => ({ ...prevData, total: data.length }));
            } else if (data && Array.isArray(data.customers)) {
                setCustomers(data.customers);
                setTableData(prevData => ({ ...prevData, total: data.total || data.customers.length }));
            } else {
                throw new Error('Data is not in the expected format');
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
            setError('Failed to fetch customers. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers, tableData.pageIndex, tableData.pageSize]);

    useEffect(() => {
        onSelectedCustomersChange(selectedCustomers);
    }, [selectedCustomers, onSelectedCustomersChange]);

    const columns: ColumnDef<Customer>[] = useMemo(
        () => [
            {
                header: 'ID',
                accessorKey: 'id',
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
    );

    const onPaginationChange = useCallback((page: number) => {
        setTableData(prevData => ({ ...prevData, pageIndex: page }));
    }, []);

    const onSelectChange = useCallback((value: number) => {
        setTableData(prevData => ({ ...prevData, pageSize: Number(value), pageIndex: 1 }));
    }, []);

    const onCheckBoxChange = useCallback((checked: boolean, row: Customer) => {
        setSelectedCustomers(prev => 
            checked
                ? [...prev, row.id]
                : prev.filter(id => id !== row.id)
        );
    }, []);

    const onIndeterminateCheckBoxChange = useCallback(
        (checked: boolean, rows: Row<Customer>[]) => {
            const affectedIds = rows.map(row => row.original.id);
            setSelectedCustomers(prev => 
                checked
                    ? Array.from(new Set([...prev, ...affectedIds]))
                    : prev.filter(id => !affectedIds.includes(id))
            );
        },
        []
    );

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <>
            {customers.length > 0 ? (
                <DataTable
                    selectable
                    columns={columns}
                    data={customers}
                    loading={loading}
                    pagingData={{
                        total: tableData.total,
                        pageIndex: tableData.pageIndex,
                        pageSize: tableData.pageSize,
                    }}
                    onPaginationChange={onPaginationChange}
                    onSelectChange={onSelectChange}
                    onCheckBoxChange={onCheckBoxChange}
                    onIndeterminateCheckBoxChange={onIndeterminateCheckBoxChange}
                />
            ) : (
                <div>No customers found</div>
            )}
        </>
    );
};

export default CustomersTable;