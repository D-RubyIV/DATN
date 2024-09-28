import React, { useEffect, useState } from "react";
import axios from "axios";
import * as Yup from 'yup';
import { FormItem, FormContainer } from '@/components/ui/Form';
import { Field, FieldProps, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import Button from '@/components/ui/Button';
import { Input, Radio, Select } from "@/components/ui";
import DatePicker from '@/components/ui/DatePicker';
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

const validationSchema = Yup.object({
    name: Yup.string().required('Họ tên khách hàng là bắt buộc'),
    email: Yup.string()
        .email("Email không hợp lệ")
        .required("Email là bắt buộc"),
    phone: Yup.string()
        .required("Số điện thoại là bắt buộc")
        .matches(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/, "Số điện thoại không hợp lệ"),
    birthDate: Yup.date()
        .required("Ngày sinh là bắt buộc")
        .max(new Date(), "Ngày sinh không được là tương lai")
        .test(
            "age-range",
            "Tuổi khách hàng không hợp lệ",
            function (value) {
                const age = dayjs().diff(dayjs(value), 'year');
                return age >= 5 && age <= 100;
            }
        ),
    gender: Yup.string()
        .required('Vui lòng chọn giới tính')
        .oneOf(['Nam', 'Nữ'], 'Giới tính không hợp lệ'),
    province: Yup.string().required("Tỉnh/Thành phố là bắt buộc"),
    district: Yup.string().required("Quận/Huyện là bắt buộc"),
    ward: Yup.string().required("Phường/Xã là bắt buộc"),
    detail: Yup.string().required('Địa chỉ chi tiết là bắt buộc'),
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
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingWards, setLoadingWards] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchProvinces();
    }, []);

    useEffect(() => {
        if (newCustomer.province && provinces.length > 0) {
            const province = provinces.find((prov) => prov.full_name === newCustomer.province);
            if (province) {
                fetchDistricts(province.id);
            } else {
                setDistricts([]);
            }
        }
    }, [newCustomer.province, provinces]);

    useEffect(() => {
        if (newCustomer.district && districts.length > 0) {
            const district = districts.find((dist) => dist.full_name === newCustomer.district);
            if (district) {
                fetchWards(district.id);
            } else {
                setWards([]);
            }
        }
    }, [newCustomer.district, districts]);

    const fetchProvinces = async () => {
        setLoadingProvinces(true);
        try {
            const response = await axios.get("https://esgoo.net/api-tinhthanh/1/0.htm");
            if (response.data.error === 0) {
                setProvinces(response.data.data);
            } else {
                setProvinces([]);
            }
        } catch (error) {
            setProvinces([]);
        } finally {
            setLoadingProvinces(false);
        }
    };

    const fetchDistricts = async (provinceId: string) => {
        setLoadingDistricts(true);
        try {
            const response = await axios.get(`https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`);
            if (response.data.error === 0) {
                setDistricts(response.data.data);
            } else {
                setDistricts([]);
            }
        } catch (error) {
            setDistricts([]);
        } finally {
            setLoadingDistricts(false);
        }
    };

    const fetchWards = async (districtId: string) => {
        setLoadingWards(true);
        try {
            const response = await axios.get(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`);
            if (response.data.error === 0) {
                setWards(response.data.data);
            } else {
                setWards([]);
            }
        } catch (error) {
            setWards([]);
        } finally {
            setLoadingWards(false);
        }
    };

    const handleLocationChange = (
        type: 'province' | 'district' | 'ward',
        newValue: Province | District | Ward | null,
        form: FormikProps<CustomerDTO>
    ) => {
        if (newValue) {
            if (type === 'province') {
                form.setFieldValue('province', newValue.full_name);
                form.setFieldValue('district', '');
                form.setFieldValue('ward', '');
                setNewCustomer((prev) => ({ ...prev, province: newValue.full_name, district: null, ward: null }));
                fetchDistricts(newValue.id);
            } else if (type === 'district') {
                form.setFieldValue('district', newValue.full_name);
                form.setFieldValue('ward', '');
                setNewCustomer((prev) => ({ ...prev, district: newValue.full_name, ward: null }));
                fetchWards(newValue.id);
            } else if (type === 'ward') {
                form.setFieldValue('ward', newValue.full_name);
                setNewCustomer((prev) => ({ ...prev, ward: newValue.full_name }));
            }
        }
    }

    const handleSubmit = async (values: CustomerDTO, { resetForm, setSubmitting }: FormikHelpers<CustomerDTO>) => {
        try {
            const formattedValues = {
                ...values,
                birthDate: dayjs(values.birthDate).format('DD-MM-YYYY'), // Định dạng lại birthDate
            };

            console.log('Submitting formatted values:', formattedValues);

            const response = await axios.post('http://localhost:8080/api/v1/customer/save', formattedValues);
            resetForm();
            if (response.status === 201) {
                navigate('/manage/customer');
            }
        } catch {

            setSubmitting(false);
        }

    };

    return (
        <Formik
            initialValues={initialCustomerState}
            validationSchema={validationSchema}
            enableReinitialize={true}
            onSubmit={handleSubmit}
        >
            {({ setFieldValue, touched, errors, resetForm, isSubmitting }) => (
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
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setFieldValue("name", e.target.value);
                                                setNewCustomer((prev) => ({ ...prev, name: e.target.value }));
                                            }}
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
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setFieldValue("email", e.target.value);
                                                setNewCustomer((prev) => ({ ...prev, email: e.target.value }));
                                            }}
                                        />
                                    </FormItem>

                                    <FormItem
                                        asterisk
                                        label="Số điện thoại"
                                        invalid={errors.phone && touched.phone}
                                        errorMessage={errors.phone}
                                    >
                                        <Field
                                            type="text"
                                            autoComplete="off"
                                            name="phone"
                                            placeholder="Nhập số điện thoại..."
                                            component={Input}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setFieldValue("phone", e.target.value);
                                                setNewCustomer((prev) => ({ ...prev, phone: e.target.value }));
                                            }}
                                        />
                                    </FormItem>

                                    <FormItem
                                        asterisk
                                        label="Ngày sinh"
                                        invalid={errors.birthDate && touched.birthDate}
                                        errorMessage={errors.birthDate}
                                    >
                                        <DatePicker
                                            inputtable
                                            inputtableBlurClose={false}
                                            placeholder="Chọn ngày sinh..."
                                            value={newCustomer.birthDate ? dayjs(newCustomer.birthDate, 'YYYY-MM-DD').toDate() : null}
                                            onChange={(date) => {
                                                if (date) {
                                                    const formattedDate = dayjs(date).format('YYYY-MM-DD');
                                                    setFieldValue('birthDate', formattedDate);
                                                    setNewCustomer((prev) => ({
                                                        ...prev,
                                                        birthDate: formattedDate
                                                    }));
                                                } else {
                                                    setFieldValue('birthDate', '');
                                                    setNewCustomer((prev) => ({
                                                        ...prev,
                                                        birthDate: ''
                                                    }));
                                                }
                                            }}
                                        />
                                    </FormItem>

                                    <FormItem asterisk label="Giới tính">
                                        <Field name="gender">
                                            {({ field, form }: FieldProps) => (
                                                <>
                                                    <Radio
                                                        className="mr-4"
                                                        value="Nam"
                                                        checked={field.value === 'Nam'}
                                                        onChange={() => form.setFieldValue('gender', 'Nam')}
                                                        onBlur={() => form.setFieldTouched('gender', true)}
                                                    >
                                                        Nam
                                                    </Radio>
                                                    <Radio
                                                        value="Nữ"
                                                        checked={field.value === 'Nữ'}
                                                        onChange={() => form.setFieldValue('gender', 'Nữ')}
                                                        onBlur={() => form.setFieldTouched('gender', true)}
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
                                            {({ form }: FieldProps<CustomerDTO>) => (
                                                <Select
                                                    isDisabled={loadingProvinces}
                                                    value={provinces.find(prov => prov.full_name === newCustomer.province) || null}
                                                    placeholder="Chọn tỉnh/thành phố..."
                                                    getOptionLabel={(option) => option.full_name}
                                                    getOptionValue={(option) => option.full_name}
                                                    options={provinces}
                                                    onChange={(newValue: SingleValue<Province> | null) => {
                                                        handleLocationChange("province", newValue, form);
                                                        form.setFieldValue("province", newValue ? newValue.full_name : "");
                                                        setNewCustomer((prev) => ({ ...prev, province: newValue ? newValue.full_name : "" }));
                                                    }}
                                                    onBlur={() => form.setFieldTouched("province", true)}
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
                                            {({ form }: FieldProps<CustomerDTO>) => (
                                                <Select
                                                    isDisabled={loadingDistricts}
                                                    value={districts.find(dist => dist.full_name === newCustomer.district) || null}
                                                    placeholder="Chọn quận/huyện..."
                                                    getOptionLabel={(option) => option.full_name}
                                                    getOptionValue={(option) => option.full_name}
                                                    options={districts}
                                                    onChange={(newValue: SingleValue<District> | null) => {
                                                        handleLocationChange("district", newValue, form);
                                                        form.setFieldValue("district", newValue ? newValue.full_name : "");
                                                        setNewCustomer((prev) => ({ ...prev, district: newValue ? newValue.full_name : "" }));
                                                    }}
                                                    onBlur={() => form.setFieldTouched("district", true)}
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                    <FormItem
                                        asterisk
                                        label="Xã/phường/thị trấn"
                                        invalid={errors.ward && touched.ward}
                                        errorMessage={errors.ward}
                                    >
                                        <Field name="ward">
                                            {({ form }: FieldProps<CustomerDTO>) => (
                                                <Select
                                                    isDisabled={loadingWards}
                                                    value={wards.find(ward => ward.full_name === newCustomer.ward) || null}
                                                    placeholder="Chọn xã/phường/thị trấn..."
                                                    getOptionLabel={(option) => option.full_name}
                                                    getOptionValue={(option) => option.full_name}
                                                    options={wards}
                                                    onChange={(newValue: SingleValue<Ward> | null) => {
                                                        handleLocationChange("ward", newValue, form);
                                                        form.setFieldValue("ward", newValue ? newValue.full_name : "");
                                                        setNewCustomer((prev) => ({ ...prev, ward: newValue ? newValue.full_name : "" }));
                                                    }}
                                                    onBlur={() => form.setFieldTouched("ward", true)}
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
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setFieldValue("detail", e.target.value);
                                                setNewCustomer((prev) => ({ ...prev, detail: e.target.value }));
                                            }}
                                        />
                                    </FormItem>
                                    <FormItem>
                                        <Button
                                            type="reset"
                                            className="ltr:mr-2 rtl:ml-2"
                                            disabled={isSubmitting}
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
    );
}

export default AddCustomer;