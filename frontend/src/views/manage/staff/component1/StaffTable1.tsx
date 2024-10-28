import { useState, useEffect, useRef, ChangeEvent } from 'react';
import axios from 'axios';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Switcher from '@/components/ui/Switcher';
import { RiMoonClearLine, RiSunLine } from 'react-icons/ri';
import DataTable from '@/components/shared/DataTable';
import debounce from 'lodash/debounce';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { ColumnDef, OnSortParam, CellContext } from '@/components/shared/DataTable';
import { Tooltip } from 'antd';
import { FaPen } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import emailjs from "emailjs-com";
import { IoIosSearch } from "react-icons/io";
import { FaFileDownload } from "react-icons/fa";
import { FaFileUpload } from "react-icons/fa";
import { MdOutlineAddCircle } from "react-icons/md";
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
    status: 'Active' | 'Inactive';
    birthDay: string;
    gender: true;
    createdDate: string;
    role: any;
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
        statusFilter: '',
    });
    const [pagination, setPagination] = useState({
        totalPages: 0,
        currentPage: 0,
        totalItems: 0,
        pageSize: 10,
    });
    const [file, setFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

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

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        debounceFn(e.target.value);
    };

    const handleUpdateClick = (id: number) => {
        navigate(`/manage/staff/update/${id}`);
    };

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

    const columns: ColumnDef<IStaff>[] = [
        {
            header: '#',
            id: 'serialNumber',
            cell: ({ row }: CellContext<IStaff, unknown>) => {
                const { pageIndex, pageSize } = tableData;
                return (pageIndex - 1) * pageSize + row.index + 1;
            },

        },
        { header: 'MaNV', accessorKey: 'code' },
        { header: 'HọTên', accessorKey: 'name' },
        {
            header: 'Giới Tính',
            accessorKey: 'gender',
            size: 100,
            cell: ({ getValue }) => {
                const genderValue = getValue();
                // Hiển thị "Nam" nếu giới tính là true, ngược lại "Nữ"
                return genderValue === true ? 'Nam' : 'Nữ';
            }
        }


        ,


        { header: 'Ngày Sinh', accessorKey: 'birthDay' },

        { header: 'SDT', accessorKey: 'phone' },

        {
            header: 'Địa chỉ',
            accessorKey: 'address',

            cell: ({ row }: CellContext<IStaff, unknown>) => {
                const { address, ward, district, province } = row.original;
                return `${address}, ${ward}, ${district}, ${province}`;
            },
        },
        {
            header: 'Trạng thái',
            accessorKey: 'status',
            cell: ({ row }: CellContext<IStaff, unknown>) => {
                const { status } = row.original;
                const isActive = status === 'Active';

                return (
                    <span
                        className={`flex items-center font-bold ${isActive ? 'text-green-600' : 'text-red-600'}`}
                    >
                        <span
                            className={`inline-block w-2 h-2 rounded-full mr-2 ${isActive ? 'bg-green-600' : 'bg-red-600'}`}
                        ></span>
                        {status === 'Active' ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                );
            },
            size: 100,
        },
        {
            header: 'Hành động',
            id: 'action',
            cell: ({ row }: CellContext<IStaff, unknown>) => {
                const { id, status } = row.original;
                const isActive = status === 'Active';

                return (
                    <div className="flex items-center space-x-1">
                        <Tooltip title="Cập nhật trạng thái">
                            <Switcher
                                color="green-500"
                                checked={isActive}
                                onChange={() => updateStatus(id, !isActive)}
                                unCheckedContent={<RiMoonClearLine />}
                                checkedContent={<RiSunLine />}
                                className="text-sm"
                            />
                        </Tooltip>

                        <Tooltip title="Cập nhật">
                            <Button size="xs" onClick={() => handleUpdateClick(id)}>
                                <FaPen />
                            </Button>
                        </Tooltip>
                    </div>
                );
            },
            size: 100,
        },
    ];

    const updateStatus = async (id: number, newStatus: boolean) => {
        try {
            await axios.patch(`http://localhost:8080/api/v1/staffs/status/${id}`, { status: newStatus ? 'Active' : 'Inactive' });
            toast.success('Cập nhật trạng thái thành công');
            fetchData();
        } catch (error) {
            toast.error('Lỗi cập nhật trạng thái. Vui lòng thử lại.');
            console.error('Error updating status:', error);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const { pageIndex, pageSize, query, sort, statusFilter } = tableData;
            const params: any = {
                page: pageIndex - 1,
                size: pageSize,
                search: query, // Include the search query here
                sort: sort.key,
                order: sort.order,
                keyword: searchTerm,
            };

            if (statusFilter) {
                params.status = statusFilter;
            }

            console.log('Fetching data with params:', params);

            const response = await axios.get('http://localhost:8080/api/v1/staffs/page', { params });

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

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const selectedFile = event.target.files[0];

            if (selectedFile.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                toast.error('Định dạng tệp không hợp lệ. Vui lòng chọn tệp Excel.');
                return;
            }

            setFile(selectedFile);

            const formData = new FormData();
            formData.append('file', selectedFile);

            try {
                await axios.post('http://localhost:8080/api/v1/staffs/upload-excel', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                toast.success('Tải tệp thành công');
                fetchData();

                const reader = new FileReader();
                reader.onload = async (e) => {
                    if (e.target) {
                        const binaryStr = e.target.result as string;
                        const workbook = XLSX.read(binaryStr, { type: 'binary' });
                        const firstSheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[firstSheetName];

                        const jsonData: Array<any> = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                        // Duyệt qua từng hàng bắt đầu từ hàng thứ 2
                        for (let i = 1; i < jsonData.length; i++) { // Bắt đầu từ 1 để bỏ qua tiêu đề
                            const row = jsonData[i];

                            // Kiểm tra nội dung của hàng
                            console.log(`Row ${i}:`, row);

                            const toName = row[1]; // Hàng thứ i, cột thứ 2
                            const toEmail = row[2]; // Hàng thứ i, cột thứ 3
                            const code = row[0]; // Hàng thứ i, cột thứ 1
                            const password = row[13]; // Hàng thứ i, cột thứ 14


                            // Gửi email
                            const serviceId = 'service_t622scu';
                            const templateId = 'template_j3dv5du';
                            const publicKey = 'OHyULXp7jha_7dpil';

                            const templateParams = {
                                from_name: 'Fashion Canth Shop',
                                from_email: 'no-reply@fashioncanthshop.com',
                                to_name: toName,
                                to_email: toEmail,
                                // message: `Tài khoản của bạn:\nMã nhân viên: ${code}\nMật khẩu: ${password}`,
                            };

                            try {
                                const emailResponse = await emailjs.send(serviceId, templateId, templateParams, publicKey);
                                console.log('Email đã được gửi thành công cho', toName);
                                toast.success(`Email thông báo tải tệp đã được gửi thành công cho ${toName}.`);
                            } catch (emailError) {
                                console.error('EmailJS error:', emailError);
                                toast.error(`Không thể gửi email cho ${toName}. Vui lòng kiểm tra thông tin chi tiết của bạn.`);
                            }
                        }
                    }
                };

                reader.readAsBinaryString(selectedFile);

            } catch (error) {
                toast.error('Lỗi tải tệp. Vui lòng thử lại.');
                console.error('Error uploading file:', error);
            }
        }
    };

    const exportToExcel = () => {
        if (data.length === 0) {
            toast.info('Không có dữ liệu để xuất.');
            return;
        }
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Nhân viên');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'nhan_vien.xlsx');
    };

    useEffect(() => {
        fetchData();
    }, [tableData.pageIndex, tableData.sort, tableData.pageSize, tableData.query, tableData.statusFilter]);




    return (
        <>
            <div className="bg-white p-6 shadow-md rounded-lg mb-6 w-full">
                <div className="p-2 mb-4">
                    <p className="text-left text-xl font-bold mx-auto mb-2">QUẢN LÝ NHÂN VIÊN</p>
                    <div
                        className="flex flex-col lg:flex-row justify-between items-center mb-4"
                        style={{
                            marginBottom: '20px',
                            overflow: 'hidden',
                            maxWidth: '100%',
                        }}
                    >
                        <div className="flex space-x-2 flex-wrap items-center mb-2">
                            <div style={{ position: 'relative', width: '385px' }}>
                                <IoIosSearch
                                    style={{
                                        position: 'absolute',
                                        left: '10px',
                                        top: '40%',
                                        transform: 'translateY(-45%)',
                                        fontSize: '18px',
                                        pointerEvents: 'none'
                                    }}
                                />
                                <Input
                                    placeholder="Tìm Kiếm Theo Mã, Họ Và Tên, SDT, CCCD, Email..."
                                    style={{
                                        width: '100%', // Để chiều rộng của Input bằng với chiều rộng của div bao quanh
                                        height: '35px',
                                        marginLeft: '3px',
                                        paddingLeft: '35px',
                                        boxSizing: 'border-box', // Đảm bảo padding không ảnh hưởng đến tổng chiều rộng

                                    }}
                                    className="mb-2"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </div>

                            <div className="relative w-40">
                                <select
                                    className='w-full pl-2 pr-2 border border-gray-300 rounded focus:outline-none ' // Thêm class font-bold
                                    value={tableData.statusFilter || ''}
                                    onChange={handleFilterChange}
                                    style={{ height: '37px', marginBottom: '8px' }} // Đảm bảo dropdown khớp với chiều cao
                                >
                                    <option value="">Tất cả trạng thái</option>
                                    <option value="Active">Hoạt động</option>
                                    <option value="Inactive">Không hoạt động</option>
                                </select>

                            </div>
                        </div>
                        <div className="flex space-x-2 flex-wrap items-center">

                            <Button
                                size="sm"
                                className="lg:w-35 h-10 flex items-center justify-center"
                                onClick={exportToExcel}
                                style={{ height: '37px', marginBottom: '8px' }} // Chiều cao cụ thể
                            >
                                <FaFileDownload className="mr-2" /> {/* Thêm lề bên phải cho khoảng cách */}
                                Xuất Excel
                            </Button>


                            <div className="flex items-center">
                                <input
                                    type="file"
                                    accept=".xlsx, .xls"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="fileInput"
                                    aria-label="Tải lên tệp Excel"
                                />
                                <Button
                                    size="sm"
                                    className="h-10 flex items-center justify-center btn-bold" // Sử dụng lớp tùy chỉnh
                                    onClick={() => document.getElementById('fileInput')?.click()}
                                    style={{ height: '37px', marginBottom: '8px' }} // Chiều cao cụ thể
                                >
                                    <FaFileUpload className="mr-2" /> {/* Thêm lề bên phải cho khoảng cách */}
                                    Tải lên tệp Excel
                                </Button>


                            </div>
                            <Button
                                className="h-10 flex items-center justify-center"
                                variant="solid"
                                color="blue-600"
                                onClick={() => navigate('/manage/staff/add')}
                                style={{ height: '38px', width: '155px', marginBottom: '8px', }} // Giảm chiều rộng xuống còn 150px
                            >
                                <MdOutlineAddCircle className="mr-2" />

                                Thêm Mới
                            </Button>


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
    );
};

export default StaffTableStaff;