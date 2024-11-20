import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import IconText from '@/components/shared/IconText'
import { HiMail, HiPhone, HiExternalLink, HiPencilAlt } from 'react-icons/hi'
import { Link, useParams } from 'react-router-dom'
import OrderProducts from '../puzzle/OrderProducts'
import PaymentSummary from '../puzzle/PaymentSummary'
import OrderStep from '../puzzle/OrderStep'
import OrderInfo from '../puzzle/OderInfo'
import { Input, Radio, Tooltip } from '@/components/ui'
import instance from '@/axios/CustomAxios'
import AddressModal from '@/views/manage/order/component/puzzle/AddressModal'
import { OrderDetailResponseDTO, OrderResponseDTO } from '@/@types/order'
import { PaymentSummaryProps } from '@/@types/payment'
import { FiPackage } from 'react-icons/fi'
import dayjs from 'dayjs'

const OrderDetails = () => {

    const { id } = useParams()

    const [paymentSummaryProp, setPaymentSummaryProp] = useState<PaymentSummaryProps>({
        subTotal: 10,
        tax: 10,
        deliveryFee: 10,
        discount: 1000,
        total: 1000
    })
    const [selectObject, setSelectObject] = useState<OrderResponseDTO>()
    const [listOrderDetail, setListOrderDetail] = useState<OrderDetailResponseDTO[]>([])
    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        await instance.get(`/orders/${id}`).then(function(response) {
            console.log(response)
            setSelectObject(response.data)
            setListOrderDetail(response.data.orderDetailResponseDTOS)
            setPaymentSummaryProp({
                subTotal: response.data.subTotal || 0,
                tax: response.data.tax || 0,
                deliveryFee: response.data.deliveryFee || 0,
                discount: response.data.discount || 0,
                total: response.data.total || 0
            })
        })
    }

    useEffect(() => {
        console.log('Selected Bill: ', selectObject)
    }, [selectObject])


    return (
        <div>
            <div>
                <div className="2xl:grid 2xl:grid-cols-12 2xl:gap-5">
                    <div className="md:col-span-8">
                        <div className="flex flex-col gap-5">
                            {selectObject !== undefined &&
                                <OrderStep selectObject={selectObject} fetchData={fetchData}></OrderStep>}
                            {selectObject !== undefined && <OrderProducts data={listOrderDetail} fetchData={fetchData}
                                                                          selectObject={selectObject}></OrderProducts>}

                        </div>
                    </div>
                    <div className="md:col-span-4">
                        {selectObject !== undefined && <OrderInfo data={selectObject}></OrderInfo>}
                        {selectObject !== undefined &&
                            <CustomerInfo data={selectObject} fetchData={fetchData}></CustomerInfo>}
                        <PaymentSummary data={paymentSummaryProp} />
                    </div>
                </div>
            </div>
        </div>
    )
}


const CustomerInfo = ({ data, fetchData }: { data: OrderResponseDTO, fetchData: () => Promise<void> }) => {
    const [isOpenEditAddress, setIsOpenEditAddress] = useState<boolean>(false)

    const customer = data?.customerResponseDTO || {}

    return (
        <Card className="mb-5 h-[450px]">
            {isOpenEditAddress && <AddressModal selectedOrder={data} onCloseModal={setIsOpenEditAddress}
                                                fetchData={fetchData}></AddressModal>}

            <h5 className="mb-4">
                Khách hàng #{customer.code || 'Khách lẻ'}
            </h5>
            <Link
                className="group flex items-center justify-between"
                to="/app/crm/customer-details?id=11"
            >
                <div className="flex items-center">
                    <Avatar icon={<FiPackage />} />
                    <div className="ltr:ml-2 rtl:mr-2">
                        <div className="font-semibold group-hover:text-gray-900 group-hover:dark:text-gray-100">
                            {customer.name || 'Khách lẻ'}
                        </div>
                        <span>
                            <span className="font-semibold">{customer.code ? 1 : 0}</span> đơn hàng trước đó
                        </span>
                    </div>
                </div>
                <HiExternalLink className="text-xl hidden group-hover:block" />
            </Link>
            <hr className="my-5" />
            {
                customer.code && (
                    <div>
                        <IconText
                            className="mb-4"
                            icon={<HiMail className="text-xl opacity-70" />}
                        >
                            <span className="font-semibold">{customer.email || ''}</span>
                        </IconText>
                        <IconText icon={<HiPhone className="text-xl opacity-70" />}>
                            <span className="font-semibold">{customer.phone || ''}</span>
                        </IconText>
                    </div>
                )
            }
            <hr className="my-5" />
            <h6 className="mb-4">Địa chỉ nhận hàng</h6>
            <address className="not-italic">
                <div className="mb-4">
                    {/* {data?.address} */}
                    <Input
                        disabled
                        value={data.address}
                        suffix={
                            <Tooltip title="Field info">
                                <HiPencilAlt className="text-lg cursor-pointer ml-1"
                                             onClick={() => setIsOpenEditAddress(true)} />
                            </Tooltip>
                        }
                    ></Input>
                </div>
                {
                    customer.code ? (
                            <div>
                                <Radio.Group vertical>
                                    {data.customerResponseDTO?.addressResponseDTOS?.length ? (
                                        data.customerResponseDTO.addressResponseDTOS.map((item, index) => (
                                            <Radio value={item.id} key={index}>
                                                {item.phone} - {item.detail}
                                            </Radio>
                                        ))
                                    ) : (
                                        <div className="flex justify-center items-center">
                                            <div className="py-2">
                                                <p>Không có bất kì địa chỉ nào khác</p>
                                            </div>
                                        </div>
                                    )}
                                </Radio.Group>
                            </div>
                        ) :
                        (
                            <div className={'flex flex-col gap-3 font-semibold'}>
                                <div>
                                    <p>Tên người nhận: {data.recipientName}</p>
                                </div>
                                <div>
                                    <p>Số điện thoại nhận: {data.phone}</p>
                                </div>
                                <div>
                                    <p>Thời gian đặt: {dayjs(data.createdDate).format('DD/MM/YYYY HH:mm:ss')}</p>
                                </div>
                                <div>
                                    <p>Phương thức thanh toán: {data.payment === 'CASH' ? "Thanh toán khi nhận hàng" : "Chuyển khoản trước"}</p>
                                </div>
                            </div>
                        )
                }
                <ul>

                </ul>
            </address>
        </Card>
    )
}


export default OrderDetails
