import { Button, Card, Dialog } from '@/components/ui'
import { useEffect, useState } from 'react'
import { HiArrowsExpand, HiPlusCircle, HiQrcode } from 'react-icons/hi'
import { Fragment } from 'react/jsx-runtime'
import SellProductTable from '../table/SellProductTable'
import { EOrderStatusEnums, OrderHistoryResponseDTO, OrderResponseDTO } from '@/@types/order'
import CustomerInfo from '../other/CustomerInfo'
import instance from '@/axios/CustomAxios'
import PaymentInfo from '../other/PaymentInfo'
import { PaymentSummaryProps } from '@/@types/payment'
import SellProductModal from '../dialog/SellProductModal'
import SellCustomerModal from '../dialog/SellCustomerModal'
import QrCodeScanner from '../scanner/QrCodeScanner'
import { EPaymentMethod } from '@/views/manage/sell'
import { useLoadingContext } from '@/context/LoadingContext'
import SellVocherModal from '@/views/manage/sell/component/dialog/SellVocherModal'
import { changeOrderStatus } from '@/services/OrderService'
import { useToastContext } from '@/context/ToastContext'
import { useSellContext } from '@/views/manage/sell/context/SellContext'
import { ConfirmDialog } from '@/components/shared'
import { useOrderContext } from '@/views/manage/order/component/context/OrderContext'

const TabCard = ({ idOrder }: { idOrder: number }) => {
    // init variables
    const [isOpenCustomerModal, setIsOpenCustomerModal] = useState<boolean>(false)
    const [isOpenProductModal, setIsOpenProductModal] = useState<boolean>(false)
    const [isOpenVoucherModal, setIsOpenVoucherModal] = useState<boolean>(false)
    const [dialogIsOpenConfirmOrder, setIsOpenConfirmOrder] = useState(false)
    // order selected
    const [selectedOrder, setSelectedOrder] = useState<OrderResponseDTO>()
    // scanner
    const [isScanning, setIsScanning] = useState(false)
    // payment
    const [paymentSummaryProp, setPaymentSummaryProp] = useState<PaymentSummaryProps>({
        subTotal: 10,
        tax: 10,
        deliveryFee: 10,
        discount: 1000,
        total: 1000
    })
    // hook
    useEffect(() => {
        if (isOpenCustomerModal || isOpenVoucherModal || isOpenProductModal) {
            document.body.style.overflow = 'hidden'
        }
    }, [
        isOpenVoucherModal,
        isOpenCustomerModal,
        isOpenProductModal
    ])
    // context
    const { openNotification } = useToastContext()
    const { sleep, setIsLoadingComponent } = useLoadingContext()
    const { removeTab } = useSellContext()
    // func 
    const fetchSelectedOrder = async () => {
        setIsLoadingComponent(true)
        await instance.get(`/orders/${idOrder}`).then(function(response) {
            setSelectedOrder({ ...response.data })
            setPaymentSummaryProp({
                subTotal: response.data.subTotal || 0,
                tax: response.data.tax || 0,
                deliveryFee: response.data.deliveryFee || 0,
                discount: response.data.discount || 0,
                total: response.data.total || 0
            })
        }).catch(function (error){
            console.log(error.response.data.error === "Order not found")
            localStorage.removeItem("orderIds")
            window.location.reload()
        })
        await sleep(200)
        setIsLoadingComponent(false)
    }
    // 
    useEffect(() => {
        fetchSelectedOrder().then(() => {
            console.log('Fetch SelectedOrder Done')
        })
    }, [])

    const handleSubmitForm = async () => {
        console.log('PAYMENT')
        // if (selectedOrder) {
        //     setIsLoadingComponent(true)
        //     try {
        //         const response = await getUrlPayment(selectedOrder.id)
        //         console.log('Confirm payment')
        //         console.log(response)
        //         const url = response?.data?.data?.paymentUrl
        //         console.log(url)
        //         if (url) {
        //             window.location.href = url // Mở đường dẫn mới
        //         }
        //     } catch (error) {
        //         console.log(error)
        //     }
        //     setIsLoadingComponent(false)
        // }
        if (selectedOrder) {
            setIsLoadingComponent(true)
            try {
                const data: OrderHistoryResponseDTO = {
                    status: EOrderStatusEnums.DELIVERED,
                    note: 'Đã nhận hàng'
                }
                const response = await changeOrderStatus(selectedOrder.id, data)
                if (response.status === 200) {
                    await sleep(200)
                    openNotification('Xác nhận thành công')
                    removeTab(selectedOrder.id)
                }
                console.log('Confirm payment')
            } catch (error) {
                console.log(error)
            }
            setIsLoadingComponent(false)
            setIsOpenConfirmOrder(false)

        }
    }
    const handleCloseOverride = () => {
        console.log('Close')
        setIsOpenOverrideConfirm(false)
    }

    const handleConfirmOverride = async () => {
        console.log('Confirm')
        setIsOpenOverrideConfirm(false)
        console.log(selectedOrderRequestContext)
        await instance.post('/order-details', selectedOrderRequestContext).then(function() {
            fetchSelectedOrder()
        })
    }

    const { isOpenOverrideConfirm, setIsOpenOverrideConfirm, selectedOrderRequestContext } = useOrderContext()


    return (
        <Fragment>
            <div className="2xl:grid 2xl:grid-cols-12 gap-5 mt-2">
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
                        <ConfirmDialog
                            isOpen={isOpenOverrideConfirm}
                            type={'warning'}
                            title={'Xác nhận tạo bản ghi mới ?'}
                            confirmButtonColor={'red-600'}
                            onClose={handleCloseOverride}
                            onRequestClose={handleCloseOverride}
                            onCancel={handleCloseOverride}
                            onConfirm={handleConfirmOverride}
                        >
                            <p>Đợt giảm giá cho đơn này đã có sự thay đổi</p>
                        </ConfirmDialog>
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
                            disabled={Array.isArray(selectedOrder?.orderDetailResponseDTOS) && selectedOrder?.orderDetailResponseDTOS.length === 0}
                            onClick={() => setIsOpenConfirmOrder(true)}
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

            <div className={'h-full'}>
                <Dialog isOpen={dialogIsOpenConfirmOrder} closable={true}>
                    <h5 className="mb-4">Xác nhận đơn hàng</h5>

                    {
                        selectedOrder && selectedOrder.payment === EPaymentMethod.TRANSFER ? (
                            <div className="py-5">
                                <div>
                                    <p className="font-semibold text-xl text-center py-2">QR THANH TOÁN</p>
                                </div>
                                <div>
                                    <img
                                        src={`https://img.vietqr.io/image/970436-1037904766-bank.png?amount=${
                                            Math.round(selectedOrder?.total ?? 0)
                                        }&addInfo=THANH TOAN DON HANG&accountName=Pham Ha Anh`}
                                        width={500}
                                        height={500}
                                    />
                                </div>
                            </div>
                        ) : (
                            <p>Xác nhận đơn hàng?</p>
                        )
                    }


                    <div className="text-right mt-6">
                        <Button
                            className="ltr:mr-2 rtl:ml-2"
                            variant="plain"
                            onClick={() => setIsOpenConfirmOrder(false)}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="solid"
                            className={'bg-indigo-500'}
                            onClick={handleSubmitForm}
                        >
                            Xác nhận
                        </Button>
                    </div>
                </Dialog>
            </div>

        </Fragment>
    )
}

export default TabCard