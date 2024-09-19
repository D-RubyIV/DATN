
import React, { useEffect, useState } from "react";
import axios from "axios";
import * as Yup from 'yup';
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Field, FieldProps, Form, Formik, FormikHelpers, FormikProps } from 'formik'
import Button from '@/components/ui/Button'
import { Input, Radio, Select } from "@/components/ui";
import DatePicker from '@/components/ui/DatePicker'
import { SingleValue } from "react-select";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

type CustomerDTO = {
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
    detail: string;
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


const AddCustomer = () => {

    const initialCustomerState: CustomerDTO = {
        id: '',
        code: '',
        name: '',
        email: '',
        phone: '',
        birthDate: '',
        gender: 'Nữ',
        province: null,
        district: null,
        ward: null,
        detail: '',
        status: 'Active',
    }

    const [newCustomer, setNewCustomer] = useState<CustomerDTO>(initialCustomerState);
    const [provinces, setProvinces] = useState<Province[]>([])
    const [districts, setDistricts] = useState<District[]>([])
    const [wards, setWards] = useState<Ward[]>([])
    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingWards, setLoadingWards] = useState(false);

    const navigate = useNavigate();


    useEffect(() => {
        fetchProvinces();
    }, [])

    useEffect(() => {
        if (newCustomer.province) { // Chỉ gọi khi có province
            fetchDistricts(newCustomer.province);
        } else {
            setDistricts([]); // Xóa danh sách quận khi tỉnh không được chọn
        }
    }, [newCustomer.province]);


    useEffect(() => {
        if (newCustomer.district) {
            fetchWards(newCustomer.district);
        } else {
            setWards([]); // Xóa danh sách wards khi không có district
        }
    }, [newCustomer.district]);




    const fetchProvinces = async () => {

        setLoadingProvinces(true)

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
        finally {
            setLoadingProvinces(false);
        }
    };

    const fetchDistricts = async (provinceId: string) => {

        if (!provinceId) {
            setDistricts([]);
            return;
        }

        setLoadingDistricts(true);

        try {
            const response = await axios.get(`https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`);
            console.log("API response:", response.data); // In toàn bộ phản hồi ra console
            const data_district = response.data;
            if (data_district.error === 0) {
                setDistricts(data_district.data);
            } else {
                console.error('Error loading district:', data_district.error_text || 'ko xác định');
            }
        } catch (error) {
            console.error(`Error when calling API district with provinceId ${provinceId}:`, error);
        }
        finally {
            setLoadingDistricts(false);
        }
    };

    const fetchWards = async (districtId: string) => {

        if (!districtId) {
            console.error('District ID is undefined or null');
            setWards([]);
            return;
        }

        try {
            const response = await axios.get(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`);
            console.log("API response:", response.data); // In toàn bộ phản hồi ra console
            const data_ward = response.data;
            if (data_ward.error === 0) {
                setWards(data_ward.data);
            } else {
                console.error('Error loading ward:', data_ward.error_text || 'ko xác định');
            }
        } catch (error) {
            console.error(`Error when calling API ward with districtId ${districtId}:`, error);
        }
        finally {
            setLoadingWards(false);
        }
    };


    const handleProvinceChange = (newValue: SingleValue<Province> | null, form: FormikProps<CustomerDTO>) => {
        console.log('Selected province:', newValue);

        if (newValue) {
            form.setFieldValue('province', newValue.name); // Cập nhật giá trị của trường
            setNewCustomer(prev => ({ ...prev, province: newValue.id }));
            fetchDistricts(newValue.id); // Gọi API để lấy quận của tỉnh đã chọn
        } else {
            form.setFieldValue('province', ''); // Xử lý trường hợp không có giá trị
            setNewCustomer(prev => ({ ...prev, province: null }));
            setDistricts([]); // Xóa danh sách quận khi không chọn tỉnh
        }
    };

    const handleDistrictChange = (newValue: SingleValue<District> | null, form: FormikProps<CustomerDTO>) => {
        console.log('Selected district:', newValue);

        if (newValue) {
            form.setFieldValue('district', newValue.name); // Cập nhật giá trị của trường
            setNewCustomer(prev => ({ ...prev, district: newValue.id })); // Cập nhật id
            fetchWards(newValue.id); // Gọi API để lấy quận của tỉnh đã chọn
        } else {
            form.setFieldValue('district', ''); // Xử lý trường hợp không có giá trị
            setNewCustomer(prev => ({ ...prev, district: null }));
            setWards([]); // Xóa danh sách quận khi không chọn tỉnh
        }
    };


    const handleWardChange = (newValue: SingleValue<Ward> | null, form: FormikProps<CustomerDTO>) => {
        console.log('Selected ward:', newValue);

        if (newValue) {
            form.setFieldValue('ward', newValue.name); // Cập nhật giá trị của trường
            setNewCustomer(prev => ({ ...prev, ward: newValue.id }));
        } else {
            form.setFieldValue('ward', ''); // Xử lý trường hợp không có giá trị
            setNewCustomer(prev => ({ ...prev, ward: null }));
        }
    };





    const handleSubmit = async (values: CustomerDTO, { resetForm, setSubmitting }: FormikHelpers<CustomerDTO>) => {

        try {

            console.log(values.status)
            // Tìm tên tỉnh dựa trên ID và cập nhật values
            const selectedProvince = provinces.find(p => p.id === values.province);
            if (selectedProvince) {
                values.province = selectedProvince.name; // Cập nhật tên tỉnh
            }

            // Tìm tên quận dựa trên ID và cập nhật values
            const selectedDistrict = districts.find(d => d.id === values.district);
            if (selectedDistrict) {
                values.district = selectedDistrict.name; // Cập nhật tên quận
            }

            // Tìm tên phường/xã dựa trên ID và cập nhật values
            const selectedWard = wards.find(w => w.id === values.ward);
            if (selectedWard) {
                values.ward = selectedWard.name; // Cập nhật tên phường/xã
            }
            // Gửi yêu cầu POST tới API để lưu customer
            const response = await axios.post('http://localhost:8080/api/v1/customer/save', values);
            resetForm();
            if (response.status === 201) {
                navigate('/manage/customer');
            }
        } catch (error) {
            console.error('Error saving customer:', error);
            alert('Error saving customer. Please try again.');
        } finally {
            setSubmitting(false); // Kết thúc trạng thái submitting
        }
    };



    return (
        <Formik
            initialValues={initialCustomerState}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >

            {({ values, setFieldValue, touched, errors, resetForm, isSubmitting }) => (
                <Form>
                    <h1 className="text-center font-semibold text-2xl mb-4 text-transform: uppercase">Thêm khách hàng</h1>
                    <div className="bg-white p-6 shadow-md rounded-lg mb-6 w-full">
                        <h4 className="font-medium text-xl mb-4">Thông tin khách hàng</h4>
                        <div className="flex w-full">
                            <div className="w-full lg:w-1/2 pr-4">
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
                                            placeholder="Nhập tên khách hàng..."
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
                                            placeholder="Nhập email..."
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
                                            placeholder="Nhập số điện thoại..."
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
                                            placeholder="Chọn ngày sinh..."
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
                                            {({ field, form }: FieldProps) => (
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
                                </FormContainer>
                            </div>

                            <div className="w-full lg:w-1/2 pl-4">
                                <FormContainer>

                                    <FormItem
                                        asterisk
                                        label="Tỉnh/thành phố"
                                        invalid={errors.province && touched.province}
                                        errorMessage={errors.province}
                                    >


                                        <Field name="province">
                                            {({ field, form }: FieldProps<CustomerDTO>) => (
                                                <Select
                                                    isDisabled={loadingProvinces}
                                                    value={provinces.find(province => province.name === field.value)}
                                                    placeholder="Chọn tỉnh/thành phố..."
                                                    getOptionLabel={(option) => option.name} // Hiển thị tên tỉnh
                                                    getOptionValue={(option) => option.name} // Giá trị là tên của tỉnh
                                                    options={provinces} // Danh sách các tỉnh
                                                    onChange={(newValue: SingleValue<Province> | null) => handleProvinceChange(newValue, form)}
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
                                            {({ field, form }: FieldProps<CustomerDTO>) => (
                                                <Select
                                                    isDisabled={loadingDistricts}
                                                    value={districts.find(district => district.name === field.value) || null}
                                                    placeholder="Chọn quận huyện..."
                                                    getOptionLabel={(option) => option.name} // Hiển thị tên tỉnh
                                                    getOptionValue={(option) => option.name} // Giá trị là tên của tỉnh
                                                    options={districts} // Danh sách các tỉnh
                                                    onChange={(newValue: SingleValue<District> | null) => handleDistrictChange(newValue, form)}

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
                                            {({ field, form }: FieldProps<CustomerDTO>) => (
                                                <Select
                                                    isDisabled={loadingWards}
                                                    value={wards.find(ward => ward.name === field.value) || null}
                                                    placeholder="Chọn xã/phường/thị trấn..."
                                                    getOptionLabel={(option) => option.name} // Hiển thị tên tỉnh
                                                    getOptionValue={(option) => option.name} // Giá trị là tên của tỉnh
                                                    options={wards} // Danh sách các tỉnh
                                                    onChange={(newValue: SingleValue<Ward> | null) => handleWardChange(newValue, form)}

                                                />
                                            )}
                                        </Field>
                                    </FormItem>

                                    <FormItem
                                        asterisk
                                        label="Địa chỉ cụ thể"
                                        invalid={errors.detail && touched.detail}
                                        errorMessage={errors.detail}
                                    >
                                        <Field
                                            type="text"
                                            autoComplete="off"
                                            name="detail"
                                            placeholder="Nhập địa chỉ cụ thể..."
                                            component={Input}
                                        />
                                    </FormItem>

                                    <FormItem>
                                        <Button
                                            type="reset"
                                            className="ltr:mr-2 rtl:ml-2"
                                            disabled={isSubmitting} // vo hieu hoa nut khi gui du lieu
                                            onClick={() => resetForm()}
                                        >
                                            Tải lại
                                        </Button>
                                        <Button variant="solid" type="submit" disabled={isSubmitting}>
                                            Lưu
                                        </Button>
                                    </FormItem>
                                </FormContainer>
                            </div>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>

    )
}

/*BEGIN:  Mã tự động GEN */

// const removeVietnameseTones = (str: string): string => {
//     str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
//     str = str.replace(/đ/g, 'd').replace(/Đ/g, 'D');
//     return str;
// };

// const generateRandomCodeCustomer = (full_name: string = ''): string => {
//     const nameStringDefault = 'defaultcustomer';

//     if (!full_name || typeof full_name !== 'string') {
//         const randomMa = Math.floor(10000 + Math.random() * 90000).toString();
//         return `${nameStringDefault}NV${randomMa}`;
//     }

//     full_name = removeVietnameseTones(full_name);
//     const nameParts = full_name.split(' ');

//     const last_name = nameParts[0].charAt(0); // Chữ cái đầu của họ
//     const middle_name = nameParts.length > 2 ? nameParts.slice(1, -1).map(part => part.charAt(0)).join('') : ''; // Chữ cái đầu của tên đệm, nếu có
//     const name = nameParts[nameParts.length - 1]; // Tên

//     const nameInitials = name.toLowerCase() + last_name.toLowerCase() + middle_name.toLowerCase();

//     const randomCode = Math.floor(10000 + Math.random() * 90000).toString(); // 5 số ngẫu nhiên

//     return `${nameInitials}NV${randomCode}`;
// };

/*END:   Mã tự động GEN */

export default AddCustomer;