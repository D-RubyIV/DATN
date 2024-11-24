import { PaymentInfoProps, PaymentSummaryProps } from '@/@types/payment'
import { Button, Card, Radio } from '@/components/ui'
import { NumericFormat } from 'react-number-format'
import { Fragment } from 'react/jsx-runtime'
import { EPaymentMethod } from '@/views/manage/sell'
import { SetStateAction, useEffect, useState } from 'react'
import { updateOrder } from '@/services/OrderService'
import { OrderResponseDTO } from '@/@types/order'
import { Input } from '@/components/ui/Input'
import { HiOutlineTicket, HiTicket } from 'react-icons/hi'
import instance from '@/axios/CustomAxios'


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


const PaymentInfo = ({ setIsOpenVoucherModal, selectedOrder, data, fetchSelectedOrder }: {
    setIsOpenVoucherModal: React.Dispatch<SetStateAction<boolean>>,
    selectedOrder: OrderResponseDTO,
    data: PaymentSummaryProps,
    fetchSelectedOrder: () => Promise<void>
}) => {
    return (
        <Fragment>
            <PaymentSummary
                data={data}
                selectedOrder={selectedOrder}
                fetchSelectedOrder={fetchSelectedOrder}
                setIsOpenVoucherModal={setIsOpenVoucherModal}
            />
        </Fragment>
    )
}

const PaymentRow = ({ label, value, isLast, prefix }: PaymentInfoProps) => {
    return (
        <li
            className={`flex items-center justify-between${!isLast ? ' mb-3' : ''
            }`}
        >
            <span>{label}</span>
            <span className="font-semibold text-red-600">
                <NumericFormat
                    displayType="text"
                    value={(Math.round((value as number) * 100) / 100).toFixed(
                        2
                    )}
                    prefix={prefix}
                    suffix={'₫'}
                    thousandSeparator={true}
                    allowNegative={false}
                />
            </span>
        </li>
    )
}

const PaymentSummary = ({ selectedOrder, data, fetchSelectedOrder, setIsOpenVoucherModal }: {
    selectedOrder: OrderResponseDTO,
    data: PaymentSummaryProps,
    fetchSelectedOrder: () => Promise<void>,
    setIsOpenVoucherModal: React.Dispatch<SetStateAction<boolean>>,
}) => {
    const [paymentMethod, setPaymentMethod] = useState<EPaymentMethod>(EPaymentMethod.CASH)
    const [listVoucherSuggest, setListVoucherSuggest] = useState<TicketDTO[]>([])


    const setFilterVoucherSuggest = (data: TicketDTO[]) => {
        setListVoucherSuggest(data.filter(s => s.minAmount > selectedOrder.subTotal))

    }

    useEffect(() => {
        setPaymentMethod(selectedOrder.payment as EPaymentMethod)
    }, [data])

    const getBetterVoucher = async () => {
        await instance.get(`voucher/find-valid-voucher?sort=minAmount,asc&size=50`).then(
            function(response) {
                console.log(response)
                Array.isArray(response.data.content) && setFilterVoucherSuggest(response.data.content)
            }
        )
    }
    useEffect(() => {
        getBetterVoucher()
    }, [selectedOrder])

    const onChangeMethod = async (val: EPaymentMethod) => {
        setPaymentMethod(val)
        const response = await updateOrder(selectedOrder.id, { payment: val })
        console.log(response)
        await fetchSelectedOrder()
    }

    const onUseVoucher = async (idVoucher: number) => {
        const data = {
            idOrder: selectedOrder.id,
            idVoucher: idVoucher
        }
        const response = await instance.post(`/orders/use-voucher`, data)
        console.log(response)
        await fetchSelectedOrder()
    }

    return (
        <Card className="mb-4 h-auto">
            <div className="flex justify-between">
                <div>
                    <h5 className="mb-4">Thông tin thanh toán</h5>
                </div>
                <div className="flex gap-3 justify-between">
                    <div>
                        <div className="text-black">
                            <div className="font-semibold">
                                <Radio.Group value={paymentMethod} onChange={onChangeMethod}>
                                    <Radio value={EPaymentMethod.TRANSFER}>Chuyển khoản</Radio>
                                    <Radio value={EPaymentMethod.CASH}>Tiền mặt</Radio>
                                </Radio.Group>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ul>
                <PaymentRow label="Tổng tiền" value={data?.subTotal} />
                <PaymentRow label="Phí vận chuyển" value={data?.deliveryFee} prefix={' + '} />
                <PaymentRow label="Giảm giá" value={data?.discount} prefix={' - '} />
                <div className={'pb-4'}>
                    <Input placeholder={'Nhập mã giảm giá nếu có'} suffix={
                        (<Button className={'cursor-pointer'} variant={'plain'} icon={<HiTicket />}
                                 onClick={() => setIsOpenVoucherModal(true)}>
                        </Button>)
                    }></Input>
                    {
                        selectedOrder?.voucherResponseDTO?.code ? (
                                <div className="flex py-1 border px-2 justify-start gap-5 items-center">
                                    <div className="col-span-1 flex items-center">
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
                                                    <p className={'text-red-500'}>Cần mua thêm tối
                                                        thiểu {Math.round(listVoucherSuggest[0]?.minAmount - selectedOrder.subTotal).toLocaleString('vi') + 'đ'} giá
                                                        trị đơn hàng
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
                                                                        onClick={() => onUseVoucher(listVoucherSuggest[0]?.id)}
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
                </div>
                <PaymentRow isLast label="Tổng thanh toán" value={data?.total} />
            </ul>
        </Card>
    )
}

export default PaymentInfo