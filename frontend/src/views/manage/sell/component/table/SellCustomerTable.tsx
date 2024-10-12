import { useState, useEffect, useRef, ChangeEvent, SetStateAction, Dispatch } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import DataTable from '@/components/shared/DataTable'
import debounce from 'lodash/debounce'
import axios from 'axios'
import type { ColumnDef, OnSortParam, CellContext } from '@/components/shared/DataTable'
import { DatePicker, Select } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import { Link } from 'react-router-dom'
import { HiArrowLeft, HiArrowNarrowLeft, HiPlusCircle, HiRefresh, HiReply } from 'react-icons/hi'
import DatePickerRange from '@/components/ui/DatePicker/DatePickerRange'
import { format } from 'date-fns';
import CloseButton from '@/components/ui/CloseButton'


import Radio from '@/components/ui/Radio'
import Drawer from '@/components/ui/Drawer'
import type { MouseEvent } from 'react'
import { useToastContext } from '@/context/ToastContext'
import instance from '@/axios/CustomAxios'
import { SellCustomerOverview } from '../..'

type Direction = 'top' | 'right' | 'bottom' | 'left'

const SellCustomerTable = ({ setIsOpenModal }: { setIsOpenModal: Dispatch<SetStateAction<boolean>> }) => {
    const inputRef = useRef(null)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [seletedProductDetail, setSeletedProductDetail] = useState<SellCustomerOverview>()

    const [tableData, setTableData] = useState<{
        pageIndex: number
        pageSize: number
        sort: {
            order: '' | 'asc' | 'desc'
            key: string | number;
        };
        query: string
        total: number
    }>({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        query: '',
        sort: {
            order: '',
            key: '',
        },
    })
    const handlePaginationChange = (pageIndex: number) => {
        setTableData((prevData) => ({ ...prevData, ...{ pageIndex } }))
    }
    const handleSelectChange = (pageSize: number) => {
        setTableData((prevData) => ({
            ...prevData,
            pageSize: pageSize, // Cập nhật pageSize mới
            pageIndex: 1 // Đặt pageIndex về 1
        }));
    }
    const handleSort = ({ order, key }: OnSortParam) => {
        console.log({ order, key })
        setTableData((prevData) => ({
            ...prevData,
            sort: {
                order,
                key: (key as string).replace("___", "."),
            },
        }));
    }
    const columns: ColumnDef<SellCustomerOverview>[] = [
        {
            header: '#',
            cell: (props) => (
                props.row.index + 1
            ),
        },
        {
            header: 'Tên',
            accessorKey: 'name',
        },
        {
            header: 'Số điện thoại',
            accessorKey: 'phone',
        },
        {
            header: 'Email',
            accessorKey: 'email',
        },
        {
            header: 'Hành động',
            id: 'action',
            cell: (props) => (
                <Button size="xs" >
                    Chọn
                </Button>

            ),
        },
    ]
    const [queryParam, setQueryParam] = useState<{
        size: number | undefined,

    }>({
        size: undefined
    })

    // FUCTION
    const { openNotification } = useToastContext();

    const fetchDataProduct = async () => {
        setLoading(true)
        const response = await instance.post('/v2/product', tableData,
            {
                params: queryParam
            }
        )
        setData(response.data.content)
        setLoading(false)
        setTableData((prevData) => ({
            ...prevData,
            ...{ total: response.data.totalElements },
        }))
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        debounceFn(e.target.value)
    }

    const debounceFn = debounce(handleDebounceFn, 500)
    function handleDebounceFn(val: string) {
        console.log(val)
        if (typeof val === 'string' && (val.length > 1 || val.length === 0)) {
            setTableData((prevData) => ({
                ...prevData,
                ...{ query: val, pageIndex: 1 },
            }))
        }
    }

    const sleep = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    const handleDelayScreen = async () => {
        setLoading(true);
        await sleep(500)
        setLoading(false);
    }

    // HOOK
    useEffect(() => {
        fetchDataProduct();
    }, [
        tableData.pageIndex,
        tableData.sort,
        tableData.pageSize,
        tableData.query,
        queryParam
    ])
    return (
        <div className='fixed top-0 left-0 bg-gray-300 bg-opacity-50 w-screen h-screen z-50'>
            <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 bg-gray-100 z-20 shadow-md rounded-md'>
                <div className='p-5 bg-white !h-4/5 rounded-md'>
                    <div className='flex justify-between pb-3'>
                        <div>
                            <p className='font-semibold text-xl'>Danh sách khách hàng</p>
                        </div>
                        <div>
                            <CloseButton onClick={() => setIsOpenModal(false)} className='text-2xl py-1'></CloseButton>
                        </div>
                    </div>
                    <div>
                        <div>
                            <Input
                                ref={inputRef}
                                placeholder="Search..."
                                size="sm"
                                className="lg:w-full"
                                onChange={(el) => handleChange}
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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SellCustomerTable;