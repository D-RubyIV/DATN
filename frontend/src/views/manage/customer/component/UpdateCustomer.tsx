import { useState, useEffect } from 'react';
import { Button, Input, Radio, Select } from '@/components/ui';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Field, FieldProps, Form, Formik, FormikHelpers, FormikProps } from 'formik'
import DatePicker from '@/components/ui/DatePicker'
import axios from "axios";

import dayjs from "dayjs";
import { SingleValue } from 'react-select';


type CustomerDetailDTO = {
    id: string;
    code: string;
    name: string;
    email: string;
    phone: string;
    birthDate: string;
    gender: string;
    province: string | null;
    district: string | null;
    ward: string | null;
    addressDTOS: AddressDTO[];
    status: string;
};

type AddressDTO = {
    id: string;
    name: string;
    phone: string;
    province: string | null;
    district: string | null;
    ward: string | null;
    detail: string;
    isDefault: boolean
}

interface Province {
    id: string;
    name: string;
    full_name: string;
}

interface District {
    id: string;
    name: string;
    full_name: string;
}

interface Ward {
    id: string;
    name: string;
    full_name: string;
}

// Xu ly validation
const validationSchema = Yup.object({
    // name: Yup.string().required('Name is required'),
    // email: Yup.string().email('Invalid email address').required('Email is required'),
    // phone: Yup.string().required('Phone is required'),
    // birthDate: Yup.string().required('BrithDay is required'),
    // province: Yup.string().required('Province is required'),
    // district: Yup.string().required('District is required'),
    // ward: Yup.string().required('Ward is required'),
    // detail: Yup.string().required('Detail address is required'),
    // status: Yup.string().required('Status is required'),
})


