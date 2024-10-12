import { useState, useEffect } from 'react';
import { Button, Input, Radio, Select, Switcher } from '@/components/ui';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { FormItem, FormContainer } from '@/components/ui/Form';
import { Field, FieldArray, FieldProps, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import DatePicker from '@/components/ui/DatePicker';
import axios from 'axios';
import dayjs from 'dayjs';
import { SingleValue } from 'react-select';
import { toast } from 'react-toastify';


// Types
type CustomerDetailDTO = {
    id: string;
    code: string;
    name: string;
    email: string;
    phone: string;
    birthDate: string;
    gender: string;
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
    isDefault: boolean;
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
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string().required('Phone is required'),
    birthDate: Yup.string().required('Birthdate is required'),
    addressDTOS: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required('Address name is required'),
            phone: Yup.string().required('Address phone is required'),
            province: Yup.string().required('Province is required'),
            district: Yup.string().required('District is required'),
            ward: Yup.string().required('Ward is required'),
            detail: Yup.string().required('Detail address is required'),
            isDefault: Yup.boolean().required('Is default is required'),
        })
    ),
});

const UpdateCustomer = () => {
    const initialAddressDTO: AddressDTO = {
        id: '',
        name: '',
        phone: '',
        province: null,
        district: null,
        ward: null,
        detail: '',
        isDefault: false,
    };

    const initialCustomerState: CustomerDetailDTO = {
        id: '',
        code: '',
        name: '',
        email: '',
        phone: '',
        birthDate: '',
        gender: '',
        addressDTOS: [initialAddressDTO],
        status: '',
    };

    const [updateCustomer, setUpdateCustomer] = useState<CustomerDetailDTO>(initialCustomerState);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const navigate = useNavigate();
    const { id } = useParams();
    const [formModes, setFormModes] = useState<string[]>([]);

    useEffect(() => {
        if (id) {
            fetchCustomer(id);
        }
        loadProvinces();
    }, [id]);

    useEffect(() => {
        if (updateCustomer.addressDTOS.length > 0) {
            const newDistricts: District[] = [];
            const newWards: Ward[] = []; // Lưu trữ các phường được lấy cho mỗi địa chỉ

            // Lấy các quận và phường cho mỗi địa chỉ
            const fetchAddressesData = async () => {
                await Promise.all(
                    updateCustomer.addressDTOS.map(async (address) => {
                        // Lấy các quận của tỉnh
                        if (address.province) {
                            const province = provinces.find((prov) => prov.full_name === address.province);
                            if (province) {
                                const districtsData = await fetchDistricts(province.id);
                                newDistricts.push(...districtsData); // Thêm các quận đã lấy
                            }
                        }

                        // Lấy phường cho quận
                        if (address.district) {
                            const district = newDistricts.find((dist) => dist.full_name === address.district);
                            if (district) {
                                const wardsData = await fetchWards(district.id);
                                newWards.push(...wardsData); // Thêm các phường đã lấy
                            }
                        }
                    })
                );
                // Cập nhật trạng thái sau khi tất cả các lần truy xuất hoàn tất
                setDistricts(newDistricts);
                setWards(newWards);
            };

            fetchAddressesData();
        }
    }, [updateCustomer, provinces]);





    // API calls
    const fetchCustomer = async (id: string) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/customer/${id}`);
            if (response.status === 200) {
                setUpdateCustomer(response.data);
                console.log('Customer data:', response.data);
                setFormModes(response.data.addressDTOS.map(() => 'edit'));
            } else {
                console.error('Failed to fetch customer data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching customer data:', error);
        }
    };

    const fetchProvinces = async () => {
        const response = await axios.get('https://esgoo.net/api-tinhthanh/1/0.htm');
        if (response.data.error === 0) {
            return response.data.data;
        } else {
            console.error('Error fetching provinces:', response.data);
            return [];
        }
    };

    const fetchDistricts = async (provinceId: string) => {
        const response = await axios.get(`https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`);
        if (response.data.error === 0) {
            return response.data.data;
        } else {
            console.error('Error fetching districts:', response.data);
            return [];
        }
    };

    const fetchWards = async (districtId: string) => {
        const response = await axios.get(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`);
        if (response.data.error === 0) {
            return response.data.data;
        } else {
            console.error('Error fetching wards:', response.data);
            return [];
        }
    };

    const handleLocationChange = async (
        type: 'province' | 'district' | 'ward',
        newValue: Province | District | Ward | null,
        form: FormikProps<CustomerDetailDTO>,
        index: number
    ) => {
        // Cập nhật giá trị của tỉnh, quận hoặc xã trong state
        form.setFieldValue(`addressDTOS[${index}].${type}`, newValue ? newValue.full_name : '');

        if (type === 'province' && newValue) {
            // Nếu chọn tỉnh, gọi API lấy danh sách quận
            const districtsData = await fetchDistricts(newValue.id);
            setDistricts(districtsData);

            // Reset ward khi tỉnh thay đổi
            setWards([]);
        } else if (type === 'district' && newValue) {
            // Nếu chọn quận, gọi API lấy danh sách xã
            const wardsData = await fetchWards(newValue.id);
            setWards(wardsData);
        }
    };




    const loadProvinces = async () => {
        const cachedProvinces = localStorage.getItem('provinces');
        if (cachedProvinces) {
            setProvinces(JSON.parse(cachedProvinces));
        } else {
            const data = await fetchProvinces();
            setProvinces(data);
            localStorage.setItem('provinces', JSON.stringify(data));
        }
    };

    const handleUpdate = async (values: CustomerDetailDTO, { setSubmitting }: FormikHelpers<CustomerDetailDTO>) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/v1/customer/update/${values.id}`, values);
            if (response.status === 200) {
                toast.success('Cập nhật thành công');
                navigate('/manage/customer');
            } else {
                alert('Failed to update customer. Please try again.');
            }
        } catch (error) {
            console.error('Error updating customer:', error);
            alert('Error updating customer. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // const handleAddressSubmit = async (
    //     mode: 'add' | 'edit',
    //     address: AddressDTO,
    //     customerId: string,
    //     addressIndex: number,
    //     setFieldValue: (field: string, value: any) => void,
    //     values: FormikValues
    // ) => {
    //     try {
    //         let response;

    //         if (mode === 'add') {
    //             // Gửi yêu cầu POST để thêm địa chỉ
    //             response = await axios.post(`http://localhost:8080/api/v1/customer/${customerId}/address`, address);
    //             if (response.status === 200) {
    //                 // Cập nhật danh sách địa chỉ để địa chỉ mới hiển thị ở đầu
    //                 setFieldValue('addressDTOS', [response.data, ...values.addressDTOS]); // Giả sử response.data chứa địa chỉ vừa tạo
    //                 setFormModes((prev) => prev.map((m, i) => (i === addressIndex ? 'edit' : m))); // Cập nhật chế độ thành 'edit'
    //                 toast.success('Lưu thành công');
    //             }
    //         } else {
    //             // Gửi yêu cầu PUT để cập nhật địa chỉ
    //             response = await axios.put(`http://localhost:8080/api/v1/address/update/${customerId}`, address);
    //             if (response.status === 200) {
    //                 // Cập nhật danh sách địa chỉ (thay thế địa chỉ đã sửa)
    //                 const updatedAddresses = [...values.addressDTOS];
    //                 updatedAddresses[addressIndex] = address; // Cập nhật địa chỉ đã sửa
    //                 setFieldValue('addressDTOS', updatedAddresses);
    //                 toast.success('Cập nhật thành công');
    //             }
    //         }

    //         // Tải lại thông tin khách hàng (có thể là để lấy danh sách địa chỉ mới)
    //         fetchCustomer(customerId);
    //     } catch (error) {
    //         console.error('Error submitting address:', error);
    //         alert('Error submitting address. Please try again.');
    //     }
    // };


    // hàm thêm mới địa chỉ cho 1 khách hàng
    const handleAddressSubmit = async (
        mode: 'add' | 'edit',
        address: AddressDTO,
        addressId: string,
        customerId: string,
        addressIndex: number
    ) => {
        try {
            let response;
            if (mode === 'add') {
                response = await axios.post(`http://localhost:8080/api/v1/customer/${customerId}/address`, address);
                if (response.status === 200) {
                    setFormModes((prev) => prev.map((m, i) => (i === addressIndex ? 'edit' : m)));
                }
                toast.success('Thêm địa chỉ mới thành công');
            } else {
                response = await axios.put(`http://localhost:8080/api/v1/address/update/${addressId}`, address);
                toast.success('Cập nhật địa chỉ thành công');
            }
            fetchCustomer(customerId);
        } catch (error) {
            console.error('Error submitting address:', error);
            alert('Error submitting address. Please try again.');
        }
    };

    // Hàm cập nhật địa chỉ mặc định
    const updateDefaultAddress = async (addressId: string, isDefault: boolean) => {
        try {
            console.log('Updating address ID:', addressId, 'to default:', isDefault);
            const response = await axios.put(
                `http://localhost:8080/api/v1/customer/${addressId}/default`,
                null,
                {
                    params: {
                        customerId: updateCustomer.id,
                        isDefault: isDefault,
                    },
                }
            );
            if (response.status === 200) {
                console.log('Địa chỉ đã được cập nhật thành công:', response.data);
                fetchCustomer(updateCustomer.id); // Lấy lại dữ liệu khách hàng để cập nhật giao diện
            } else {
                console.error('Cập nhật địa chỉ không thành công:', response.statusText);
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật địa chỉ:', error);
        }
    };


    // Hàm xử lý thay đổi của Switcher
    const handleSwitcherChange = async (index: number, checked: boolean) => {
        try {
            // Đặt địa chỉ được chọn làm mặc định
            const updatedAddresses = updateCustomer.addressDTOS.map((address, i) => ({
                ...address,
                isDefault: i === index ? true : false, // Chỉ có địa chỉ tại index được đặt mặc định
            }));

            // Cập nhật địa chỉ trong state (tạm thời)
            setUpdateCustomer({ ...updateCustomer, addressDTOS: updatedAddresses });
            toast.success('cập nhật địa chỉ mặc định thành công');
            // Gọi API chỉ một lần để cập nhật địa chỉ mặc định và các địa chỉ khác
            await updateDefaultAddress(updateCustomer.addressDTOS[index].id, true);
        } catch (error) {
            console.error('Lỗi khi cập nhật địa chỉ mặc định:', error);
        }
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
                    <div className='w-full bg-white p-6 shadow-md rounded-lg'>
                        <h1 className="text-center font-semibold text-2xl mb-4 uppercase">Cập nhật khách hàng</h1>
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="w-full lg:w-1/3 bg-white p-6 shadow-md rounded-lg">
                                <h4 className="font-medium text-xl mb-4">Thông tin khách hàng</h4>
                                <FormContainer>
                                    <FormItem
                                        asterisk
                                        label="Tên khách hàng"
                                        invalid={errors.name && touched.name}
                                        errorMessage={errors.name}
                                    >
                                        <Field type="text" autoComplete="off" name="name" style={{ height: '44px' }} placeholder="Tên khách hàng..." component={Input} />
                                    </FormItem>

                                    <FormItem
                                        asterisk
                                        label="Email"
                                        invalid={errors.email && touched.email}
                                        errorMessage={errors.email}
                                    >
                                        <Field type="text" autoComplete="off" name="email" style={{ height: '44px' }} placeholder="Email..." component={Input} />
                                    </FormItem>

                                    <FormItem
                                        asterisk
                                        label="Số điện thoại"
                                        invalid={errors.phone && touched.phone}
                                        errorMessage={errors.phone}
                                    >
                                        <Field type="text" autoComplete="off" name="phone" style={{ height: '44px' }} placeholder="Số điện thoại..." component={Input} />
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
                                            value={updateCustomer.birthDate ? dayjs(updateCustomer.birthDate, 'YYYY-MM-DD').toDate() : null}
                                            className="custom-datepicker"
                                            onChange={(date) => {
                                                if (date) {
                                                    const formattedDate = dayjs(date).format('DD-MM-YYYY');
                                                    setFieldValue('birthDate', formattedDate);
                                                    setUpdateCustomer((prev) => ({
                                                        ...prev,
                                                        birthDate: formattedDate
                                                    }));
                                                } else {
                                                    setFieldValue('birthDate', '');
                                                    setUpdateCustomer((prev) => ({
                                                        ...prev,
                                                        birthDate: ''
                                                    }));
                                                }
                                            }}
                                        />

                                    </FormItem>

                                    <FormItem asterisk label="Giới tính">
                                        <Field name="gender">
                                            {({ field, form }: FieldProps<string, FormikProps<CustomerDetailDTO>>) => (
                                                <>
                                                    <Radio className="mr-4" value="Nam" checked={field.value === 'Nam'} onChange={() => form.setFieldValue('gender', 'Nam')}>
                                                        Nam
                                                    </Radio>
                                                    <Radio value="Nữ" checked={field.value === 'Nữ'} onChange={() => form.setFieldValue('gender', 'Nữ')}>
                                                        Nữ
                                                    </Radio>
                                                </>
                                            )}
                                        </Field>
                                    </FormItem>

                                    <FormItem>
                                        <Button type="reset" className="ltr:mr-2 rtl:ml-2" style={{ backgroundColor: '#fff', height: '40px' }} disabled={isSubmitting} onClick={() => resetForm()}>
                                            Tải lại
                                        </Button>
                                        <Button variant="solid" type="submit" style={{ backgroundColor: 'rgb(79, 70, 229)', height: '40px' }} disabled={isSubmitting} >
                                            Cập nhật
                                        </Button>
                                    </FormItem>
                                </FormContainer>
                            </div>

                            <div className="w-full lg:w-2/3 bg-white p-6 shadow-md rounded-lg">
                                <h4 className="font-medium text-xl">Thông tin địa chỉ</h4>
                                <FieldArray name="addressDTOS">
                                    {({ insert, remove }) => (
                                        <div>
                                            <Button
                                                type="button"
                                                className="mb-4 mt-4"
                                                onClick={() => {
                                                    insert(0, initialAddressDTO);
                                                    setFormModes(['add', ...formModes]);
                                                }}
                                            >
                                                Thêm địa chỉ mới
                                            </Button>

                                            {values.addressDTOS.map((address, index) => (
                                                <div key={index} className="bg-white p-6 shadow-md rounded-lg mb-6">
                                                    <FormContainer>
                                                        <h4 className="text-lg font-medium mb-2">Địa chỉ {index + 1}</h4>
                                                        <div className="flex w-full flex-wrap mb-4">
                                                            <div className="w-1/2 pr-4">
                                                                <FormItem asterisk label="Tên">
                                                                    <Field type="text" name={`addressDTOS[${index}].name`} style={{ height: '44px' }} placeholder="Nhập tên..." component={Input} />
                                                                </FormItem>
                                                            </div>
                                                            <div className="w-1/2">
                                                                <FormItem asterisk label="Số điện thoại">
                                                                    <Field type="text" name={`addressDTOS[${index}].phone`} style={{ height: '44px' }} placeholder="Nhập số điện thoại..." component={Input} />
                                                                </FormItem>
                                                            </div>
                                                        </div>

                                                        <div className="flex w-full flex-wrap mb-4">
                                                            <div className="w-1/3 pr-4">
                                                                <FormItem asterisk label="Tỉnh/Thành phố">
                                                                    <Field name={`addressDTOS[${index}].province`}>
                                                                        {({ field, form }: FieldProps<string, FormikProps<CustomerDetailDTO>>) => (
                                                                            <Select
                                                                                value={provinces.find((prov) => prov.full_name === field.value) || null}
                                                                                placeholder="Chọn tỉnh/thành phố..."
                                                                                getOptionLabel={(option) => option.full_name}
                                                                                getOptionValue={(option) => option.id}
                                                                                options={provinces}
                                                                                onChange={(newValue: SingleValue<Province> | null) => {
                                                                                    handleLocationChange('province', newValue, form, index);
                                                                                }}
                                                                                onBlur={() => form.setFieldTouched(`addressDTOS[${index}].province`, true)}
                                                                            />
                                                                        )}
                                                                    </Field>
                                                                </FormItem>
                                                            </div>

                                                            <div className="w-1/3 pr-4">
                                                                <FormItem asterisk label="Quận/huyện">
                                                                    <Field name={`addressDTOS[${index}].district`}>
                                                                        {({ field, form }: FieldProps<string, FormikProps<CustomerDetailDTO>>) => (
                                                                            <Select
                                                                                isDisabled={!address.province}
                                                                                value={districts.find((dist) => dist.full_name === field.value) || null}
                                                                                placeholder="Chọn quận/huyện..."
                                                                                getOptionLabel={(option) => option.full_name}
                                                                                getOptionValue={(option) => option.id}
                                                                                options={districts}
                                                                                onChange={(newValue: SingleValue<District> | null) => {
                                                                                    handleLocationChange('district', newValue, form, index);
                                                                                }}
                                                                                onBlur={() => form.setFieldTouched(`addressDTOS[${index}].district`, true)}
                                                                            />
                                                                        )}
                                                                    </Field>
                                                                </FormItem>
                                                            </div>

                                                            <div className="w-1/3">
                                                                <FormItem asterisk label="Xã/phường/thị trấn">
                                                                    <Field name={`addressDTOS[${index}].ward`}>
                                                                        {({ field, form }: FieldProps<string, FormikProps<CustomerDetailDTO>>) => (
                                                                            <Select
                                                                                isDisabled={!address.district}
                                                                                value={wards.find((ward) => ward.full_name === field.value) || null}
                                                                                placeholder="Chọn xã/phường/thị trấn..."
                                                                                getOptionLabel={(option) => option.full_name}
                                                                                getOptionValue={(option) => option.id}
                                                                                options={wards}
                                                                                onChange={(newValue: SingleValue<Ward> | null) => {
                                                                                    handleLocationChange('ward', newValue, form, index);
                                                                                }}
                                                                                onBlur={() => form.setFieldTouched(`addressDTOS[${index}].ward`, true)}
                                                                            />
                                                                        )}
                                                                    </Field>
                                                                </FormItem>
                                                            </div>
                                                        </div>

                                                        <FormItem asterisk label="Địa chỉ chi tiết">
                                                            <Field type="text" name={`addressDTOS[${index}].detail`} style={{ height: '44px' }} placeholder="Nhập địa chỉ chi tiết" component={Input} />
                                                        </FormItem>

                                                        <FormItem label="Địa chỉ mặc định">
                                                            <Field name={`addressDTOS[${index}].isDefault`}>
                                                                {({ field }) => (
                                                                    <Switcher
                                                                        color='blue-600'
                                                                        checked={field.value}
                                                                        onChange={(checked) => {
                                                                            setFieldValue(`addressDTOS[${index}].isDefault`, checked);
                                                                            handleSwitcherChange(index, checked); // Gọi hàm để cập nhật địa chỉ mặc định
                                                                        }}
                                                                    />

                                                                )}
                                                            </Field>
                                                        </FormItem>

                                                        <div className="flex justify-end">
                                                            <Button
                                                                type="button"
                                                                className="mr-4"
                                                                variant="solid"
                                                                style={{ backgroundColor: 'rgb(79, 70, 229)', height: '40px' }}
                                                                onClick={() => handleAddressSubmit(formModes[index] as 'add' | 'edit', values.addressDTOS[index], address.id, values.id, index)}
                                                            >
                                                                {formModes[index] === 'add' ? 'Thêm' : 'Cập nhật'}
                                                            </Button>


                                                            <Button
                                                                type="button"
                                                                variant="default"
                                                                style={{ backgroundColor: '#fff', height: '40px' }}
                                                                onClick={() => {
                                                                    remove(index);
                                                                    setFormModes((prev) => prev.filter((_, i) => i !== index));
                                                                }}
                                                            >
                                                                Xóa
                                                            </Button>
                                                        </div>
                                                    </FormContainer>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </FieldArray>
                            </div>
                        </div>
                    </div>

                </Form>
            )}
        </Formik>
    );
};

export default UpdateCustomer;