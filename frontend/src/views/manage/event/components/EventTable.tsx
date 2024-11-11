import { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable, { CellContext } from '@/components/shared/DataTable';
import { Button, Input } from '@/components/ui';
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { HiPencil, HiPlusCircle } from 'react-icons/hi';
import { FaFilter } from 'react-icons/fa';
import { MdDelete } from "react-icons/md";
import Dialog from '@/components/ui/Dialog'
import { toast } from "react-toastify";

type EventListDTO = {
    id: number;
    discountCode: string;
    name: string;
    discountPercent: string;
    startDate: string;
    endDate: string;
    quantityDiscount: string;
    status: string;
}

const EventTable = () => {
    const navigate = useNavigate();

    const [data, setData] = useState<EventListDTO[]>([])
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>();
    const [dialogIsOpen, setIsOpen] = useState(false)
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

    // api GetAll, Search, Filter Status
    const fetchEvent = async (
        page: number,
        size: number,
        query?: string,
        statusFilter?: string
    ) => {
        setLoading(true);
        try {
            let url = `http://localhost:8080/api/v1/event/all`;
            const params: Record<string, string | number | undefined> = { page, size };

            // thay doi endpoint neu co search hoac status filter
            if (query) {
                url = `http://localhost:8080/api/v1/event/search`;
                params.query = query;
            } else if (statusFilter) {
                url = `http://localhost:8080/api/v1/event/filter`;
                params.status = statusFilter; // phai khop voi params cua api (prams.status)
            }

            const response = await axios.get(url, { params });
            setData(response.data.content);  // cập nhật dữ liệu sự kiện
            setTotal(response.data.totalElements); // tổng số phần tử để phân trang
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    }

    // useEffect duy nhất để gọi fetchEvent khi pageIndex, pageSize, query hoặc statusFilter thay đổi
    useEffect(() => {
        fetchEvent(pageIndex, pageSize, query, statusFilter);
    }, [pageIndex, pageSize, query, statusFilter]);

    // ham xu ly filter Status
    const handleStatus = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(event.target.value)
    }

    // ham xu ly search
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
    }
    // Hàm chuyển sang trang add
    const handleAddClick = () => {
        navigate('/admin/manage/event/add');
    };

    // ham chuyen sang trang update
    const handleUpdateClick = (eventId: number) => {
        console.log('Id là: ', eventId);
        navigate(`/admin/manage/event/update/${eventId}`);
    }

    // Hàm xử lý phân trang
    const handlePaginationChange = (newPageIndex: number) => {
        setPageIndex(newPageIndex);
    };

    // Hàm xử lý thay đổi kích thước trang
    const handleSelectChange = (newPageSize: number) => {
        setPageSize(newPageSize);
    };

    // mở dialog xác nhận xóa
    const openDialog = (eventId: number) => {
        setSelectedEventId(eventId);
        setIsOpen(true);
    }

    // Đóng dialog mà không xóa
    const onDialogClose = () => {
        setIsOpen(false);
        setSelectedEventId(null);
    };

    // Xác nhận và xóa sự kiện
    const onDialogOk = async () => {
        console.log('Runn....')
        if (selectedEventId !== null) {
            try {
                await axios.delete(`http://localhost:8080/api/v1/event/delete/${selectedEventId}`);
                toast.success('Xóa thành công');
                setData(data.filter(data => data.id !== selectedEventId))
            } catch (error) {
                toast.error('Xóa thất bại');
            }
        }
    }

    const columns = [
        {
            header: 'STT',
            id: 'serialNumber',
            cell: ({ row }: CellContext<EventListDTO, unknown>) => {
                const serialNumber = (pageIndex - 1) * pageSize + row.index + 1;
                return serialNumber;
            },
        },
        {
            header: 'Mã',
            accessorKey: 'discountCode'
        },
        {
            header: 'Tên',
            accessorKey: 'name'
        },
        {
            header: 'Giá trị giảm(%)',
            accessorKey: 'discountPercent'
        },
        {
            header: 'Ngày bắt đầu',
            accessorKey: 'startDate',
            cell: ({ row }: CellContext<EventListDTO, unknown>) => {
                return format(new Date(row.original.startDate), 'dd/MM/yyyy HH:mm');
            },
        },
        {
            header: 'Ngày kết thúc',
            accessorKey: 'endDate',
            cell: ({ row }: CellContext<EventListDTO, unknown>) => {
                return format(new Date(row.original.endDate), 'dd/MM/yyyy HH:mm');
            },
        },
        {
            header: 'Số lượng',
            accessorKey: 'quantityDiscount'
        },
        {
            header: 'Trạng thái',
            accessorKey: 'status',
            cell: ({ row }: CellContext<EventListDTO, unknown>) => {
                const { status } = row.original;
                let displayStatus = '';
                let statusColorClass = '';

                switch (status) {
                    case 'Đang diễn ra':
                        displayStatus = 'Đang diễn ra';
                        statusColorClass = 'text-green-600';
                        break;
                    case 'Sắp diễn ra':
                        displayStatus = 'Sắp diễn ra';
                        statusColorClass = 'text-yellow-600';
                        break;
                    case 'Đã kết thúc':
                        displayStatus = 'Đã kết thúc';
                        statusColorClass = 'text-red-600';
                        break;
                    default:
                        displayStatus = 'Không hoạt động';
                        statusColorClass = 'text-gray-600';
                }

                return (
                    <span className={`flex items-center font-bold ${statusColorClass}`}>
                        <span
                            className={`inline-block w-2 h-2 rounded-full mr-2 ${statusColorClass.replace('text-', 'bg-')}`}
                        ></span>
                        {displayStatus}
                    </span>
                );
            },
            size: 100,
        },
        {
            header: 'Hành động',
            cell: ({ row }: CellContext<EventListDTO, unknown>) => {
                const event = row.original;
                return (
                    <div className='flex w-full justify-start gap-2 items-center'>
                        <HiPencil
                            size={20}
                            className='mr-3'
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleUpdateClick(event.id)}
                        />
                        <MdDelete
                            size={20}
                            style={{ cursor: 'pointer' }}
                            onClick={() => openDialog(event.id)}
                        />
                    </div>
                )
            }
        }
    ];

    return (
        <div className="bg-white rounded-lg mb-6 w-full">
            <h1 className="font-semibold text-xl mb-4 uppercase">Quản lý đợt giảm giá</h1>

            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="flex font-semibold mb-4">Bộ lọc <FaFilter className='mt-2' size={26} /></h2>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        {/* Input tìm kiếm */}
                        <div className="relative w-80">
                            <Input
                                placeholder="Tìm kiếm theo mã, tên..."
                                size="sm"
                                className="w-full pl-10 pr-2 py-2 border border-gray-300 rounded focus:outline-none bg-white h-10"

                                onChange={handleSearch}
                            />
                            <IoIosSearch
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-2xl"
                            />
                        </div>

                        {/* Trạng thái */}
                        <div className="w-40">
                            <select
                                className="w-full px-2 py-2 border border-gray-300 rounded focus:outline-none bg-white h-10"
                                value={statusFilter || ''}
                                onChange={handleStatus}
                            >
                                <option value="">Tất cả</option>
                                <option value="Đang diễn ra">Đang diễn ra</option>
                                <option value="Sắp diễn ra">Sắp diễn ra</option>
                                <option value="Đã kết thúc">Đã kết thúc</option>
                            </select>
                        </div>
                    </div>

                    {/* Nút thêm mới */}
                    <Button
                        variant="solid"
                        style={{ backgroundColor: 'rgb(79, 70, 229)', height: '40px' }}
                        className="flex items-center justify-center gap-2 button-bg-important h-10"
                        icon={<HiPlusCircle />}
                        onClick={handleAddClick}
                    >
                        Thêm mới
                    </Button>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="font-semibold mb-4">Danh sách đợt giảm giá</h3>
                <DataTable
                    columns={columns}
                    data={data}
                    loading={loading}
                    pagingData={{
                        pageIndex: pageIndex,
                        pageSize: pageSize,
                        total: total,
                    }}
                    onPaginationChange={handlePaginationChange}
                    onSelectChange={handleSelectChange}
                />
            </div>
            {/* Dialog xác nhận xóa */}
            <Dialog isOpen={dialogIsOpen} closable={false} onClose={onDialogClose}>
                <h5 className="mb-4">Xác nhận xóa sự kiện</h5>
                <p>Bạn có chắc chắn muốn xóa sự kiện này không?</p>
                <div className="text-right mt-6">
                    <Button className="ltr:mr-2 rtl:ml-2" variant="plain" onClick={onDialogClose}>
                        Hủy
                    </Button>
                    <Button variant="solid" style={{ backgroundColor: 'rgb(79, 70, 229)', height: '40px' }} type='submit' onClick={onDialogOk}>
                        Xác nhận
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}
export default EventTable;
