import { PaymentInfoProps, PaymentSummaryProps } from '@/@types/payment'
import { Button, Card, Dialog, Input, Notification, Radio, toast } from '@/components/ui'
import { NumericFormat } from 'react-number-format'
import { Fragment } from 'react/jsx-runtime'
import { EPaymentMethod } from '@/views/manage/sell'
import { SetStateAction, useEffect, useState } from 'react'
import { changeIsManually, updateOrder } from '@/services/OrderService'
import { OrderResponseDTO } from '@/@types/order'
import SuggestVoucher from '@/views/manage/util/SuggestVoucher'
import UseVoucherBox from '@/views/manage/util/UseVoucherBox'
import { Formik, Form, Field} from 'formik'
import * as Yup from 'yup'
import instance from '@/axios/CustomAxios'
import { useToastContext } from '@/context/ToastContext'
import { HiOutlineCash, HiOutlineTruck } from 'react-icons/hi'

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

const PaymentRow = ({ label, value, isLast, prefix, children }: PaymentInfoProps & { children?: React.ReactNode }) => {
    return (
        <li
            className={`flex items-center justify-between${!isLast ? ' mb-3' : ''
            }`}
        >
            <span className="text-black">{label}</span>
            <div className={'flex'}>
                {children && <div className="">{children}</div>}
                <span className="font-semibold text-red-600">
                <NumericFormat
                    displayType="text"
                    value={(Math.round((value as number) * 100) / 100).toFixed(
                        0
                    )}
                    prefix={prefix}
                    suffix={' ₫'}
                    thousandSeparator={true}
                    allowNegative={false}
                />
            </span>
            </div>
        </li>
    )
}