const UpdateCustomer = () => {

    const initialAddressDTO: AddressDTO = {
        id: '',
        name: '',
        phone: '',
        province: null,
        district: null,
        ward: null,
        detail: '',
        isDefault: false
    }

    const initialCustomerState: CustomerDetailDTO = {
        id: '',
        code: '',
        name: '',
        email: '',
        phone: '',
        birthDate: '',
        gender: '',
        province: null,
        district: null,
        ward: null,
        addressDTOS: [
            {
                id: '',
                name: '',
                phone: '',
                province: '',
                district: '',
                ward: '',
                detail: '',
                isDefault: false
            }
        ],
        status: '',
    }

    const [showNewAddressForm, setShowNewAddressForm] = useState(false);
    const [updateCustomer, setUpdateCustomer] = useState<CustomerDetailDTO>(initialCustomerState);
    const [provinces, setProvinces] = useState<Province[]>([])
    const [districts, setDistricts] = useState<District[]>([])
    const [wards, setWards] = useState<Ward[]>([])
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            fetchCustomer(id);
        }
        fetchProvinces()
    }, [id]);

    useEffect(() => {
        if (updateCustomer.province && provinces.length > 0) {
            const province = provinces.find((prov) => prov.full_name === updateCustomer.province);
            if (province) {
                fetchDistricts(province.id);
            } else {
                setDistricts([])
            }
        }
    }, [updateCustomer.province, provinces]);

    useEffect(() => {
        if (updateCustomer.district && districts.length > 0) {
            const district = districts.find((dist) => dist.full_name === updateCustomer.district);
            if (district) {
                fetchWards(district.id)
            } else {
                setWards([])
            }
        }
    }, [updateCustomer.district, districts]);

    // APi lay du lieu theo id
    const fetchCustomer = async (id: string) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/customer/${id}`);
            const customerData = response.data;
            console.log(customerData);
            if (response.status === 200) {
                setUpdateCustomer(response.data);
            } else {
                console.error('Failed to fetch customer data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching customer data:', error);
        }
    };



    const fetchProvinces = async () => {
        try {
            const response = await axios.get('https://esgoo.net/api-tinhthanh/1/0.htm');
            const data = response.data;
            if (data.error === 0) {
                setProvinces(data.data);
            } else {
                console.error('Error loading province:', data.message);
            }
        } catch (error) {
            console.error('Error when calling API province:', error);
        }
    };

    const fetchDistricts = async (provinceId: string) => {
        try {
            const response = await axios.get(`https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`);
            const data_district = response.data;
            if (data_district.error === 0) {
                setDistricts(data_district.data);
            } else {
                console.error('Error loading district:', data_district.message);
            }
        } catch (error) {
            console.error(`Error when calling API district with provinceId ${provinceId}:`, error);
        }
    };

    const fetchWards = async (districtId: string) => {
        try {
            const response = await axios.get(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`);
            const data_ward = response.data;
            if (data_ward.error === 0) {
                setWards(data_ward.data);
            } else {
                console.error('Error loading ward:', data_ward.message);
            }
        } catch (error) {
            console.error(`Error when calling API ward with districtId ${districtId}:`, error);
        }
    };


    const handleLocationChange = (
        type: 'province' | 'district' | 'ward',
        newValue: Province | District | Ward | null,
        form: FormikProps<CustomerDetailDTO>
    ) => {
        if (newValue) {
            if (type === 'province') {
                form.setFieldValue('province', newValue.full_name);
                form.setFieldValue('district', '');
                form.setFieldValue('ward', '');
                setUpdateCustomer((prev) => ({ ...prev, province: newValue.full_name, district: null, ward: null }));
                fetchDistricts(newValue.id)
            } else if (type === 'district') {
                form.setFieldValue('district', newValue.full_name);
                form.setFieldValue('ward', '');
                setUpdateCustomer((prev) => ({ ...prev, district: newValue.full_name, ward: null }));
                fetchWards(newValue.id)
            } else if (type === 'ward') {
                form.setFieldValue('ward', newValue.full_name);
                setUpdateCustomer((prev) => ({ ...prev, ward: newValue.full_name }));
            }
        }
    }


    const handleUpdate = async (values: CustomerDetailDTO, { resetForm, setSubmitting }: FormikHelpers<CustomerDetailDTO>) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/v1/customer/update/${values.id}`, values);
            resetForm();

            if (response.status === 200) {
                navigate('/manage/customer');
            } else {
                console.error('Failed to update customer:', response.statusText);
                alert('Failed to update customer. Please try again.');
            }
        } catch (error) {
            console.error('Error updating customer:', error);
            alert('Error updating customer. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleNewAddressSubmit = (values: AddressDTO, { resetForm }: FormikHelpers<AddressDTO>) => {
        // Xử lý việc gửi địa chỉ mới tại đây
        console.log('Địa chỉ mới đã được gửi:', values);
        resetForm();
        setShowNewAddressForm(false);
    };


    return (
        <Formik
            initialValues={updateCustomer}
            validationSchema={validationSchema}
            enableReinitialize={true}
            onSubmit={handleUpdate}
        >
            {({ values, setFieldValue, touched, errors, resetForm, isSubmitting }) => (
                <Form>
                    <h1 className="text-center font-semibold text-2xl mb-4 text-transform: uppercase">Cập nhật khách hàng</h1>
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Right side - Address Information */}
                        <div className="w-full lg:w-1/3 bg-white p-6 shadow-md rounded-lg">
                            <h4 className="font-medium text-xl mb-4">Thông tin khách hàng</h4>

                            <FormContainer>
                                <FormItem
                                    asterisk
                                    label="Tên khách hàng"
                                    invalid={errors.name && touched.name}
                                    errorMessage={errors.name}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="name"
                                        placeholder="Tên khách hàng..."
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem
                                    asterisk
                                    label="Email"
                                    invalid={errors.email && touched.email}
                                    errorMessage={errors.email}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="email"
                                        placeholder="email..."
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem
                                    asterisk
                                    label="Số điện thoại"
                                    invalid={errors.phone && touched.phone}
                                    errorMessage={errors.phone}
                                >
                                    <Field
                                        type="number"
                                        autoComplete="off"
                                        name="phone"
                                        placeholder="Số điện thoại..."
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem
                                    asterisk
                                    label="Ngày sinh"
                                    invalid={errors.birthDate && touched.birthDate}
                                    errorMessage={errors.birthDate}
                                >
                                    <DatePicker
                                        placeholder="Pick a date"
                                        value={values.birthDate ? dayjs(values.birthDate, 'DD-MM-YYYY').toDate() : null}
                                        onChange={(date) => {
                                            if (date && dayjs(date).isValid()) {  // Kiểm tra xem ngày có hợp lệ không
                                                const formattedDate = dayjs(date).format('DD-MM-YYYY');
                                                setFieldValue('birthDate', formattedDate); // Cập nhật birthDate trong Formik
                                            } else {
                                                setFieldValue('birthDate', ''); // Xử lý khi giá trị ngày không hợp lệ
                                            }
                                        }}
                                    />
                                </FormItem>

                                <FormItem
                                    asterisk
                                    label="Giới tính"
                                >
                                    <Field name="gender">
                                        {({ field, form }: FieldProps<string, FormikProps<CustomerDetailDTO>>) => (
                                            <>
                                                <Radio
                                                    className="mr-4"
                                                    value="Nam"
                                                    checked={field.value === 'Nam'}
                                                    onChange={() => form.setFieldValue('gender', 'Nam')}
                                                >
                                                    Nam
                                                </Radio>
                                                <Radio
                                                    value="Nữ"
                                                    checked={field.value === 'Nữ'}
                                                    onChange={() => form.setFieldValue('gender', 'Nữ')}
                                                >
                                                    Nữ
                                                </Radio>
                                            </>
                                        )}
                                    </Field>
                                </FormItem>

                                <FormItem >
                                    <Button
                                        type="reset"
                                        className="ltr:mr-2 rtl:ml-2"
                                        disabled={isSubmitting} // vô hiệu hóa nút khi gửi dữ liệu
                                        onClick={() => resetForm()}
                                    >
                                        Tải lại
                                    </Button>
                                    <Button variant="solid" type="submit" disabled={isSubmitting}>
                                        Cập nhật
                                    </Button>
                                </FormItem>
                            </FormContainer>
                        </div>

                        {/* Left side - Address Information */}
                        <div className="w-full lg:w-2/3 bg-white p-6 shadow-md rounded-lg">
                            <h4 className="font-medium text-xl">Thông tin địa chỉ</h4>

                            {/* Nút thêm địa chỉ mới */}
                            <Button
                                variant="default"
                                className="mb-4 mt-4"
                                type='button'
                                onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                            >
                                {showNewAddressForm ? 'Hủy bỏ' : 'Thêm địa chỉ mới'}
                            </Button>

                            {/* Form địa chỉ mới */}
                            {showNewAddressForm && (

                                <Formik
                                    initialValues={initialAddressDTO}
                                    // validationSchema={NewAddressSchema}
                                    onSubmit={handleNewAddressSubmit}
                                >
                                    {({ isSubmitting }: FormikProps<AddressDTO>) => (

                                        <div className="bg-white p-6 shadow-md rounded-lg mb-6 w-full">
                                            <div className="w-full">
                                                <FormContainer>
                                                    {/* Tên và Số điện thoại trên cùng một hàng */}
                                                    <div className="flex w-full flex-wrap mb-4">
                                                        <div className="w-1/2 pr-4">
                                                            <FormItem asterisk label="Tên">
                                                                <Field type="text" name="name" placeholder="Nhập tên..." component={Input} />
                                                            </FormItem>
                                                        </div>

                                                        <div className="w-1/2">
                                                            <FormItem asterisk label="Số điện thoại">
                                                                <Field type="text" name="phone" placeholder="Nhập số điện thoại..." component={Input} />
                                                            </FormItem>
                                                        </div>
                                                    </div>

                                                    {/* Tỉnh, Quận, Xã trên cùng một hàng */}
                                                    <div className="flex w-full flex-wrap mb-4">
                                                        <div className="w-1/3 pr-4">
                                                            <FormItem
                                                                asterisk
                                                                label="Tỉnh/thành phố">
                                                                <Field name="province">
                                                                    {({ field }: FieldProps<string>) => (
                                                                        <Select
                                                                            value={provinces.find(province => province.id === field.value) || null}
                                                                            placeholder="Chọn tỉnh thành"
                                                                            getOptionLabel={(option) => option.name}
                                                                            getOptionValue={(option) => option.id}
                                                                            options={provinces}
                                                                        // onChange={(newValue: SingleValue<Province> | null) => handleProvinceChange(newValue, form)}
                                                                        />
                                                                    )}
                                                                </Field>
                                                            </FormItem>
                                                        </div>

                                                        <div className="w-1/3 pr-4">
                                                            <FormItem
                                                                asterisk
                                                                label="Quận/huyện"
                                                            >
                                                                <Field name="district">
                                                                    {({ field }: FieldProps<string>) => (
                                                                        <Select
                                                                            value={districts.find(district => district.id === field.value) || null}
                                                                            placeholder="Chọn quận huyện"
                                                                            getOptionLabel={(option) => option.name}
                                                                            getOptionValue={(option) => option.id}
                                                                            options={districts}
                                                                        // onChange={(newValue: SingleValue<District> | null) => handleDistrictChange(newValue, form)}
                                                                        />
                                                                    )}
                                                                </Field>
                                                            </FormItem>
                                                        </div>

                                                        <div className="w-1/3">
                                                            <FormItem
                                                                asterisk
                                                                label="Xã/phường/thị trấn"
                                                            >
                                                                <Field name="ward">
                                                                    {({ field }: FieldProps<string>) => (
                                                                        <Select
                                                                            value={wards.find(ward => ward.id === field.value) || null}
                                                                            placeholder="Chọn phường xã"
                                                                            getOptionLabel={(option) => option.name}
                                                                            getOptionValue={(option) => option.id}
                                                                            options={wards}
                                                                        // onChange={(newValue: SingleValue<Ward> | null) => handleWardChange(newValue, form)}
                                                                        />
                                                                    )}
                                                                </Field>
                                                            </FormItem>
                                                        </div>
                                                    </div>

                                                    {/* Địa chỉ chi tiết */}
                                                    <div className="w-full mb-4">
                                                        <FormItem asterisk label="Địa chỉ chi tiết">
                                                            <Field type="text" name="detail" placeholder="Nhập địa chỉ chi tiết" component={Input} />
                                                        </FormItem>
                                                    </div>

                                                    <FormItem>
                                                        <Button type="submit" disabled={isSubmitting}>
                                                            Thêm địa chỉ
                                                        </Button>
                                                    </FormItem>
                                                </FormContainer>
                                            </div>
                                        </div>

                                    )}
                                </Formik>
                            )}
                            <FormContainer>
                                <FormItem
                                    asterisk
                                    label="Tỉnh/thành phố"
                                    invalid={errors.province && touched.province}
                                    errorMessage={errors.province}
                                >
                                    <Field name="province">
                                        {({ field, form }: FieldProps<string>) => (
                                            <Select
                                                value={provinces.find(province => province.full_name === field.value) || null}
                                                placeholder="Chọn tỉnh/thành phố..."
                                                getOptionLabel={(option) => option.full_name}
                                                getOptionValue={(option) => option.full_name} // Sử dụng ID để so sánh
                                                options={provinces}
                                                onChange={(newValue: SingleValue<Province> | null) => {
                                                    handleLocationChange('province', newValue, form);
                                                }}
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                <FormItem
                                    asterisk
                                    label="Quận/huyện"
                                    invalid={errors.district && touched.district}
                                    errorMessage={errors.district}
                                >
                                    <Field name="district">
                                        {({ field, form }: FieldProps<string>) => (
                                            <Select
                                                value={districts.find(district => district.full_name === field.value) || null}
                                                placeholder="Chọn tỉnh/thành phố..."
                                                getOptionLabel={(option) => option.full_name}
                                                getOptionValue={(option) => option.full_name} // Sử dụng ID để so sánh
                                                options={provinces}
                                                onChange={(newValue: SingleValue<District> | null) => {
                                                    handleLocationChange('province', newValue, form);
                                                }}
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                <FormItem
                                    asterisk
                                    label="Xã/phường/thị trấn"
                                    invalid={!!errors.ward && touched.ward}
                                    errorMessage={errors.ward}
                                >
                                    <Field name="ward">
                                        {({ field, form }: FieldProps<string>) => (
                                            <Select
                                                value={wards.find(ward => ward.full_name === field.value) || null}
                                                placeholder="Chọn tỉnh/thành phố..."
                                                getOptionLabel={(option) => option.full_name}
                                                getOptionValue={(option) => option.full_name} // Sử dụng ID để so sánh
                                                options={provinces}
                                                onChange={(newValue: SingleValue<Ward> | null) => {
                                                    handleLocationChange('province', newValue, form);
                                                }}
                                            />
                                        )}
                                    </Field>
                                </FormItem>



                                <FormItem
                                    asterisk
                                    label="Chi tiết địa chỉ"
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="addressDTOS[0].detail"
                                        placeholder="Chi tiết địa chỉ"
                                        component={Input}
                                    />
                                </FormItem>


                            </FormContainer>

                        </div>
                    </div>
                </Form>
            )}
        </Formik>

    );

};

export default UpdateCustomer;
