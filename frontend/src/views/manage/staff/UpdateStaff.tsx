import React, { useState, useEffect } from 'react';
import { Snackbar } from '@mui/material';
import { Formik, Field, Form, FormikHelpers, FieldProps, useFormikContext, FormikProps } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import { FormItem, FormContainer } from '@/components/ui/Form';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import DatePicker from '@/components/ui/DatePicker';
import Radio from '@/components/ui/Radio';
import Select from '@/components/ui/Select';
import { toast } from 'react-toastify';
import { SingleValue } from 'react-select';
import { RxReset } from "react-icons/rx";
import { GrUpdate } from "react-icons/gr";
import instance from "@/axios/CustomAxios";
interface Staff {
    id: string;
    code: string;
    name: string;
    email: string;
    phone: string;
    citizenId: string;
    address: string;
    province: string | null;
    district: string | null;
    ward: string | null;
    status: string;
    note: string;
    birthDay: string;
    gender?: boolean;
    deleted?: boolean;
    password: string;
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

const initialStaffState: Staff = {
    id: '',
    code: '',
    name: '',
    email: '',
    phone: '',
    citizenId: '',
    address: '',
    province: null,
    district: null,
    ward: null,
    status: 'active',
    note: '',
    birthDay: '',
    gender: true,
    password: '',
    deleted: false,
};

const validationSchema = Yup.object({
    name: Yup.string()
        .matches(/^[\p{L}]+(?: [\p{L}]+)*$/u, "Họ tên không hợp lệ") // Chấp nhận chữ cái và khoảng trắng
        .min(2, "Họ tên phải có ít nhất 2 ký tự") // Tối thiểu 2 ký tự
        .max(50, "Họ tên không được vượt quá 50 ký tự") // Tối đa 50 ký tự
        .required("Họ tên nhân viên là bắt buộc"), // Bắt buộc nhập
    citizenId: Yup.string()
        .matches(/^[0-9]+$/, "Căn cước công dân chỉ được chứa số") // Chỉ chứa số
        .required("Căn cước công dân là bắt buộc"),
    email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),

    birthDay: Yup.date()
        .required("Ngày sinh là bắt buộc")
        .max(new Date(), "Ngày sinh không được là tương lai")
        .test(
            "age-range",
            "Nhân viên phải trong độ tuổi từ 16 đến 40",
            function (value) {
                const age = dayjs().diff(dayjs(value), 'year'); // Tính tuổi
                return age >= 16 && age <= 40; // Kiểm tra độ tuổi
            }
        ),
    address: Yup.string().required("Số nhà là bắt buộc"),
    phone: Yup.string()
        .required("Số điện thoại là bắt buộc")
        .matches(/^(0[3|5|7|8|9]|01[2|6|8|9])\d{8}$/, "Số điện thoại không hợp lệ") // Đảm bảo định dạng số điện thoại
        .matches(/^[0-9]+$/, "Số điện thoại không được chứa chữ"), // Kiểm tra chỉ chứa số


    province: Yup.string().required("Tỉnh/Thành phố là bắt buộc"),
    district: Yup.string().required("Quận/Huyện là bắt buộc"),
    ward: Yup.string().required("Phường/Xã là bắt buộc"),
    note: Yup.string(),
    gender: Yup.boolean().required("Giới tính là bắt buộc"),
});