const PaymentSummary = ({ selectedOrder, data, fetchSelectedOrder, setIsOpenVoucherModal }: {
    selectedOrder: OrderResponseDTO,
    data: PaymentSummaryProps,
    fetchSelectedOrder: () => Promise<void>,
    setIsOpenVoucherModal: React.Dispatch<SetStateAction<boolean>>,
}) => {
    const FeeShipSchema = Yup.object().shape({
        feeShip: Yup.number()
            .required('Phí vận chuyển không được để trống.')
            .min(0, 'Phí vận chuyển không được nhỏ hơn 0.')
            .max(10000000, 'Phí vận chuyển không được vượt quá 10.000.000.')
    })

    const [paymentMethod, setPaymentMethod] = useState<EPaymentMethod>(EPaymentMethod.CASH)
    const [isOpenEditFeeShip, setIsOpenEditFeeShip] = useState<boolean>(false)
    const { openNotification } = useToastContext()

    const handleEditFeeShip = async (value: number) => {
        console.log('FEE SHIP: ' + value)
        const data = {
            'orderId': selectedOrder.id,
            'amount': value
        }
        await changeIsManually(selectedOrder.id, true);
        await instance.post('/orders/edit-custom-fee', data).then(function(response) {
            console.log('Ok')
            if (response.status === 200) {
                openNotification('Áp dụng thành công')
            }
        }).catch(function(error) {
            if (error?.response?.data?.error) {
                openNotification(error?.response?.data?.error, 'Thông báo', 'warning', 5000)
            }
        })
    }


    useEffect(() => {
        setPaymentMethod(selectedOrder.payment as EPaymentMethod)
    }, [data])

    const onChangeMethod = async (val: EPaymentMethod) => {
        setPaymentMethod(val)
        const response = await updateOrder(selectedOrder.id, { payment: val })
        console.log(response)
        await fetchSelectedOrder()
    }

    const closeNotification = (key: string | Promise<string>) => {
        if (typeof key !== 'string') {
            key.then((resolvedValue) => {
                toast.remove(resolvedValue)
            })
        } else {
            toast.remove(key)
        }
    }

    const handleChangeAutoFillFeeShip = async () => {
        const notificationAutoFillFeeShip  = toast.push(
            <Notification title="Thông báo" duration={8000}>
                <div>
                    Xác nhận đổi phương thức tính phí tự động?
                </div>
                <div className="text-right mt-3">
                    <Button
                        size="sm"
                        variant="solid"
                        className="mr-2 bg-red-600"
                        onClick={async () => {
                            closeNotification(notificationAutoFillFeeShip as string | Promise<string>)
                            const response = await changeIsManually(selectedOrder.id, false);
                            if (response.status === 200) {
                                console.log('response', response)
                                await fetchSelectedOrder()
                            }
                        }}
                    >
                        Xác nhận
                    </Button>
                    <Button
                        size="sm"
                        onClick={() =>
                            closeNotification(notificationAutoFillFeeShip as string | Promise<string>)
                        }
                    >
                        Hủy
                    </Button>
                </div>
            </Notification>
        )
    }


    return (
        <Fragment>
            <Card className="mb-4 h-auto">
                <div className="flex justify-between">
                    <div>
                        <h5 className="mb-4">Hình thức thanh toán</h5>
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
                    <PaymentRow label={(
                        <div className={'flex gap-2'}>
                            <p>Phí vận chuyển</p>
                            <img
                                src={'https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-GHN-Blue-Orange-350x88.png'}
                                width={'60px'} />
                        </div>
                    )} value={data?.deliveryFee} prefix={' + '}>
                        <div hidden={selectedOrder.type === "INSTORE"}>
                            <Button
                                variant={'plain'}
                                icon={<HiOutlineTruck  />}
                                onClick={handleChangeAutoFillFeeShip}
                            />
                            <Button
                                variant={'plain'}
                                icon={<HiOutlineCash  />}
                                onClick={() => setIsOpenEditFeeShip(true)}
                            />
                        </div>
                    </PaymentRow>
                    <PaymentRow label={`Giảm giá (${selectedOrder?.discountVoucherPercent}%)`} value={data?.discount}
                                prefix={' - '} />
                    <div className={'pb-4'}>
                        <div>
                            <UseVoucherBox fetchSelectedOrder={fetchSelectedOrder} selectedOrder={selectedOrder} />
                        </div>
                        <SuggestVoucher
                            selectedOrder={selectedOrder}
                            fetchSelectedOrder={fetchSelectedOrder}
                        />
                    </div>
                    <PaymentRow isLast label="Tổng thanh toán" value={data?.total} />
                </ul>
            </Card>
            <Dialog isOpen={isOpenEditFeeShip} closable={false}>
                <h5 className="mb-4">Nhập phí vận chuyển:</h5>
                <div>
                    <Formik
                        initialValues={{ feeShip: 10000 }}
                        validationSchema={FeeShipSchema}
                        onSubmit={ async (values) => {
                            await handleEditFeeShip(values.feeShip) // Gọi hàm với giá trị phí vận chuyển
                            setIsOpenEditFeeShip(false) // Đóng dialog
                            await fetchSelectedOrder();
                        }}
                    >
                        {({ errors, touched }) => (
                            <Form>
                                <div>
                                    <Field
                                        name="feeShip"
                                        placeholder="Vui lòng nhập phí"
                                        type="number"
                                        className="input-class"
                                        inputMode="decimal"
                                        as={Input}
                                    />
                                    {errors.feeShip && touched.feeShip && (
                                        <div className="text-red-500 text-sm">{errors.feeShip}</div>
                                    )}
                                </div>
                                <p className={'text-[13px] text-red-600'}>(Phí điền tay chỉ được áp dụng khi dịch vụ
                                    tính phí vận chuyển gặp trục trặc)</p>
                                <div className="text-right mt-6">
                                    <Button
                                        className="ltr:mr-2 rtl:ml-2"
                                        variant="plain"
                                        onClick={() => setIsOpenEditFeeShip(false)}
                                        type={'button'}
                                    >
                                        Hủy
                                    </Button>
                                    <Button type="submit" variant="solid">
                                        Xác nhận
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </Dialog>
        </Fragment>
    )
}

export default PaymentInfo