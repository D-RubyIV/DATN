import React, { Fragment } from 'react'
import { Input } from 'antd' // Assume you are using Ant Design for Input
import { HiSearch } from 'react-icons/hi'
import { Button } from '@/components/ui'
import instance from '@/axios/CustomAxios'
import { useToastContext } from '@/context/ToastContext'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
    orderCode: Yup.string()
        .required('Mã đơn hàng là bắt buộc')
        .min(5, 'Mã đơn hàng phải có ít nhất 5 ký tự')
})

const CheckOrderView = () => {
    const { openNotification } = useToastContext()
    const navigate = useNavigate()

    // Function to handle form submission
    const getDetailOrder = (values, { setSubmitting }) => {
        instance.get(`orders/by-code/${values.orderCode}`)
            .then(response => {
                console.log(response)
                if (response.status === 200 && response.data) {
                    console.log('OK OK')
                    navigate(`/user/purchase/${response.data.code}`)

                }
            })
            .catch(error => {
                if (error.response && error.response.status === 400) {
                    openNotification('Không tìm thấy hóa đơn này')
                }
            })
            .finally(() => {
                setSubmitting(false)
            })
    }

    return (
        <Fragment>
            <div className="py-20 flex justify-center items-center h-full flex-col gap-5">
                <h3 className={'font-hm'}>Tra cứu đơn hàng của bạn tại đây</h3>

                <Formik
                    initialValues={{ orderCode: '' }}
                    validationSchema={validationSchema}
                    onSubmit={getDetailOrder}
                >
                    {({ isSubmitting }) => (
                        <Form className="w-full max-w-md">
                            <div className="w-full">
                                <Field name="orderCode">
                                    {({ field }) => (
                                        <Input
                                            {...field}
                                            size="large"
                                            suffix={
                                                <button variant="plain" type="submit" disabled={isSubmitting}>
                                                    <HiSearch />
                                                </button>
                                            }
                                            placeholder="Nhập mã đơn hàng của bạn"
                                            className="w-full rounded-none border-black border-2"
                                        />
                                    )}
                                </Field>
                                <ErrorMessage name="orderCode" component="div" className="text-red-500 mt-1" />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Fragment>
    )
}

export default CheckOrderView