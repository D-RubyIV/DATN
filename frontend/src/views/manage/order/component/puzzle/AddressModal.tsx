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
    provinceId: string;
    provinceName?: string;
    districtId: string;
    districtName?: string;
    wardId: string;
    wardName?: string;
    address?: string
};

const AddressModal = ({ selectedOrder, onCloseModal, fetchData }: {
    selectedOrder: OrderResponseDTO,
    onCloseModal: React.Dispatch<SetStateAction<boolean>>,
    fetchData?: () => Promise<void>
}) => {
    const [IAddress, setIAddress] = useState<IAddress>({})
    const [provinces, setProvinces] = useState<IProvince[]>([])
    const [districts, setDistricts] = useState<IDistrict[]>([])
    const [wards, setWards] = useState<IWard[]>([])
    const { openNotification } = useToastContext()
    const { sleep, setIsLoadingComponent } = useLoadingContext()

    const validationSchema = Yup.object({
        provinceId: Yup.string().required('Vui lòng chọn tỉnh'),
        districtId: Yup.string().required('Vui lòng chọn thành phố'),
        wardId: Yup.string().required('Vui lòng chọn xã/phường')
    })

    useEffect(() => {
        handleFindAllProvinces()
    }, [])

    useEffect(() => {
        if (IAddress.iprovince) {
            handleFindAllDistricts(IAddress.iprovince.ProvinceID)
            if (IAddress.idistrict) {
                handleFindAllWards(IAddress.idistrict.DistrictID)
            }
        }
    }, [IAddress])

    const handleFindAllProvinces = async () => {
        const modifiedProvinces: IProvince[] = await fetchFindAllProvinces()
        setProvinces(modifiedProvinces)
    }

    const handleFindAllDistricts = async (idProvince: string) => {
        const modifiedDistricts: IDistrict[] = await fetchFindAllDistricts(idProvince)
        setDistricts(modifiedDistricts)
    }

    const handleFindAllWards = async (idDistrict: string) => {
        const modifiedWards: IWard[] = await fetchFindAllWards(idDistrict)
        setWards(modifiedWards)
    }

    const handleSubmitForm = async () => {
        setIsLoadingComponent(true)
        const data: AddressInfo = {
            provinceId: IAddress.iprovince?.ProvinceID || '',
            provinceName: IAddress.iprovince?.ProvinceName || '',
            districtId: IAddress.idistrict?.DistrictID || '',
            districtName: IAddress.idistrict?.DistrictName || '',
            wardId: IAddress.iward?.WardCode || '',
            wardName: IAddress.iward?.WardName || '',
            address: IAddress?.address || ''
        }
        await instance.put(`/orders/${selectedOrder.id}`, data).then(function(response) {
            console.log(response)
        })
        onCloseModal(false)
        if (fetchData) {
            await fetchData()
        }
        await sleep(500)
        setIsLoadingComponent(false)
        openNotification('Thay đổi địa chỉ thành công')
    }

    return (
        <div className="fixed top-0 left-0 bg-gray-300 bg-opacity-50 w-screen h-screen z-50">
            <div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow-xl w-3/5 xl:w-2/5 p-5 rounded-md z-51">
                <div className="flex justify-between py-3 text-[18px] font-semibold">
                    <div>
                        <label>Thay đổi địa chỉ</label>
                    </div>
                    <div>
                        <CloseButton onClick={() => onCloseModal(false)} />
                    </div>
                </div>

                <Formik
                    initialValues={{
                        provinceId: '',
                        districtId: '',
                        wardId: '',
                        detail: ''
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmitForm}
                >
                    {({ setFieldValue }) => (
                        <Form className="flex flex-col gap-3">
                            <div>
                                <label className="font-semibold text-gray-600">Tỉnh:</label>
                                <Select
                                    options={provinces}
                                    placeholder="Vui lòng chọn tỉnh"
                                    onChange={(el) => {
                                        setIAddress((prev) => ({ ...prev, iprovince: (el as IProvince) }))
                                        setFieldValue('provinceId', (el as IProvince).ProvinceID)
                                    }}
                                />
                                <ErrorMessage name="provinceId" component="p" className="text-red-500 text-[12.5px]" />
                            </div>

                            <div>
                                <label className="font-semibold text-gray-600">Thành phố:</label>
                                <Select
                                    options={districts}
                                    placeholder="Vui lòng chọn thành phố"
                                    onChange={(el) => {
                                        setIAddress((prev) => ({ ...prev, idistrict: (el as IDistrict) }))
                                        setFieldValue('districtId', (el as IDistrict).DistrictID)
                                    }}
                                />
                                <ErrorMessage name="districtId" component="p" className="text-red-500 text-[12.5px]" />
                            </div>

                            <div>
                                <label className="font-semibold text-gray-600">Xã:</label>
                                <Select
                                    options={wards}
                                    placeholder="Vui lòng chọn xã/phường"
                                    onChange={(el) => {
                                        setIAddress((prev) => ({ ...prev, iward: (el as IWard) }))
                                        setFieldValue('wardId', (el as IWard).WardCode)
                                    }}
                                />
                                <ErrorMessage name="wardId" component="p" className="text-red-500 text-[12.5px]" />
                            </div>

                            <div>
                                <label className="font-semibold text-gray-600">Số nhà:</label>
                                <Field
                                    name="address"
                                    as={Input}
                                    placeholder="Vui lòng nhập số nhà"
                                    size="sm"
                                    onChange={(el: any) => {
                                        setIAddress((prev) => ({ ...prev, address: el.target.value }))
                                        setFieldValue('address', el.target.value)  // Cập nhật giá trị của Formik
                                    }}
                                />
                            </div>

                            <div>
                                <Button block variant="twoTone" type="submit">
                                    Xác nhận
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default AddressModal
