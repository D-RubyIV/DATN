import { useState, useEffect, useMemo } from 'react';
import { ColumnDef, DataTable } from "@/components/shared";
import { Button } from "@/components/ui";
import axios from "axios";
import { Checkbox } from "@/components/ui/Checkbox"; // Assuming Checkbox is a custom or UI library component

type Customer = {
    id: number;
    phone: string;
    email: string;
    name: string;
};

const CustomerTable = () => {
    const [data, setData] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]); // State to store selected customers' IDs
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

    const handleSelectCustomer = (id: number, isChecked: boolean) => {
        setSelectedCustomers((prev) =>
            isChecked ? [...prev, id] : prev.filter((customerId) => customerId !== id)
        );
    };

    const columns: ColumnDef<Customer>[] = useMemo(() => [
        {
            header: ({ table }) => (
                <Checkbox
                    checked={selectedCustomers.length === data.length}
                    onChange={(e) => {
                        const isChecked = e.target.checked;
                        if (isChecked) {
                            setSelectedCustomers(data.map((customer) => customer.id)); // Select all
                        } else {
                            setSelectedCustomers([]); // Deselect all
                        }
                    }}
                />
            ),
            id: 'select',
            cell: ({ row }) => (
                <Checkbox
                    checked={selectedCustomers.includes(row.original.id)}
                    onChange={(e) => handleSelectCustomer(row.original.id, e.target.checked)}
                />
            ),
        },
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
        {
            header: '',
            id: 'action',
            cell: ({ row }: { row: any }) => (
                <Button size="xs" onClick={() => console.log('Action clicked', row)}>
                    Action
                </Button>
            ),
        },
    ], [selectedCustomers, data]);

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
                const res = await axios.get(`http://localhost:8080/api/v1/customers?${params.toString()}`);
                console.log(res);
                if (res.data) {
                    setData(res.data.data);
                    setTableData((prevData) => ({
                        ...prevData,
                        total: res.data.totalPages,
                    }));
                }
            } catch (error) {
                console.error("Error fetching customer data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [tableData.pageIndex, tableData.sort, tableData.pageSize, tableData.query]);

    return (
        <>
            <div className="mb-4">
                <Button onClick={() => console.log('Selected Customers:', selectedCustomers)}>
                    Get Selected Customers
                </Button>
            </div>
            <DataTable<Customer>
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
        </>
    );
};

export default CustomerTable;
