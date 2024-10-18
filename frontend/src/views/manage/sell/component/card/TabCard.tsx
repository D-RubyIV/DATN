import { Button, Card } from '@/components/ui'
import { useEffect, useState } from 'react'
import { HiArrowsExpand, HiPlusCircle, HiQrcode } from 'react-icons/hi'
import { Fragment } from 'react/jsx-runtime'
import SellProductTable from '../table/SellProductTable'
import { OrderResponseDTO } from '@/@types/order'
import CustomerInfo from '../other/CustomerInfo'
import instance from '@/axios/CustomAxios'
import PaymentInfo from '../other/PaymentInfo'
import { PaymentSummaryProps } from '@/@types/payment'
import SellProductModal from '../dialog/SellProductModal'
import SellCustomerModal from '../dialog/SellCustomerModal'
import QrCodeScanner from '../scanner/QrCodeScanner'
import { getUrlPayment } from '@/services/PaymentService'
import { EPaymentMethod } from '@/views/manage/sell'
import { useLoadingContext } from '@/context/LoadingContext'
import SellVocherModal from '@/views/manage/sell/component/dialog/SellVocherModal'

const TabCard = ({ idOrder }: { idOrder: number }) => {
    // init variables
    const [isOpenCustomerModal, setIsOpenCustomerModal] = useState<boolean>(false)
    const [isOpenProductModal, setIsOpenProductModal] = useState<boolean>(false)
    const [isOpenVoucherModal, setIsOpenVoucherModal] = useState<boolean>(false)
    // order selected
    const [selectedOrder, setSelectedOrder] = useState<OrderResponseDTO>()
    // scanner
    const [isScanning, setIsScanning] = useState(false)
    // payment
    const [paymentSummaryProp, setPaymentSummaryProp] = useState<PaymentSummaryProps>({
        subTotal: 10,
        tax: 10,
        deliveryFees: 10,
        total: 1000
    })
    // hook
    useEffect(() => {
        if(isOpenCustomerModal || isOpenVoucherModal || isOpenProductModal){
            document.body.style.overflow = 'hidden'
        }
    }, [
        isOpenVoucherModal,
        isOpenCustomerModal,
        isOpenProductModal
    ])
    // context
    const { sleep, setIsLoadingComponent } = useLoadingContext()
    // func 
    const fetchSelectedOrder = async () => {
        setIsLoadingComponent(true)
        await instance.get(`/orders/${idOrder}`).then(function(response) {
            console.log(response)
            setSelectedOrder({ ...response.data })
            setPaymentSummaryProp({
                subTotal: response.data.subTotal || 0,
                tax: response.data.tax || 0,
                deliveryFees: response.data.deliveryFees || 0,
                total: response.data.total || 0
            })
        })
        await sleep(500)
        setIsLoadingComponent(false)
    }
    // 
    useEffect(() => {
        fetchSelectedOrder().then(() => {
            console.log("Fetch SelectedOrder Done")
        })
    }, [])

    useEffect(() => {
        console.log(selectedOrder)
    }, [selectedOrder])

    const handleSubmitForm = async () => {
        console.log('PAYMENT')
        if (selectedOrder?.payment === EPaymentMethod.TRANSFER) {
            setIsLoadingComponent(true)
            try {
                const response = await getUrlPayment(selectedOrder.id)
                console.log('Confirm payment')
                console.log(response)
                const url = response?.data?.data?.paymentUrl
                console.log(url)
                if (url) {
                    window.location.href = url // Mở đường dẫn mới
                }
            } catch (error) {
                console.log(error)
            }
            setIsLoadingComponent(false)
        }
    }

    return (
        <Fragment>
            <div className="2xl:grid 2xl:grid-cols-12 gap-5 mt-10">
                <Card className="xl:col-span-8">
                    <div className="flex justify-between items-center py-2">
                        <div className="font-semibold text-[16px] text-black">
                            <label>
                                Danh sách sản phẩm - Đơn hàng {selectedOrder?.code}
                            </label>
                        </div>
                        <div className="flex gap-4">
                            <Button
                                variant="default"
                                icon={<HiQrcode />}
                                onClick={() => setIsScanning(true)}
                            >Quét mã QR</Button>
                            <Button
                                size="sm"
                                variant="solid"
                                style={{ backgroundColor: 'rgb(79, 70, 229)' }}
                                className="flex items-center justify-center gap-2 button-bg-important"
                                icon={<HiPlusCircle />}
                                onClick={() => {
                                    setIsOpenProductModal(true)
                                }}
                            >Thêm sản phẩm</Button>
                        </div>
                    </div>
                    <div>
                        {
                            selectedOrder && <SellProductTable fetchData={fetchSelectedOrder}
                                                               selectedOrder={selectedOrder}></SellProductTable>
                        }
                    </div>
                </Card>
                <Card className="2xl:col-span-4">
                    <div className="flex justify-between items-center">
                        <div className="font-semibold text-[16px] text-black">
                            <label>Thông tin khách hàng</label>
                        </div>
                        <div className="flex gap-3 justify-between">
                            <div>
                                <Button
                                    size="sm"
                                    variant="default"
                                    icon={<HiArrowsExpand />}
                                    onClick={() => setIsOpenCustomerModal(true)}
                                >Chọn
                                </Button>
                            </div>
                            <div>
                                <Button
                                    size="sm"
                                    variant="solid"
                                    style={{ backgroundColor: 'rgb(79, 70, 229)' }}
                                    className="flex items-center justify-center gap-2 button-bg-important"
                                    icon={<HiPlusCircle />}
                                >Thêm mới</Button>
                            </div>
                        </div>
                    </div>
                    <div className="py-2">
                        {
                            selectedOrder ? (
                                <CustomerInfo data={selectedOrder} fetchSelectedOrder={fetchSelectedOrder} />) : (
                                <div></div>)
                        }
                    </div>

                    {/* Payment */}
                    <div className="flex justify-between items-center">
                        <div className="font-semibold text-[16px] text-black">
                            <label>Thông tin thanh toán</label>
                        </div>

                    </div>
                    <div className="py-2">
                        {
                            selectedOrder ? (
                                <PaymentInfo
                                    setIsOpenVoucherModal={setIsOpenVoucherModal}
                                    selectedOrder={selectedOrder}
                                    data={paymentSummaryProp}
                                    fetchSelectedOrder={fetchSelectedOrder} />
                            ) : (<div></div>)
                        }
                    </div>
                    <div>
                        <Button
                            block
                            size="sm"
                            variant="solid"
                            style={{ backgroundColor: 'rgb(79, 70, 229)' }}
                            className="flex items-center justify-center gap-2 button-bg-important"
                            onClick={handleSubmitForm}
                            disabled={selectedOrder?.orderDetailResponseDTOS.length === 0}
                        >
                            Xác nhận đơn hàng
                        </Button>
                    </div>
                </Card>
            </div>

            <div>
                {
                    (isOpenCustomerModal && selectedOrder) && (
                        <SellCustomerModal setIsOpenCustomerModal={setIsOpenCustomerModal} selectOrder={selectedOrder}
                                           fetchData={fetchSelectedOrder}></SellCustomerModal>)
                }
            </div>
            <div>
                {
                    (isOpenProductModal && selectedOrder) && (
                        <SellProductModal setIsOpenProductModal={setIsOpenProductModal} selectOrder={selectedOrder}
                                          fetchData={fetchSelectedOrder}></SellProductModal>)
                }
            </div>
            <div>
                {
                    (isOpenVoucherModal && selectedOrder) && (
                        <SellVocherModal setIsOpenVoucherModal={setIsOpenVoucherModal} selectOrder={selectedOrder}
                                          fetchData={fetchSelectedOrder}></SellVocherModal>)
                }
            </div>
            <QrCodeScanner isScanning={isScanning} setIsScanning={setIsScanning}></QrCodeScanner>
        </Fragment>
    )
}

export default TabCard