const UpdateStaffPage = () => {
    const [staff, setStaff] = useState<Staff>(initialStaffState);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingWards, setLoadingWards] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id) {
            fetchStaff(id);
        }
        fetchProvinces();
    }, [id]);

    useEffect(() => {
        if (staff.province && provinces.length > 0) {
            const province = provinces.find((prov) => prov.full_name === staff.province);
            if (province) {
                fetchDistricts(province.id);
            } else {
                setDistricts([]);
            }
        }
    }, [staff.province, provinces]);

    useEffect(() => {
        if (staff.district && districts.length > 0) {
            const district = districts.find((dist) => dist.full_name === staff.district);
            if (district) {
                fetchWards(district.id);
            } else {
                setWards([]);
            }
        }
    }, [staff.district, districts]);

    const fetchProvinces = async () => {
        setLoadingProvinces(true);
        try {
            const response = await axios.get('https://esgoo.net/api-tinhthanh/1/0.htm');
            if (response.data.error === 0) {
                setProvinces(response.data.data);
            } else {
                toast.error(`Error loading provinces: ${response.data.message}`);
            }
        } catch (error) {
            toast.error('Failed to load provinces.');
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
            // console.error('Error fetching districts:', error);
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
            // console.error('Error fetching wards:', error);
            setWards([]);
        } finally {
            setLoadingWards(false);
        }
    };

    const fetchStaff = async (id: string) => {
        try {
            const response = await instance.get(`/staffs/${id}`);
            const fetchedStaff = response.data;
            setStaff({
                ...fetchedStaff,
                birthDay: dayjs(fetchedStaff.birthDay, 'DD-MM-YYYY').format('YYYY-MM-DD')
            });
        } catch (error) {
            // console.error('Error fetching staff:', error);
        }
    };



    const handleLocationChange = (
        type: 'province' | 'district' | 'ward',
        newValue: Province | District | Ward | null,
        form: FormikProps<Staff>
    ) => {
        if (newValue) {
            if (type === 'province') {
                form.setFieldValue('province', newValue.full_name);
                form.setFieldValue('district', '');
                form.setFieldValue('ward', '');
                setStaff((prev) => ({ ...prev, province: newValue.full_name, district: null, ward: null }));
                fetchDistricts(newValue.id);
            } else if (type === 'district') {
                form.setFieldValue('district', newValue.full_name);
                form.setFieldValue('ward', '');
                setStaff((prev) => ({ ...prev, district: newValue.full_name, ward: null }));
                fetchWards(newValue.id);
            } else if (type === 'ward') {
                form.setFieldValue('ward', newValue.full_name);
                setStaff((prev) => ({ ...prev, ward: newValue.full_name }));
            }
        }
    };

    const handleSubmit = async (values: Staff, { resetForm, setSubmitting }: FormikHelpers<Staff>) => {
        try {
            const formattedValues = {
                ...values,
                birthDay: values.birthDay ? dayjs(values.birthDay).format('YYYY-MM-DD') : '',
            };

            await instance.put(`/staffs/${id}`, formattedValues);
            resetForm();
            toast.success('Nhân viên đã được cập nhật thành công.');
            navigate('admin/manage/staff');
        } catch (error) {
            const errorMessage = axios.isAxiosError(error)
                ? error.response?.data?.message || error.message
                : error instanceof Error ? error.message : 'Có lỗi xảy ra';
            toast.error(`Lỗi cập nhật nhân viên. ${errorMessage}`);
        } finally {
            setSubmitting(false);
        }
    };



    const handleReset = (resetForm: () => void) => {
        resetForm();
        setStaff(initialStaffState);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const SyncFormikWithStaff = () => {
        const formik = useFormikContext<Staff>();

        useEffect(() => {
            formik.setValues(staff);
        }, [staff]);

        return null;
    };

    return (
        <div>

            {/* <h1 className="text-center font-semibold text-2xl mb-4 text-uppercase">Cập nhật nhân viên</h1> */}
            <div className="bg-white p-6 shadow-md rounded-lg mb-6 w-full">
                <p className="text-left text-xl font-bold mx-auto mb-2">CẬP NHẬT NHÂN VIÊN</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                </div>
                <Formik
                    initialValues={staff}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize={true}
                >
                    {({ errors, touched, resetForm, setFieldValue, values,isSubmitting }) => (
                        <Form>
                            <SyncFormikWithStaff />
                            <FormContainer>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                                    <div style={{ flex: '1 1 300px', minWidth: '200px' }}>
                                        <FormItem asterisk label="Họ tên nhân viên">
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="name"
                                                placeholder="Nhập họ tên nhân viên..."
                                                component={Input}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    setFieldValue('name', e.target.value);
                                                    setStaff((prev) => ({ ...prev, name: e.target.value }));
                                                }}
                                            />
                                            {touched.name && errors.name && (
                                                <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem', minHeight: '20px' }}>
                                                    {errors.name}
                                                </div>
                                            )}
                                        </FormItem>
                                        <FormItem asterisk label="Căn cước công dân">
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="citizenId"
                                                placeholder="Nhập căn cước công dân..."
                                                component={Input}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    setFieldValue('citizenId', e.target.value);
                                                    setStaff((prev) => ({ ...prev, citizenId: e.target.value }));
                                                }}
                                            />
                                            {touched.citizenId && errors.citizenId && (
                                                <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem', minHeight: '20px' }}>
                                                    {errors.citizenId}
                                                </div>
                                            )}
                                        </FormItem>
                                        <FormItem
                                            asterisk
                                            label="Ngày sinh"
                                            invalid={errors.birthDay && touched.birthDay}
                                            errorMessage={errors.birthDay}
                                        >
                                            <DatePicker
                                                inputtable
                                                inputtableBlurClose={false}
                                                placeholder="Chọn ngày sinh..."
                                                // Chuyển đổi giá trị birthDay từ Formik sang đối tượng Date cho DatePicker
                                                value={values.birthDay ? dayjs(values.birthDay, 'YYYY-MM-DD').toDate() : null}
                                                onChange={(date) => {
                                                    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : '';
                                                    setFieldValue('birthDay', formattedDate); // Cập nhật giá trị vào Formik
                                                }}
                                                // Ngăn người dùng chọn ngày tương lai
                                                disableDate={(current) => dayjs(current).isAfter(dayjs().endOf('day'))}
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
                                                            checked={staff.gender === true}
                                                            onChange={() => {
                                                                form.setFieldValue('gender', true);
                                                                setStaff((prev) => ({ ...prev, gender: true }));
                                                            }}
                                                        >
                                                            Nam
                                                        </Radio>
                                                        <Radio
                                                            value="Nữ"
                                                            checked={staff.gender === false}
                                                            onChange={() => {
                                                                form.setFieldValue('gender', false);
                                                                setStaff((prev) => ({ ...prev, gender: false }));
                                                            }}
                                                        >
                                                            Nữ
                                                        </Radio>
                                                    </>
                                                )}
                                            </Field>
                                        </FormItem>
                                    </div>
                                    <div style={{ flex: '1 1 300px', minWidth: '200px' }}>
                                        <FormItem asterisk label="Tỉnh/Thành phố">
                                            <Field name="province">
                                                {({ field, form }: FieldProps<string>) => (
                                                    <Select
                                                        isDisabled={loadingProvinces}
                                                        value={provinces.find((prov) => prov.full_name === field.value) || null}
                                                        placeholder="Chọn tỉnh/thành phố..."
                                                        getOptionLabel={(option) => option.full_name}
                                                        getOptionValue={(option) => option.full_name}
                                                        options={provinces}
                                                        onChange={(newValue: SingleValue<Province> | null) => {
                                                            handleLocationChange('province', newValue, form);
                                                        }}
                                                        onBlur={() => form.setFieldTouched('province', true)}
                                                    />
                                                )}
                                            </Field>
                                        </FormItem>
                                        <FormItem asterisk label="Quận/huyện">
                                            <Field name="district">
                                                {({ field, form }: FieldProps<string>) => (
                                                    <Select
                                                        isDisabled={loadingDistricts || !staff.province}
                                                        value={districts.find((dist) => dist.full_name === field.value) || null}
                                                        placeholder="Chọn quận/huyện..."
                                                        getOptionLabel={(option) => option.full_name || option.name}
                                                        getOptionValue={(option) => option.id}
                                                        options={districts}
                                                        onChange={(newValue: SingleValue<District> | null) => {
                                                            handleLocationChange('district', newValue, form);
                                                        }}
                                                        onBlur={() => form.setFieldTouched('district', true)}
                                                    />
                                                )}
                                            </Field>
                                        </FormItem>
                                        <FormItem asterisk label="Xã/phường/thị trấn">
                                            <Field name="ward">
                                                {({ field, form }: FieldProps<string>) => (
                                                    <Select
                                                        isDisabled={loadingWards || !staff.district}
                                                        value={wards.find((ward) => ward.full_name === field.value) || null}
                                                        placeholder="Chọn xã/phường/thị trấn..."
                                                        getOptionLabel={(option) => option.full_name}
                                                        getOptionValue={(option) => option.full_name}
                                                        options={wards}
                                                        onChange={(newValue: SingleValue<Ward> | null) => {
                                                            handleLocationChange('ward', newValue, form);
                                                        }}
                                                        onBlur={() => form.setFieldTouched('ward', true)}
                                                    />
                                                )}
                                            </Field>
                                        </FormItem>
                                        <FormItem
                                            asterisk
                                            label="Địa chỉ"
                                            invalid={!!errors.address && touched.address}
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="address"
                                                placeholder="Nhập địa chỉ..."
                                                component={Input}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    setFieldValue('address', e.target.value);
                                                    setStaff((prev) => ({ ...prev, address: e.target.value }));
                                                }}
                                            />
                                            {touched.address && errors.address && (
                                                <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem', minHeight: '20px' }}>
                                                    {errors.address}
                                                </div>
                                            )}
                                        </FormItem>
                                    </div>
                                    <div style={{ flex: '1 1 300px', minWidth: '200px' }}>
                                        <FormItem asterisk label="Số điện thoại">
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="phone"
                                                placeholder="Nhập số điện thoại..."
                                                component={Input}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    setFieldValue('phone', e.target.value);
                                                    setStaff((prev) => ({ ...prev, phone: e.target.value }));
                                                }}
                                            />
                                            {touched.phone && errors.phone && (
                                                <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem', minHeight: '20px' }}>
                                                    {errors.phone}
                                                </div>
                                            )}
                                        </FormItem>
                                        <FormItem asterisk label="Email">
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="email"
                                                placeholder="Nhập email..."
                                                component={Input}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    setFieldValue('email', e.target.value);
                                                    setStaff((prev) => ({ ...prev, email: e.target.value }));
                                                }}
                                            />
                                            {touched.email && errors.email && (
                                                <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem', minHeight: '20px' }}>
                                                    {errors.email}
                                                </div>
                                            )}
                                        </FormItem>
                                        <FormItem label="Ghi chú">
                                            <Field
                                                as={Input}
                                                name="note"
                                                placeholder="Nhập ghi chú"
                                                textArea
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    setFieldValue('note', e.target.value);
                                                    setStaff((prev) => ({ ...prev, note: e.target.value }));
                                                }}
                                                style={{ height: '150px' }} // Điều chỉnh chiều cao

                                            />
                                        </FormItem>
                                    </div>
                                </div>
                                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center' }}>
                                    <Button
                                        type="submit"
                                        className="flex items-center justify-center"
                                        variant="solid"
                                        color="blue-600"
                                        disabled={isSubmitting}
                                        style={{
                                            height: '40px',
                                            width: '200px',
                                            marginRight: '15px', // Khoảng cách giữa hai nút
                                            lineHeight: '40px', // Căn chỉnh văn bản theo chiều dọc
                                            padding: '0', // Đảm bảo không có padding dư thừa
                                        }}
                                    >
                                        <GrUpdate className="mr-2" style={{ fontSize: '20px' }} />
                                        Cập Nhật
                                    </Button>

                                    <Button
                                        type="button"
                                        onClick={() => handleReset(resetForm)}
                                        className="flex items-center justify-center"
                                        style={{
                                            height: '40px', // Chiều cao đồng nhất
                                            width: '110px',
                                            lineHeight: '40px', // Căn chỉnh văn bản theo chiều dọc
                                            padding: '0', // Đảm bảo không có padding dư thừa
                                            fontSize: '15px'
                                        }}
                                    >
                                        <RxReset className="mr-2" style={{ fontSize: '18px' }} /> {/* Tăng kích thước biểu tượng nếu cần */}
                                        Đặt lại
                                    </Button>
                                </div>
                            </FormContainer>
                        </Form>
                    )}
                </Formik>
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={handleSnackbarClose}
                    message={snackbarMessage}
                />
            </div>
        </div>
    );
};

export default UpdateStaffPage;