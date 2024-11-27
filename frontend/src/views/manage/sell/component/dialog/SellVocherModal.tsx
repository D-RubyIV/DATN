import { useState, useEffect, useRef, ChangeEvent, SetStateAction, Dispatch } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import DataTable from '@/components/shared/DataTable'
import debounce from 'lodash/debounce'
import type { ColumnDef, OnSortParam } from '@/components/shared/DataTable'
import CloseButton from '@/components/ui/CloseButton'


import instance from '@/axios/CustomAxios'
import { OrderResponseDTO } from '@/@types/order'
import { useLoadingContext } from '@/context/LoadingContext'
import axios from 'axios'
import { useToastContext } from '@/context/ToastContext'

type VoucherDTO = {
    id: number;
    name: string;
    code: string;
    startDate: string; // hoặc Date nếu bạn muốn xử lý dưới dạng đối tượng Date
    endDate: string; // hoặc Date nếu bạn muốn xử lý dưới dạng đối tượng Date
    status: string,
    quantity: number;
    maxPercent: number;
    minAmount: number;
    typeTicket: string;
    customerId: number | null; // Có thể là number hoặc null
    customerName: string | null; // Có thể là string hoặc null
    customerEmail: string | null; // Có thể là string hoặc null
};

const SellVoucherModal = ({ setIsOpenVoucherModal, selectOrder, fetchData }: {
    setIsOpenVoucherModal: Dispatch<SetStateAction<boolean>>,
    selectOrder: OrderResponseDTO,
    fetchData: () => Promise<void>
}) => {
    const inputRef = useRef(null)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const { sleep } = useLoadingContext()
    const { openNotification } = useToastContext()

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
        pageSize: 5,
        query: '',
        sort: {
            order: '',
            key: ''
        }
    })
    const handlePaginationChange = (pageIndex: number) => {
        setTableData((prevData) => ({ ...prevData, ...{ pageIndex } }))
        setQueryParam((pre) => ({ ...pre, page: pageIndex }))
    }
    const handleSelectChange = (pageSize: number) => {
        setTableData((prevData) => ({
            ...prevData,
            pageSize: pageSize, // Cập nhật pageSize mới
            pageIndex: 1 // Đặt pageIndex về 1
        }))
        setQueryParam((pre) => ({ ...pre, size: pageSize }))
    }
    const handleSort = ({ order, key }: OnSortParam) => {
        console.log({ order, key })
        setTableData((prevData) => ({
            ...prevData,
            sort: {
                order,
                key: (key as string).replace('___', '.')
            }
        }))
    }
    const columns: ColumnDef<VoucherDTO>[] = [
        {
            header: '#',
            cell: (props) => (
                props.row.index + 1
            )
        },
        {
            header: 'Tên',
            accessorKey: 'name'
        },
        {
            header: 'Ngày bắt đầu',
            accessorKey: 'startDate'
        },
        {
            header: 'Ngày kết thúc',
            accessorKey: 'endDate',

        },
        {
            header: 'Số lượng',
            accessorKey: 'quantity'
        },
        {
            header: 'Phần trăm giảm tối đa',
            accessorKey: 'maxPercent'
        },
        {
            accessorKey: 'minAmount',
            header: 'Hóa đơn tối thiểu',
            cell: (props => (
                <p>
                    {props.row.original.minAmount.toLocaleString("vi") + "đ"}
                </p>
            ))
        },
        {
            header: 'Hành động',
            id: 'action',
            cell: (props) => (
                <Button
                    size="xs"
                    onClick={() => {
                        console.log('Selected id voucher: ', props.row.original.id)
                        handleUseVoucher(props.row.original.id)

                    }}
                >
                    Chọn
                </Button>
            )
        }
    ]
    const [queryParam, setQueryParam] = useState<{
        size: number | undefined,
        page: number | undefined,
        query: string | undefined

    }>({
        size: 10,
        page: undefined,
        query: undefined
    })

    // FUCTION

    const handleUseVoucher = async (idVoucher: number) => {
        const data = {
            idOrder: selectOrder.id,
            idVoucher: idVoucher
        }
        try {
            const response = await instance.post(`/orders/use-voucher`, data)
            console.log(response)
            await handleDelayScreen()
            await fetchData()
            if(response.status === 200){
                openNotification("Áp mã giảm giá thành công")
            }
            setIsOpenVoucherModal(false)
            document.body.style.overflow = 'auto'
        } catch (error) {
            if (axios.isAxiosError(error) && error?.response?.status === 400) {
                openNotification(error.response.data?.error)
            }
        }
    }


    const fetchDataProduct = async () => {
        setLoading(true)
        const response = await instance.get('/voucher/page', {
            params: queryParam
        })
        setData(response.data.content)
        setLoading(false)
        setTableData((prevData) => ({
            ...prevData,
            ...{ total: response.data.totalElements }
        }))
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        debounceFn(e.target.value)
    }

    const debounceFn = debounce(handleDebounceFn, 500)

    function handleDebounceFn(val: string) {
        if ((val.length > 1 || val.length === 0)) {
            setTableData((prevData) => ({
                ...prevData,
                ...{ query: val, pageIndex: 1 }
            }))
            setQueryParam((pre) => ({ ...pre, query: val }))
        }
    }


    const handleDelayScreen = async () => {
        setLoading(true)
        await sleep(500)
        setLoading(false)
    }

    // HOOK
    useEffect(() => {
        fetchDataProduct()
    }, [
        tableData.pageIndex,
        tableData.sort,
        tableData.pageSize,
        tableData.query,
        queryParam
    ])
    return (
        <div className="fixed top-0 left-0 bg-gray-300 bg-opacity-50 w-screen h-screen z-40">
            <div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/5 h-auto bg-gray-100 z-20 shadow-md rounded-md">
                <div className="p-5 bg-white !h-4/5 rounded-md">
                    <div className="flex justify-between pb-3">
                        <div>
                            <p className="font-semibold text-xl">Danh sách khuyến mãi</p>
                        </div>
                        <div>
                            <CloseButton
                                className="text-2xl py-1"
                                onClick={() => {
                                    setIsOpenVoucherModal(false)
                                    document.body.style.overflow = 'auto'
                                }}
                            ></CloseButton>
                        </div>
                    </div>
                    <div>
                        <div>
                            <Input
                                ref={inputRef}
                                placeholder="Search..."
                                size="sm"
                                className="lg:w-full"
                                onChange={(el) => handleChange(el)}
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
    )
}

export default SellVoucherModal