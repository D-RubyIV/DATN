import { useState, useEffect, useRef, ChangeEvent } from 'react';
import axios from 'axios';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input'; // Added for search input
import IconButton from '@mui/material/IconButton';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import DataTable from '@/components/shared/DataTable';
import debounce from 'lodash/debounce';
import type { ColumnDef, OnSortParam, CellContext } from '@/components/shared/DataTable';

type IStaff = {
    id: number;
    code: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    ward: string;
    district: string;
    province: string;
    status: string;
    birthDay: string;
    gender: boolean;
    role: any; // Adjust type if necessary
};

const StaffTableStaff = () => {
    const [data, setData] = useState<IStaff[]>([]);
    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState({
        pageIndex: 1,
        pageSize: 10,
        sort: {
            order: '' as '' | 'asc' | 'desc',
            key: '' as string | number,
        },
        query: '',
        total: 0,
    });

    const inputRef = useRef<HTMLInputElement>(null);

    const debounceFn = debounce((val: string) => {
        if (typeof val === 'string' && (val.length > 1 || val.length === 0)) {
            setTableData(prevData => ({
                ...prevData,
                query: val,
                pageIndex: 1,
            }));
        }
    }, 500);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        debounceFn(e.target.value);
    };

    const handleDetailsClick = (id: number) => {
        console.log('Details clicked for staff id:', id);
    };

    const handlePaginationChange = (pageIndex: number) => {
        setTableData(prevData => ({ ...prevData, pageIndex }));
    };

    const handleSelectChange = (pageSize: number) => {
        setTableData(prevData => ({ ...prevData, pageSize }));
    };

    const handleSort = ({ order, key }: OnSortParam) => {
        setTableData(prevData => ({
            ...prevData,
            sort: { order, key },
        }));
    };

    const columns: ColumnDef<IStaff>[] = [
        { header: 'Code', accessorKey: 'code' },
        { header: 'Name', accessorKey: 'name' },
        { header: 'BirthDay', accessorKey: 'birthDay' },
        { header: 'Phone', accessorKey: 'phone' },
        {
            header: 'Address',
            cell: ({ row }: CellContext<IStaff, unknown>) => {
                const { address, ward, district, province } = row.original;
                return `${address}, ${ward}, ${district}, ${province}`;
            },
        },
        {
            header: 'Status',
            cell: ({ row }: CellContext<IStaff, unknown>) => {
                const status = row.original.status;
                return status === 'active' ? 'Active' : 'Inactive';
            },
        },
        {
            header: 'Action',
            id: 'action',
            cell: ({ row }: CellContext<IStaff, unknown>) => {
                const { id, status } = row.original;
                return (
                    <>
                        <IconButton
                            // onClick={() => updateStatus(id, status === 'active' ? 'inactive' : 'active')}
                            color="secondary"
                        >
                            {status === 'inactive' ? <ToggleOffIcon /> : <ToggleOnIcon />}
                        </IconButton>
                        <Button size="xs" onClick={() => handleDetailsClick(id)}>
                            Details
                        </Button>
                    </>
                );
            },
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8080/api/v1/staffs/page');
                if (response.data) {
                    setData(response.data.content);
                    setTableData(prevData => ({
                        ...prevData,
                        total: response.data.total,
                    }));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [tableData.pageIndex, tableData.sort, tableData.pageSize, tableData.query]);

    return (
        <>
            <div className="flex justify-end mb-4">
                <Input
                    ref={inputRef}
                    placeholder="Search..."
                    size="sm"
                    className="lg:w-52"
                    onChange={handleChange}
                />
            </div>
            <DataTable
                columns={columns}
                data={data}
                loading={loading}
                pagingData={tableData}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
            />
        </>
    );
};

export default StaffTableStaff;
