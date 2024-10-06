import { useState, useEffect, useMemo, ChangeEvent } from 'react'
import { CellContext, ColumnDef, DataTable, OnSortParam } from '@/components/shared'
import { Button, Input, Switcher } from '@/components/ui'
import axios from 'axios'
import { toast } from 'react-toastify'
import { debounce } from 'lodash'
import { IoIosSearch } from 'react-icons/io'
import VoucherTableTool from './VoucherTableTool'
import { Tooltip } from 'antd'
import { FaPen } from 'react-icons/fa'
import { RiMoonClearLine, RiSunLine } from 'react-icons/ri';

type IVoucher = {
    id: number
    code: string
    name: string
    typeTicket: string
    quantity: number
    maxPercent: number
    minAmount: number
    startDate: Date
    endDate: Date
    status: string
}

const VoucherTable = () => {
    const [data, setData] = useState<IVoucher[]>([])
    const [loading, setLoading] = useState(false)
    const [searchKeyword, setSearchKeyword] = useState('')
    const [searchTerm, setSearchTerm] = useState('');
    const [tableData, setTableData] = useState({
        pageIndex: 1,
        pageSize: 10,
        sort: {
            order: '' as '' | 'asc' | 'desc',
            key: '' as string | number,
        },
        query: '',
        total: 0,
        statusFilter: '',
    });
    const [pagination, setPagination] = useState({
        totalPages: 0,
        currentPage: 0,
        totalItems: 0,
        pageSize: 10,
    });

    useEffect(() => {
        fetchData();
    }, [pagination.currentPage, searchTerm]);


    // Debounce function for search input
    const debounceFn = debounce((val: string) => {
        setTableData(prevData => ({
            ...prevData,
            query: val,
            pageIndex: 1,
        }));
    }, 500);

    const handlePaginationChange = (pageIndex: number) => {
        setTableData(prevData => ({ ...prevData, pageIndex }));
    };

    const handleSelectChange = (pageSize: number) => {
        setTableData(prevData => ({ ...prevData, pageSize, pageIndex: 1 }));
    };

    const handleSort = ({ order, key }: OnSortParam) => {
        setTableData(prevData => ({
            ...prevData,
            sort: { order, key },
            pageIndex: 1,
        }));
    };

    const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setTableData(prevData => ({
            ...prevData,
            statusFilter: e.target.value,
            pageIndex: 1,
        }));
    };

    const columns: ColumnDef<IVoucher>[] = useMemo(
        () => [
            {
                header: 'Mã',
                accessorKey: 'code',
            },
            {
                header: 'Tên ',
                accessorKey: 'name',
            },
            {
                header: 'Loại Phiếu',
                accessorKey: 'typeTicket',
            },
            {
                header: 'Số Lượng',
                accessorKey: 'quantity',
            },
            {
                header: 'Phần Trăm Tối Đa',
                accessorKey: 'maxPercent',
            },
            {
                header: 'Số Lượng Tối Thiếu',
                accessorKey: 'minAmount',
            },
            {
                header: 'Ngày Bắt Đầu',
                accessorKey: 'startDate',
            },
            {
                header: 'Ngày Kết Thúc',
                accessorKey: 'endDate',
            },
            {
                header: 'Trạng Thái',
                accessorKey: 'status',
                cell: ({ row }) => {
                    const status = row.original.status;
                    const isGreen = status === 'Not started yet';
                    const isRed = status === 'In progress';
                    const isYellow = status === 'Expired';
            
                    const statusColor = isGreen
                        ? 'bg-green-600'
                        : isRed
                            ? 'bg-red-600'
                            : isYellow
                                ? 'bg-yellow-600'
                                : 'bg-gray-500';
            
                    const textColor = isGreen || isYellow ? 'text-green-600' : 'text-red-600';
            
                    return (
                        <span className={`flex items-center font-bold ${textColor}`}>
                            <span
                                className={`inline-block w-2 h-2 rounded-full mr-2 ${statusColor}`}
                            ></span>
                            {status === 'Not started yet'
                                ? 'Chưa bắt đầu'
                                : status === 'In progress'
                                    ? 'Đang diễn ra'
                                    : status === 'Expired'
                                        ? 'Đã kết thúc'
                                        : 'Không xác định'}
                        </span>
                    );
                },
                size: 100,
            },
            {
                header: 'Hành động',
                id: 'action',
                cell: ({ row }: CellContext<IVoucher, unknown>) => {
                    const { id, status } = row.original;
                    const isActive = status === 'Active';
    
                    return (
                        <div className="flex items-center space-x-1">
                            <Tooltip title="Cập nhật trạng thái">
                                <Switcher
                                    color="green-500"
                                    checked={isActive}
                                    onChange={() => softDelete(id)}
                                    unCheckedContent={<RiMoonClearLine />}
                                    checkedContent={<RiSunLine />}
                                    className="text-sm"
                                />
                            </Tooltip>
    
                            <Tooltip title="Cập nhật">
                                <Button size="xs">
                                    <FaPen />
                                </Button>
                            </Tooltip>
                        </div>
                    );
                },
                size: 100,
            },
        ],
        [],
    )

    const softDelete = async (id: number) => {
        try {
            await axios.patch(`http://localhost:8080/api/v1/voucher/delete/${id}`);
            toast.success('Xoá thành công');
            fetchData();
        } catch (error) {
            toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
            console.error('Error updating status:', error);
        }
    };

    useEffect(() => {
        setTableData((prevData) => ({
            ...prevData,
            query: searchKeyword,
            pageIndex: 1, // Reset lại page khi tìm kiếm mới
        }))
    }, [searchKeyword])


    const fetchData = async () => {
        setLoading(true);
        try {
            const { pageIndex, pageSize, query, sort, statusFilter } = tableData;
            const params: any = {
                page: pageIndex - 1,
                size: pageSize,
                search: query,
                sort: sort.key,
                order: sort.order,
                keyword: searchTerm,
            };

            if (statusFilter) {
                params.status = statusFilter;
            }

            console.log('Fetching data with params:', params);

            const response = await axios.get('http://localhost:8080/api/v1/voucher/page', { params });

            if (response.data) {
                setData(response.data.content);
                setTableData(prevData => ({
                    ...prevData,
                    total: response.data.totalElements,
                }));
            } else {
                setData([]);
            }
        } catch (error) {
            toast.error('Lỗi tải dữ liệu. Vui lòng thử lại.');
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        fetchData();
    }, [tableData.pageIndex, tableData.sort, tableData.pageSize, tableData.query, tableData.statusFilter]);



    return (
        <>
        <div className="bg-white p-6 shadow-md rounded-lg mb-6 w-full">
            <div className="p-2 mb-4">
                <p className="text-xl font-bold mb-2 mx-auto mb-10">Quản Lý Phiếu Giảm Giá</p>
                <div
                    className="flex flex-col lg:flex-row justify-between items-center mb-4"
                    style={{
                        marginBottom: '20px',
                        overflow: 'hidden',
                        maxWidth: '100%',
                    }}
                >
                    <div className="flex items-center w-full justify-between flex-wrap">
                        {/* Bên trái: Input tìm kiếm */}
                        <div className="flex items-center space-x-2">
                            <div style={{ position: 'relative', width: '300px' }}>
                                <IoIosSearch
                                    style={{
                                        position: 'absolute',
                                        left: '5px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        fontSize: '20px',
                                        pointerEvents: 'none'
                                    }}
                                />
                                <Input
                                    placeholder="Tìm Kiếm..."
                                    style={{
                                        width: '100%',
                                        height: '37px',
                                        paddingLeft: '30px',
                                        boxSizing: 'border-box',
                                    }}
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </div>

                            {/* Bộ lọc trạng thái */}
                            <select
                                className='w-full pl-2 pr-2 border border-gray-300 rounded focus:outline-none'
                                value={tableData.statusFilter || ''}
                                onChange={handleFilterChange}
                                style={{ height: '37px', marginBottom: '8px' }}
                            >
                                <option value="">Tất cả trạng thái</option>
                                <option value="In progress">Đang diễn ra</option>
                                <option value="Expired">Đã kết thúc</option>
                                <option value="Not started yet">Chưa bắt đầu</option>
                            </select>
                        </div>

                        {/* Bên phải: Nút và công cụ */}
                        <div className="flex items-center space-x-2 justify-end">
                            <VoucherTableTool />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <p>Đang tải...</p>
                    ) : data.length === 0 ? (
                        <p>Không có dữ liệu nhân viên.</p>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={data}
                            loading={loading}
                            pagingData={tableData}
                            onPaginationChange={handlePaginationChange}
                            onSelectChange={handleSelectChange}
                            onSort={handleSort}
                        />
                    )}
                </div>
            </div>
        </div>
        </>
    )
}

export default VoucherTable
