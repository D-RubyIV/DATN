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


type CustomerDTO = {
    id: string;
    code: string;
    name: string;
    email: string;
    phone: string;
    birthDate: string;
    gender: string;
    province: string;
    district: string;
    ward: string;
    // addressDetails: string[];
    status: string;
};

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
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string().required('Phone is required'),
    birthDate: Yup.string().required('BrithDay is required'),
    province: Yup.string().required('Province is required'),
    district: Yup.string().required('District is required'),
    ward: Yup.string().required('Ward is required'),
    detail: Yup.string().required('Detail address is required'),
    status: Yup.string().required('Status is required'),
})


const UpdateCustomer = () => {

    const initialCustomerState: CustomerDTO = {
        id: '',
        code: '',
        name: '',
        email: '',
        phone: '',
        birthDate: '',
        gender: '',
        province: '',
        district: '',
        ward: '',
        // addressDetails: [],
        status: '',
    }

    const [updateCustomer, setUpdateCustomer] = useState<CustomerDTO>(initialCustomerState);
    const [provinces, setProvinces] = useState<Province[]>([])
    const [districts, setDistricts] = useState<District[]>([])
    const [wards, setWards] = useState<Ward[]>([])
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            fetchCustomer();
        }
    }, [id]);

    useEffect(() => {
        fetchProvinces();
    }, []);

    useEffect(() => {
        if (updateCustomer.province) {
            fetchDistricts(updateCustomer.province);

        } else {
            setDistricts([]);
        }
    }, [updateCustomer.province]);

    useEffect(() => {
        if (updateCustomer.district) {
            fetchWards(updateCustomer.district);
        } else {
            setWards([]);
        }
    }, [updateCustomer.district]);

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

    const handleProvinceChange = (newValue: SingleValue<Province> | null, form: FormikProps<CustomerDTO>) => {
        const provinceId = newValue ? newValue.id : '';
        form.setFieldValue('province', provinceId);
        fetchDistricts(provinceId);
        form.setFieldValue('district', ''); // Reset district and ward
        form.setFieldValue('ward', '');
    };

    const handleDistrictChange = (newValue: SingleValue<District> | null, form: FormikProps<CustomerDTO>) => {
        const districtId = newValue ? newValue.id : '';
        form.setFieldValue('district', districtId);
        fetchWards(districtId);
        form.setFieldValue('ward', ''); // Reset ward
    };

    const handleWardChange = (newValue: SingleValue<Ward> | null, form: FormikProps<CustomerDTO>) => {
        const wardId = newValue ? newValue.id : '';
        form.setFieldValue('ward', wardId);
    };



    const fetchCustomer = async () => {
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

    const handleUpdate = async (values: CustomerDTO, { setSubmitting }: FormikHelpers<CustomerDTO>) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/v1/customer/update/${values.id}`, values);
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


    return (
        <Formik
            initialValues={updateCustomer}
            validationSchema={validationSchema}
            onSubmit={handleUpdate}
            enableReinitialize
        >
            {({ values, setFieldValue, touched, errors, resetForm, isSubmitting }) => (
                <Form>
                    <div className="flex flex-col lg:flex-row">
                        {/* Right side - Address Information */}
                        <div className="w-full lg:w-1/3 bg-white p-6 shadow-md rounded-lg mb-6 lg:mb-0 mr-2">
                            <FormContainer>
                                <FormItem
                                    asterisk
                                    label="Name"
                                    invalid={errors.name && touched.name}
                                    errorMessage={errors.name}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="name"
                                        placeholder="Enter customer name"
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
                                        placeholder="Enter customer email"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem
                                    asterisk
                                    label="Phone"
                                    invalid={errors.phone && touched.phone}
                                    errorMessage={errors.phone}
                                >
                                    <Field
                                        type="number"
                                        autoComplete="off"
                                        name="phone"
                                        placeholder="Enter customer phone"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem
                                    asterisk
                                    label="Birth Date"
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
                                    label="Gender"
                                >
                                    <Field name="gender">
                                        {({ field, form }: any) => (
                                            <>
                                                <Radio
                                                    className="mr-4"
                                                    value="Nam"
                                                    defaultChecked
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
                            </FormContainer>
                        </div>

                        {/* Left side - Address Information */}
                        <div className="w-full lg:w-2/3 bg-white p-6 shadow-md rounded-lg">
                            <FormContainer>
                                <FormItem
                                    asterisk
                                    label="Province"
                                    invalid={errors.province && touched.province}
                                    errorMessage={errors.province}
                                >
                                    <Field name="province">
                                        {({ field, form }: FieldProps<CustomerDTO>) => (
                                            <Select
                                                value={provinces.find(province => province.id === field.value) || null}
                                                placeholder="Select province"
                                                onChange={(newValue: SingleValue<Province> | null) => handleProvinceChange(newValue, form)}
                                                getOptionLabel={(option) => option.name}
                                                getOptionValue={(option) => option.id} // Sử dụng ID để so sánh
                                                options={provinces}
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                <FormItem
                                    asterisk
                                    label="District"
                                    invalid={errors.district && touched.district}
                                    errorMessage={errors.district}
                                >
                                    <Field name="district">
                                        {({ field, form }: FieldProps<CustomerDTO>) => (
                                            <Select
                                                value={districts.find(district => district.id === field.value) || null}
                                                placeholder="Select district"
                                                onChange={(newValue: SingleValue<District> | null) => handleDistrictChange(newValue, form)}
                                                getOptionLabel={(option) => option.name}
                                                getOptionValue={(option) => option.id} // Sử dụng ID để so sánh
                                                options={districts}
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                <FormItem
                                    asterisk
                                    label="Ward"
                                    invalid={!!errors.ward && touched.ward}
                                    errorMessage={errors.ward}
                                >
                                    <Field name="ward">
                                        {({ field, form }: FieldProps<CustomerDTO>) => (
                                            <Select
                                                value={wards.find(ward => ward.id === field.value) || null}
                                                placeholder="Select ward"
                                                onChange={(newValue: SingleValue<Ward> | null) => handleWardChange(newValue, form)}
                                                getOptionLabel={(option) => option.name}
                                                getOptionValue={(option) => option.id} // Sử dụng ID để so sánh
                                                options={wards}
                                            />
                                        )}
                                    </Field>
                                </FormItem>


                                <FormItem
                                    asterisk
                                    label="Detail address"
                                    invalid={errors.detail && touched.detail}
                                    errorMessage={errors.detail}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="detail"
                                        placeholder="Enter customer detail address"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem>
                                    <Button
                                        type="reset"
                                        className="ltr:mr-2 rtl:ml-2"
                                        onClick={() => resetForm()}
                                        disabled={isSubmitting} // vô hiệu hóa nút khi gửi dữ liệu
                                    >
                                        Reset
                                    </Button>
                                    <Button variant="solid" type="submit" disabled={isSubmitting}>
                                        Update
                                    </Button>
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
