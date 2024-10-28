import { IAddress, IDistrict, IProvince, IWard } from '@/@types/address'
import { Button, Input, Select } from '@/components/ui'
import CloseButton from '@/components/ui/CloseButton'
import { fetchFindAllDistricts, fetchFindAllProvinces, fetchFindAllWards } from '@/services/AddressService'
import { SetStateAction, useEffect, useState } from 'react'
import instance from '@/axios/CustomAxios'
import { OrderResponseDTO } from '@/@types/order'
import { useToastContext } from '@/context/ToastContext'
import { useLoadingContext } from '@/context/LoadingContext'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

type AddressInfo = {
    recipientName: string;
    phone: string;
    provinceId: string;
    provinceName?: string;
    districtId: string;
    districtName?: string;
    wardId: string;
    wardName?: string;
    address?: string;
};

const validationSchema = Yup.object({
    recipientName: Yup.string().required('Vui lòng nhập tên người nhận'),
    phone: Yup.string().required('Vui lòng nhập số điện thoại nhận'),
    provinceId: Yup.string().required('Vui lòng chọn tỉnh'),
    districtId: Yup.string().required('Vui lòng chọn thành phố'),
    wardId: Yup.string().required('Vui lòng chọn xã/phường')
})

const AddressModal = ({
                          selectedOrder,
                          onCloseModal,
                          fetchData
                      }: {
    selectedOrder: OrderResponseDTO;
    onCloseModal: React.Dispatch<SetStateAction<boolean>>;
    fetchData?: () => Promise<void>;
}) => {
    const [IAddress, setIAddress] = useState<IAddress>({})
    const [provinces, setProvinces] = useState<IProvince[]>([])
    const [districts, setDistricts] = useState<IDistrict[]>([])
    const [wards, setWards] = useState<IWard[]>([])
    const { openNotification } = useToastContext()
    const { sleep, setIsLoadingComponent } = useLoadingContext()

    useEffect(() => {
        const loadProvinces = async () => {
            const data = await fetchFindAllProvinces()
            setProvinces(data)
        }
        loadProvinces().then(() => {
            console.log('Effect done')
        })
    }, [])

    useEffect(() => {
        if (IAddress.iprovince) {
            fetchFindAllDistricts(IAddress.iprovince.ProvinceID).then(setDistricts)
            if (IAddress.idistrict) {
                fetchFindAllWards(IAddress.idistrict.DistrictID).then(setWards)
            }
        }
    }, [IAddress])

    const handleSubmitForm = async (values: AddressInfo) => {
        setIsLoadingComponent(true)
        const data = {
            ...values,
            provinceName: IAddress.iprovince?.ProvinceName || '',
            districtName: IAddress.idistrict?.DistrictName || '',
            wardName: IAddress.iward?.WardName || ''
        }
        try {
            await instance.put(`/orders/${selectedOrder.id}`, data)
            openNotification('Thay đổi địa chỉ thành công')
            if (fetchData) await fetchData()
        } finally {
            setIsLoadingComponent(false)
            onCloseModal(false)
        }
        await sleep(500)
    }

    return (
        <div className="fixed top-0 left-0 bg-gray-300 bg-opacity-50 w-screen h-screen z-50">
            <div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow-xl w-3/5 xl:w-2/5 p-5 rounded-md">
                <div className="flex justify-between py-3 text-[18px] font-semibold">
                    <span>Thay đổi địa chỉ</span>
                    <CloseButton onClick={() => onCloseModal(false)} />
                </div>
                <Formik
                    initialValues={{
                        provinceId: '',
                        districtId: '',
                        wardId: '',
                        detail: '',
                        recipientName: '',
                        phone: ''
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmitForm}
                >
                    {({ setFieldValue }) => (
                        <Form className="flex flex-col gap-3">
                            <FormField label="Tên người nhận:" name="recipientName"
                                       placeholder="Vui lòng nhập tên người nhận" />
                            <FormField label="Số điện thoại:" name="phone"
                                       placeholder="Vui lòng nhập số điện thoại người nhận" />
                            <FormSelect
                                label="Tỉnh:"
                                name="provinceId"
                                options={provinces}
                                placeholder="Vui lòng chọn tỉnh"
                                onChange={async (el: IProvince) => {
                                    setIAddress((prev) => ({ ...prev, iprovince: el }))
                                    await setFieldValue('provinceId', el.ProvinceID)
                                }}
                            />
                            <FormSelect
                                label="Thành phố:"
                                name="districtId"
                                options={districts}
                                placeholder="Vui lòng chọn thành phố"
                                onChange={async (el: IDistrict) => {
                                    setIAddress((prev) => ({ ...prev, idistrict: el }))
                                    await setFieldValue('districtId', el.DistrictID)
                                }}
                            />
                            <FormSelect
                                label="Xã:"
                                name="wardId"
                                options={wards}
                                placeholder="Vui lòng chọn xã/phường"
                                onChange={async (el: IWard) => {
                                    setIAddress((prev) => ({ ...prev, iward: el }))
                                    await setFieldValue('wardId', el.WardCode)
                                }}
                            />
                            <FormField label="Số nhà:" name="address" placeholder="Vui lòng nhập số nhà" as={Input} />
                            <Button block variant="twoTone" type="submit">Xác nhận</Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

const FormField = ({ label, name, placeholder }: { label: string; name: string; placeholder: string }) => (
    <div>
        <label className="font-semibold text-gray-600">{label}</label>
        <Field as={Input} name={name} placeholder={placeholder} />
        <ErrorMessage name={name} component="p" className="text-red-500 text-[12.5px]" />
    </div>
)

const FormSelect = ({ label, name, options, placeholder, onChange }: any) => (
    <div>
        <label className="font-semibold text-gray-600">{label}</label>
        <Select options={options} placeholder={placeholder} onChange={(el) => onChange(el)} />
        <ErrorMessage name={name} component="p" className="text-red-500 text-[12.5px]" />
    </div>
)

export default AddressModal
