import React, { useEffect, useState } from 'react'
import instance from '@/axios/CustomAxios'
import { useAuthContext } from '@/views/client/auth/AuthContext'
import { HiOutlineTicket } from 'react-icons/hi'
import { CartResponseDTO } from '@/views/sale'

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

const MyVoucher = () => {
    const { user } = useAuthContext();
    const [data, setData] = useState<VoucherDTO[]>([])

    useEffect(() => {
        getMyVoucher();
    }, [])

    const getMyVoucher = async () => {
        const params = {
            page: 0,
            size: 50,
            customerId: user?.customerId || ''
        }
        const response = await instance.get(`/voucher/find-valid-voucher`, { params: params })
        setData(response.data.content || [])
    }
    return (
        <div>
            <div>
                <h1 className="font-semibold text-xl text-black mb-4 text-transform: uppercase">Danh sách phiếu giảm giá của bạn</h1>
            </div>
            <div>
                {
                    data.length > 0 ? (
                        <div className={'grid grid-cols-3 gap-5'}>
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
            </div>
        </div>
    )
}
export default MyVoucher