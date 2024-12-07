import React, { useState, useEffect, useRef, ChangeEvent, SetStateAction } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import DataTable from '@/components/shared/DataTable'
import debounce from 'lodash/debounce'
import CloseButton from '@/components/ui/CloseButton'
import instance from '@/axios/CustomAxios'
import { useLoadingContext } from '@/context/LoadingContext'
import axios from 'axios'
import { useToastContext } from '@/context/ToastContext'
import { Pagination, Select } from '@/components/ui'
import { useSaleContext } from '@/views/sale/SaleContext'
import { b } from 'vite/dist/node/types.d-aGj9QkWt'
import { CartResponseDTO } from '@/views/sale/index'
import { HiOutlineTicket } from 'react-icons/hi'
import useAuth from '@/utils/hooks/useAuth'
import { useAuthContext } from '@/views/client/auth/AuthContext'

type VoucherDTO = {
    id: number;
    name: string;
    code: string;
    startDate: string;
    endDate: string;
    status: string;
    quantity: number;
    maxPercent: number;
    minAmount: number;
    typeTicket: string;
    customerId: number | null;
    customerName: string | null;
    customerEmail: string | null;
};

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

interface Voucher {
    id: number;
    name: string;
    code: string;
    startDate: string;
    endDate: string;
    status: string;
    quantity: number;
    maxPercent: number;
    minAmount: number;
    typeTicket: string;
}

const VoucherModal = ({
                          onVoucherSelect,
                          isVoucherModalOpen,
                          setIsVoucherModalOpen,
                          toggleVoucherModal
                      }: {
    onVoucherSelect: (voucher: Voucher) => void;
    isVoucherModalOpen: boolean;
    setIsVoucherModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    toggleVoucherModal: () => void;
}) => {
    const { sleep } = useLoadingContext()
    const { openNotification } = useToastContext()

    const [data, setData] = useState<VoucherDTO[]>([])
    const [loading, setLoading] = useState(false)
    const { user } = useAuthContext();
    const [totalElements, setTotalElements] = useState<number>(0)
    useEffect(() => {
        console.log("user", user)
    }, [])

    const [tableData, setTableData] = useState({
        total: 0,
        pageIndex: 1,
        pageSize: 5,
        query: '',
        typeTicket: '',
        sort: { order: '', key: '' }
    })

    const handlePaginationChange = (pageIndex: number) => {
        setTableData((prevData) => ({ ...prevData, ...{ pageIndex } }))
    }


    const { selectedCart } = useSaleContext()

    const fetchDataProduct = async () => {
        try {
            setLoading(true)
            const params = {
                page: tableData.pageIndex - 1,
                size: tableData.pageSize,
                query: tableData.query,
                typeTicket: tableData.typeTicket,
                sort: tableData.sort ? (tableData.sort.key + ',' + tableData.sort.order) : '',
                customerId: user?.customerId || ''
            }
            const response = await instance.get(`/voucher/find-valid-voucher`, { params: params })
            setData(response.data.content || [])
            setTotalElements(response.data.totalElements)
            setTableData((prev) => ({ ...prev, total: response.data.totalElements || 0 }))
        } finally {
            setLoading(false)
        }
    }

    const closeModal = () => {
        setIsVoucherModalOpen(false)
        document.body.style.overflow = 'auto'
    }

    useEffect(() => {
        fetchDataProduct()
    }, [tableData.pageIndex, tableData.pageSize, tableData.query, tableData.typeTicket, tableData.sort])


    return (
        <div className="fixed top-0 left-0 bg-gray-300 bg-opacity-50 w-screen h-screen z-40">
            <div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/12 h-auto bg-gray-100 shadow-md rounded-md">
                <div className="p-5 bg-white h-2/5 rounded-md">
                    <div className="flex justify-between pb-3">
                        <p className="font-semibold text-xl">Danh sách khuyến mãi</p>
                        <CloseButton
                            className="text-2xl py-1"
                            onClick={closeModal}
                        />
                    </div>
                    {
                        data.length > 0 ? (
                            <div className={'flex flex-col gap-2'}>
                                {data.map((item, index) => (
                                    <div key={index} className={'border border-dashed p-2 border-black rounded'}>
                                        <div className={'flex justify-between gap-2'}>
                                            <div className={'flex justify-start gap-2'}>
                                                <div>
                                                    <div
                                                        className={`${item.typeTicket === 'Everybody' ? '' : 'text-yellow-600'}`}>
                                                        <HiOutlineTicket size={25} /></div>
                                                </div>
                                                <div>
                                                    {item.code} - {item.name}
                                                </div>
                                            </div>
                                            <div>
                                                <span>Còn lại: {item.quantity}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <span>Đơn hàng tối thiểu: <span
                                                className={'text-red-600'}>{item.minAmount.toLocaleString('vi')}đ</span></span>
                                        </div>
                                        <div className={'flex justify-between'}>
                                            <div className={'flex justify-start gap-1'}>
                                                <span>Giảm(%): {item.maxPercent} </span>
                                                <span>~</span>
                                                <p className={'text-red-600'}>{Math.round(item.maxPercent / 100 * (selectedCart as CartResponseDTO)?.subTotal).toLocaleString('vi') + 'đ'}</p>
                                            </div>
                                            <div>
                                                <button
                                                    type={'button'}
                                                    className={'border-black border p-1 text-[12px] font-semibold'}
                                                    onClick={() => onVoucherSelect(item)}
                                                >Chọn
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex justify-center py-10">
                                <p className="flex justify-between py-28 items-center text-xl font-semibold">
                                    Không có khuyến mãi nào phù hợp
                                </p>
                            </div>
                        )
                    }
                    <div className={'flex justify-center'}>
                    <Pagination
                            total={totalElements}
                            currentPage={tableData.pageIndex}
                            onChange={(el) => {
                                handlePaginationChange(el)
                            }}
                        />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default VoucherModal
