import { Button, Card, Radio, Switcher } from "@/components/ui";
import { useEffect, useState } from "react";
import { HiArrowsExpand, HiPlusCircle, HiQrcode, HiSelector } from "react-icons/hi";
import { Fragment } from "react/jsx-runtime";
import { OrderDetailOverview } from "../..";
import SellProductTable from "../table/SellProductTable";
import SellCustomerTable from "../dialog/SellCustomerModal";
import { BillResponseDTO } from "@/views/manage/order/store";
import CustomerInfo from "../other/CustomerInfo";
import instance from "@/axios/CustomAxios";
import PaymentInfo from "../other/PaymentInfo";
import { PaymentSummaryProps } from "@/@types/payment";
import SellProductModal from "../dialog/SellProductModal";
import SellCustomerModal from "../dialog/SellCustomerModal";
import QrCodeScanner from "../scanner/QrCodeScanner";

const TabCard = ({ idOrder }: { idOrder: number }) => {
    // init variables
    const [isOpenCustomerModal, setIsOpenCustomerModal] = useState<boolean>(false)
    const [isOpenProductModal, setIsOpenProductModal] = useState<boolean>(false)
    const [listOrderDetailOverview, setListOrderDetailOverview] = useState<OrderDetailOverview[]>([])
    // order selected
    const [selectedOrder, setSelectedOrder] = useState<BillResponseDTO>()
    // payment
    const [paymentSummaryProp, setPaymentSummaryProp] = useState<PaymentSummaryProps>({
        data: {
            subTotal: 10,
            tax: 10,
            deliveryFees: 10,
            total: 1000
        }
    });
    // func 
    const fetchSelectedOrder = async () => {
        await instance.get(`/orders/${idOrder}`).then(function (response) {
            console.log(response)
            setSelectedOrder({ ...response.data })
            setPaymentSummaryProp({
                data: {
                    subTotal: response.data.subTotal || 0,
                    tax: response.data.tax || 0,
                    deliveryFees: response.data.deliveryFees || 0,
                    total: response.data.total || 0
                }
            });
        })
    }
    // 
    useEffect(() => {
        fetchSelectedOrder();
    }, [])

    useEffect(() => {
        console.log("Thay doi")
        console.log(selectedOrder)
    }, [selectedOrder])


    return (
        <Fragment>
            <div className="2xl:grid 2xl:grid-cols-12 gap-5 mt-10">
                <Card className="xl:col-span-8">
                    <div className="flex justify-between items-center py-2">
                        <div className="font-semibold text-[16px] text-black">
                            <label>
                                Danh sách sản phẩm
                            </label>
                        </div>
                        <div className="flex gap-4">
                            <Button variant="default" icon={<HiQrcode />}>Quét mã QR</Button>
                            <Button
                                size='sm'
                                variant="solid"
                                style={{ backgroundColor: 'rgb(79, 70, 229)' }}
                                className='flex items-center justify-center gap-2 button-bg-important'
                                icon={<HiPlusCircle />}
                                onClick={() => {
                                    setIsOpenProductModal(true)
                                }}
                            >Thêm sản phẩm</Button>
                        </div>
                    </div>
                    <div>
                        {
                            selectedOrder && <SellProductTable fetchData={fetchSelectedOrder} selectedOrder={selectedOrder}></SellProductTable>
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
                                    size='sm'
                                    variant="default"
                                    icon={<HiArrowsExpand />}
                                    onClick={() => setIsOpenCustomerModal(true)}
                                >Chọn
                                </Button>
                            </div>
                            <div>
                                <Button
                                    size='sm'
                                    variant="solid"
                                    style={{ backgroundColor: 'rgb(79, 70, 229)' }}
                                    className='flex items-center justify-center gap-2 button-bg-important'
                                    icon={<HiPlusCircle />}
                                >Thêm mới</Button>
                            </div>
                        </div>
                    </div>
                    <div className="py-2">
                        {
                            selectedOrder ? (<CustomerInfo data={selectedOrder} />) : (<div></div>)
                        }
                    </div>

                    {/* Payment */}
                    <div className="flex justify-between items-center">
                        <div className="font-semibold text-[16px] text-black">
                            <label>Thông tin thanh toán</label>
                        </div>
                        <div className="flex gap-3 justify-between">
                            <div>
                                <div className="text-black">
                                    <div className="font-semibold">
                                        <Radio className="mr-4" name="simpleRadioExample">
                                            Chuyển khoản
                                        </Radio>
                                        <Radio defaultChecked name="simpleRadioExample">
                                            Tiền mặt
                                        </Radio>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="py-2">
                        {
                            selectedOrder ? (<PaymentInfo data={paymentSummaryProp.data} />) : (<div></div>)
                        }
                    </div>
                    <div>
                        <Button
                            block
                            size='sm'
                            variant="solid"
                            style={{ backgroundColor: 'rgb(79, 70, 229)' }}
                            className='flex items-center justify-center gap-2 button-bg-important'
                        >
                            Xác nhận đơn hàng
                        </Button>
                    </div>
                </Card>
            </div>

            <div>
                {
                    (isOpenCustomerModal && selectedOrder) && (<SellCustomerModal setIsOpenCustomerModal={setIsOpenCustomerModal} selectOrder={selectedOrder} fetchData={fetchSelectedOrder}></SellCustomerModal>)
                }
            </div>
            <div>
                {
                    (isOpenProductModal && selectedOrder) && (<SellProductModal setIsOpenProductModal={setIsOpenProductModal} selectOrder={selectedOrder} fetchData={fetchSelectedOrder}></SellProductModal>)
                }
            </div>

        </Fragment >
    );
}

export default TabCard;