import { IconText } from '@/components/shared'
import { Avatar, Card, Input, Radio, Tooltip } from '@/components/ui'
import AddressModal from '@/views/manage/order/component/puzzle/AddressModal'
import { OrderResponseDTO } from '@/@types/order'
import { useEffect, useState } from 'react'
import { HiExternalLink, HiMail, HiPencilAlt, HiPhone } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import { updateOrder } from '@/services/OrderService'

const CustomerInfo = ({ data, fetchSelectedOrder }: {
    data: OrderResponseDTO,
    fetchSelectedOrder: () => Promise<void>
}) => {
    const [isOpenEditAddress, setIsOpenEditAddress] = useState(false)

    // Đặt giá trị mặc định của isShipping là false để "Tại quầy" được chọn
    const [isShipping, setIsShipping] = useState<boolean>(true)
    const customer = data?.customerResponseDTO || {}
    const addresses = customer.addressResponseDTOS || []

    useEffect(() => {
        const typeLocal = data.type
        if (typeLocal === 'ONLINE') {
            setIsShipping(true)
        } else {
            setIsShipping(false)
        }
    }, [data])

    useEffect(() => {
        console.log('isShipping: ', isShipping)
    }, [isShipping])

    const onChangeMethod = async (val: boolean) => {
        setIsShipping(val)
        const response = await updateOrder(data.id, { 'type': val ? 'ONLINE' : 'INSTORE' })
        await fetchSelectedOrder()
        console.log(response)
    }

    const handleChangeAddress = async (val) => {
        // await instance.put(`/orders/${selectedOrder.id}`, data).then(function(response) {
        //     console.log(response)
        // })
    }

    return (
        <Card
            className={`mb-5`}>
            {isOpenEditAddress && <AddressModal
                selectedOrder={data}
                fetchData={fetchSelectedOrder}
                onCloseModal={setIsOpenEditAddress}
            />}

            <h5 className="mb-4">
                Khách hàng #{customer.code || 'Khách lẻ'}
            </h5>

            <Link className="group flex items-center justify-between" to="/app/crm/customer-details?id=11">
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        src={'https://th.bing.com/th/id/OIP.QypR4Rt5VeZ3Po2g8HQ2_QAAAA?rs=1&pid=ImgDetMain'}
                    />
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
                        <IconText className="mb-4" icon={<HiMail className="text-xl opacity-70" />}>
                            <span className="font-semibold">{customer.email || ''}</span>
                        </IconText>

                        <IconText icon={<HiPhone className="text-xl opacity-70" />}>
                            <span className="font-semibold">{customer.phone || ''}</span>
                        </IconText>

                    </div>
                )
            }
            <hr className="my-5" />
            <div>
                <div className="flex justify-between items-center">
                    <div>
                        <h6 className="mb-4">Hình thức nhận hàng</h6>
                    </div>
                    <div className="text-black">
                        <div className="font-semibold">
                            {/* Sử dụng onChange để xử lý sự kiện */}
                            <Radio.Group value={isShipping} onChange={onChangeMethod}>
                                <Radio value={true}>Giao hàng</Radio>
                                <Radio value={false}>Tại quầy</Radio>
                            </Radio.Group>
                        </div>
                    </div>
                </div>
                <div
                    className={`${!isShipping ? (customer.code ? 'max-h-[0px]' : 'max-h-[0px]') : 'max-h-[600px]'} overflow-hidden duration-700 transition-all`}
                >
                    <address className="not-italic my-2">
                        <Input
                            disabled
                            value={
                                (data?.address || 'N/A') + ', ' + data?.wardName + ', ' + data?.districtName + ', ' + data?.provinceName || ''
                            }
                            suffix={
                                <Tooltip title="Chỉnh sửa địa chỉ">
                                    <HiPencilAlt
                                        className="text-lg cursor-pointer ml-1"
                                        onClick={() => setIsOpenEditAddress(true)}
                                    />
                                </Tooltip>
                            }
                        />
                    </address>
                    <Radio.Group vertical>
                        {addresses.length ? (
                            addresses.map((item, index) => (
                                <Radio key={index} value={item.id} onClick={() => handleChangeAddress(item)}>
                                    {item.phone} - {item.detail}
                                </Radio>
                            ))
                        ) : (
                            <div className="flex justify-center items-center">
                                <p className="py-2">Không có bất kỳ địa chỉ nào khác</p>
                            </div>
                        )}
                    </Radio.Group>
                </div>

            </div>
        </Card>
    )
}

export default CustomerInfo


