import { Fragment, useEffect, useState } from 'react'
import { OrderResponseDTO } from '@/@types/order'
import instance from '@/axios/CustomAxios'
import { HiOutlineTicket } from 'react-icons/hi'
import { Input } from '@/components/ui'

type TicketDTO = {
    id: number;
    name: string;
    code: string;
    startDate: string; // ISO date string
    endDate: string; // ISO date string
    status: string;
    quantity: number;
    maxPercent: number;
    minAmount: number;
    typeTicket: string; // Thêm các loại nếu cần
    deleted: boolean;
};

const SuggestVoucher = ({ selectedOrder, fetchSelectedOrder }: { selectedOrder: OrderResponseDTO, fetchSelectedOrder: () => Promise<void> }) => {
    const [listVoucherSuggest, setListVoucherSuggest] = useState<TicketDTO[]>([])
    const [listVoucherCanUse, setListVoucherCanUse] = useState<TicketDTO[]>([])


    const setFilterVoucherCanUse = (data: TicketDTO[]) => {
        setListVoucherCanUse(data.filter(s => s.minAmount < selectedOrder.subTotal))
    }

    const setFilterVoucherSuggest = (data: TicketDTO[]) => {
        setListVoucherSuggest(data.filter(s => s.minAmount > selectedOrder.subTotal))
    }

    const getBetterVoucher = async () => {
        await instance.get(`voucher/find-valid-voucher?sort=minAmount,asc&size=50`).then(
            function(response) {
                console.log(response)
                Array.isArray(response.data.content) && setFilterVoucherSuggest(response.data.content)
                Array.isArray(response.data.content) && setFilterVoucherCanUse(response.data.content)
            }
        )
    }



    const onUseVoucherById = async (idVoucher: number) => {
        const data = {
            idOrder: selectedOrder.id,
            idVoucher: idVoucher
        }
        const response = await instance.post(`/orders/use-voucher-by-id`, data)
        console.log(response)
        await fetchSelectedOrder()
    }


    useEffect(() => {
        getBetterVoucher()
    }, [selectedOrder])

    return (
        <Fragment>
            {
                selectedOrder?.voucherResponseDTO?.code ? (
                        <div className="flex py-1 border px-2 justify-start gap-5 items-center mt-2">
                            <div className="col-span-1 flex items-center text-green-600">
                                <HiOutlineTicket size={32} />
                            </div>
                            <div className="">
                                <div>
                                    <p>{`Mã phiếu ${selectedOrder.voucherResponseDTO.code}`}</p>
                                </div>
                            </div>
                            <div className="">
                                <div>
                                    <p>{`Phần trăm tối đa ${selectedOrder.voucherResponseDTO.maxPercent}%`}</p>
                                </div>
                            </div>
                            <div className="">
                                <div>
                                    <p>{`Giá trị tối thiểu ${selectedOrder.voucherResponseDTO.minAmount.toLocaleString('vi') + 'đ'}`}</p>
                                </div>
                            </div>
                        </div>
                    ) :
                    (
                        <div>

                        </div>
                    )
            }
            {
                (Array.isArray(listVoucherSuggest) && listVoucherSuggest.length > 0) ? (
                        <div>
                            {
                                listVoucherSuggest[0]?.minAmount > selectedOrder.subTotal ? (
                                        <div className={'py-2 flex'}>
                                            <p className={'text-red-500'}>Cần mua thêm {Math.round(listVoucherSuggest[0]?.minAmount - selectedOrder.subTotal).toLocaleString('vi') + 'đ'} giá
                                                để có thể sử dụng khuyễn mãi tốt hơn
                                                giảm {listVoucherSuggest[0]?.maxPercent} %
                                            </p>
                                        </div>
                                    ) :
                                    (
                                        <div className={'py-2 flex'}>
                                            <Input
                                                disabled
                                                className="text-green-800"
                                                placeholder={`Khuyễn mãi tốt nhất cho bạn ${listVoucherSuggest[0]?.maxPercent} %`}

                                                suffix={
                                                    selectedOrder.discountVoucherPercent == listVoucherSuggest[0]?.maxPercent ?
                                                        (
                                                            <button>
                                                                Đang sử dụng
                                                            </button>
                                                        ) :
                                                        (
                                                            <button
                                                                onClick={() => onUseVoucherById(listVoucherSuggest[0]?.id)}
                                                            >
                                                                Sử dụng
                                                            </button>
                                                        )
                                                }
                                            ></Input>
                                        </div>
                                    )

                            }
                        </div>
                    )
                    :
                    (
                        <div className={'pt-2 flex'}>
                            <p>Không có voucher phù hợp hơn</p>
                        </div>
                    )
            }
        </Fragment>
    )

}
export default SuggestVoucher