import Card from '@/components/ui/Card'
import { NumericFormat } from 'react-number-format'
import { PaymentInfoProps, PaymentSummaryProps } from '@/@types/payment'
import { HiExternalLink, HiOutlineCash } from 'react-icons/hi'
import { OrderResponseDTO } from '@/@types/order'
import SuggestVoucher from '@/views/manage/util/SuggestVoucher'
import UseVoucherBox from '@/views/manage/util/UseVoucherBox'
import { Button, Dialog, Input } from '@/components/ui'
import { Fragment, useState } from 'react'
import { Formik, Form, Field} from 'formik'
import * as Yup from 'yup'
import instance from '@/axios/CustomAxios'
import { useToastContext } from '@/context/ToastContext'

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

const PaymentSummary = ({ selectObject, fetchData, data, unAllowUseVoucher = false }: {
    selectObject: OrderResponseDTO,
    fetchData: () => Promise<void>,
    data: PaymentSummaryProps,
    unAllowUseVoucher?: boolean
}) => {
    const FeeShipSchema = Yup.object().shape({
        feeShip: Yup.number()
            .required('Phí vận chuyển không được để trống.')
            .min(0, 'Phí vận chuyển không được nhỏ hơn 0.')
            .max(10000000, 'Phí vận chuyển không được vượt quá 10.000.000.')
    })
    const [isOpenEditFeeShip, setIsOpenEditFeeShip] = useState<boolean>(false)
    const { openNotification } = useToastContext()
    const handleEditFeeShip = (value: number) => {
        console.log('FEE SHIP: ' + value)
        const data = {
            'orderId': selectObject.id,
            'amount': value
        }
        instance.post('/orders/edit-custom-fee', data).then(function(response) {
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

    return (
        <Fragment>
            <Card className="h-auto">
                <h5 className="mb-4">Thông tin thanh toán</h5>
                <PaymentRow label="Tổng tiền các sản phẩm" value={data?.subTotal} />
                <PaymentRow label={
                    (
                        <div className={'flex gap-2'}>
                            <p>Phí vận chuyển</p>
                            <img src={'https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-GHN-Blue-Orange-350x88.png'}
                                 width={'60px'} />
                        </div>
                    )
                } value={data?.deliveryFee} prefix={' + '}>
                    <div hidden={selectObject.type === 'INSTORE'}>
                        <Button
                            variant={'plain'}
                            icon={<HiOutlineCash />}
                            onClick={() => setIsOpenEditFeeShip(true)}
                        />
                    </div>
                </PaymentRow>
                <PaymentRow label={`Khuyến mãi phiếu giảm giá (${selectObject.discountVoucherPercent}%)`}
                            value={data?.discount} prefix={' - '} />
                <PaymentRow label="Tổng thanh toán" value={data?.totalAfterDiscountAndFee} />
                <div hidden={unAllowUseVoucher}>
                    <UseVoucherBox selectedOrder={selectObject} fetchSelectedOrder={fetchData}></UseVoucherBox>
                    <SuggestVoucher fetchSelectedOrder={fetchData} selectedOrder={selectObject}></SuggestVoucher>
                </div>
                <HiExternalLink className="text-xl hidden group-hover:block" />
                <hr className="my-5" />

                <PaymentRow label="Đã thanh toán" value={data?.totalPaid} />
                <PaymentRow label="Cần thanh toán" value={data?.total} />

                <HiExternalLink className="text-xl hidden group-hover:block" />
                <HiExternalLink className="text-xl hidden group-hover:block" />
                <hr className="my-5" />
                <PaymentRow label="(Phụ phí)" value={data?.surcharge} prefix={''} />
                <PaymentRow isLast label="(Hoàn trả)" value={data?.refund} prefix={''} />
            </Card>
            <Dialog isOpen={isOpenEditFeeShip} closable={false}>
                <h5 className="mb-4">Nhập phí vận chuyển:</h5>
                <div>
                    <Formik
                        initialValues={{ feeShip: 10000 }}
                        validationSchema={FeeShipSchema}
                        onSubmit={(values) => {
                            handleEditFeeShip(values.feeShip) // Gọi hàm với giá trị phí vận chuyển
                            setIsOpenEditFeeShip(false) // Đóng dialog
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

export default PaymentSummary
