import React, { Fragment } from 'react'
import { useState, useEffect } from 'react';
import { Button, Input, Radio, Select, Switcher } from '@/components/ui';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { FormItem, FormContainer } from '@/components/ui/Form';
import { Field, FieldArray, FieldProps, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import DatePicker from '@/components/ui/DatePicker';
import axios from 'axios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { toast } from 'react-toastify';
import { Pagination } from 'antd';
import Dialog from '@/components/ui/Dialog'



type CustomerDTO = {
    id: string;
    code: string;
    name: string;
    email: string;
    phone: string;
    birthDate: string;
    gender: string;
    addressDTOS: AddressDTO[];
    status: string;
    totalAddresses: number;
};

type AddressDTO = {
    id: string;
    name: string;
    phone: string;
    provinceId: number;
    districtId: number;
    wardId: string;
    province: string | null;
    district: string | null;
    ward: string | null;
    detail: string;
    isDefault: boolean;
};

interface Province {
    ProvinceID: number;
    ProvinceName: string;
    NameExtension: string[];
}

interface District {
    DistrictID: number;
    ProvinceID: number;
    DistrictName: string;
}


interface Ward {
    WardCode: string;
    DistrictID: number;
    WardName: string;
}


function CustomerInformation() {

    const initialAddressDTO: AddressDTO = {
        id: '',
        name: '',
        phone: '',
        provinceId: 0,
        province: null,
        districtId: 0,
        district: null,
        wardId: '',
        ward: null,
        detail: '',
        isDefault: false,
    };

    const initialCustomerState: CustomerDTO = {
        id: '',
        code: '',
        name: '',
        email: '',
        phone: '',
        birthDate: '',
        gender: 'Nữ',
        addressDTOS: [initialAddressDTO],
        status: 'Active',
        totalAddresses: 0,
    }


    const fetchCustomer = async (id: string, currentPage: number) => {
        try {

            const response = await axios.get(`http://localhost:8080/api/v1/customer/${id}/detail`, {
                params: {
                    page: currentPage > 0 ? currentPage - 1 : 0, // Chuyển đổi currentPage về định dạng 0
                    size: pageSize
                }
            });
            if (response.status === 200) {

                const customerData = response.data;

                // Cập nhật tổng số địa chỉ và số trang
                console.log('Tổng số địa chỉ: ', customerData.totalAddresses)
                console.log('Tổng số trang: ', customerData.totalAddresses / pageSize)
                if (customerData.totalAddresses) {
                    setTotalAddresses(customerData.totalAddresses);
                    setTotalPages(Math.ceil(customerData.totalAddresses / pageSize));
                }

                // Cập nhật thông tin email và phone của khách hàng
                setInitialContact({
                    currentEmail: customerData.email,
                    currentPhone: customerData.phone,
                });
                // Log giá trị birthDate từ backend
                console.log('Giá trị birthDate từ backend:', customerData.birthDate);

                // Chuyển đổi ngày sinh từ 'DD-MM-YYYY' sang 'YYYY-MM-DD' cho frontend
                if (customerData.birthDate) {
                    // Phân tích ngày với định dạng 'DD-MM-YYYY'
                    const parsedDate = dayjs(customerData.birthDate, 'DD-MM-YYYY');

                    // Log ngày đã phân tích để kiểm tra
                    console.log('Parsed Date:', parsedDate.format());

                    if (parsedDate.isValid()) {
                        // Định dạng lại ngày cho frontend
                        customerData.birthDate = parsedDate.format('YYYY-MM-DD');
                        console.log('Formatted birthDate:', customerData.birthDate); // Log để kiểm tra xem ngày đã định dạng chưa
                    } else {
                        console.error('Ngày sinh không hợp lệ:', customerData.birthDate);
                    }
                }

                setUpdateCustomer(customerData);
                console.log('Customer data:', customerData);
                setFormModes(response.data.addressDTOS.map(() => 'edit'));
            } else {
                console.error('Failed to fetch customer data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching customer data:', error);
        }
    };

    // mở dialog xác nhận xóa
    const openDialog = (addressId: string) => {
        setSelectedAddressId(addressId);
        setIsOpen(true);
    }

    // Đóng dialog mà không xóa
    const onDialogClose = () => {
        setIsOpen(false);
        setSelectedAddressId(null);
    };

    // Delete Address
    const handleDelete = async (id: string, index: number, remove: (index: number) => void) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/v1/address/delete/${id}`);
            if (response.status === 200) {
                toast('Xóa thành công')
                remove(index);
                setFormModes(prev => prev.filter((_, i) => i !== index));
                setIsOpen(false)
            } else {
                console.error('Lỗi khi xóa địa chỉ:', response.statusText);
                toast('Xóa thất bại');
            }
        } catch (error) {
            console.error('Lỗi xóa khách hàng:', error);
            toast('Xóa thất bại')
        }
    }



    const handlePageChange = (newPage: number) => {
        if (newPage < 1) {
            console.warn('Số trang phải lớn hơn hoặc bằng 1')
            return; // không gọi api nếu trang nhỏ hơn 1
        }
        if (id) { // Kiểm tra xem id có phải là undefined không
            setCurrentPage(newPage);
            fetchCustomer(id, newPage); // Gọi lại fetchCustomer với trang mới
        } else {
            console.error('ID is undefined');
        }
    };

    const handleUpdate = async (values: CustomerDTO, { setSubmitting }: FormikHelpers<CustomerDTO>) => {
        try {
            // Kiểm tra ngày sinh trước khi định dạng
            if (!dayjs(values.birthDate, 'YYYY-MM-DD', true).isValid()) {
                alert('Ngày sinh không hợp lệ. Vui lòng kiểm tra lại.');
                setSubmitting(false);
                return;
            }

            // Định dạng ngày sinh trước khi gửi
            const formattedBirthDate = dayjs(values.birthDate, 'YYYY-MM-DD').format('DD-MM-YYYY');
            const response = await axios.put(`http://localhost:8080/api/v1/customer/update/${values.id}`, {
                ...values,
                birthDate: formattedBirthDate, // Gửi ngày đã định dạng
            });

            if (response.status === 200) {
                toast('Cập nhật thành công');
                navigate('/admin/manage/customer');
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


    // hàm thêm mới địa chỉ cho 1 khách hàng
    const handleAddressSubmit = async (
        mode: 'add' | 'edit',
        address: AddressDTO,
        addressId: string,
        customerId: string,
        addressIndex: number,
        setFieldTouched: (field: string, touched?: boolean) => void,
        setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
        values: { addressDTOS: AddressDTO[] } // Thêm values để có thể truy cập danh sách addressDTOS hiện tại
    ) => {
        try {
            // Kiểm tra tính hợp lệ của form trước khi gửi yêu cầu
            if (!address.name || !address.phone || !address.province || !address.district || !address.ward || !address.detail) {
                // Đánh dấu tất cả các trường là đã được "touched" để hiển thị lỗi
                setFieldTouched(`addressDTOS[${addressIndex}].name`, true);
                setFieldTouched(`addressDTOS[${addressIndex}].phone`, true);
                setFieldTouched(`addressDTOS[${addressIndex}].province`, true);
                setFieldTouched(`addressDTOS[${addressIndex}].district`, true);
                setFieldTouched(`addressDTOS[${addressIndex}].ward`, true);
                setFieldTouched(`addressDTOS[${addressIndex}].detail`, true);
                return; // Dừng hàm nếu form không hợp lệ
            }

            let response;
            if (mode === 'add') {
                response = await axios.post(`http://localhost:8080/api/v1/customer/${customerId}/address`, address);
                console.log('Dữ liệu địa chỉ vừa thêm:', response.data);
                if (response.status === 201) {
                    // Thêm địa chỉ mới vào đầu danh sách sau khi thành công
                    setFieldValue('addressDTOS', [response.data, ...values.addressDTOS]);

                    setFormModes((prev) => ['edit', ...prev]); // Cập nhật formModes
                }
                toast('Thêm địa chỉ mới thành công');
            } else {
                // Gửi yêu cầu cập nhật với các trường ID quận và xã
                response = await axios.put(`http://localhost:8080/api/v1/address/update/${addressId}`, {
                    ...address, // Bao gồm cả districtId và wardId
                    districtId: address.districtId, // Đảm bảo ID quận được gửi
                    wardId: address.wardId // Đảm bảo ID xã được gửi
                });
                const updatedAddressDTOS = [...values.addressDTOS];
                updatedAddressDTOS[addressIndex] = response.data;
                // setFieldValue('addressDTOS', updatedAddressDTOS); // Cập nhật lại danh sách sau khi chỉnh sửa
                console.log('dữ liệu cập nhật lại địa chỉ: ', updatedAddressDTOS)
                toast('Cập nhật địa chỉ thành công');
            }
            fetchCustomer(customerId, currentPage);
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
                // fetchCustomer(updateCustomer.id, currentPage); // Lấy lại dữ liệu khách hàng để cập nhật giao diện
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
            toast('cập nhật địa chỉ mặc định thành công');
            // Gọi API chỉ một lần để cập nhật địa chỉ mặc định và các địa chỉ khác
            await updateDefaultAddress(updateCustomer.addressDTOS[index].id, true);

        } catch (error) {
            console.error('Lỗi khi cập nhật địa chỉ mặc định:', error);
        }
    };

    const resetProvincesDistrictsWards = async (customer: CustomerDTO) => {
        if (customer.addressDTOS[0].provinceId) {
            // Load lại danh sách quận từ provinceId ban đầu
            const districts = await fetchDistricts(customer.addressDTOS[0].provinceId);
            setDistricts(districts);

            if (customer.addressDTOS[0].districtId) {
                // Load lại danh sách xã từ districtId ban đầu
                const wards = await fetchWards(customer.addressDTOS[0].districtId);
                setWards(wards);
            }
        }
    };
    return (
        <Fragment>
            <div className="w-full lg:w-2/3 bg-white p-6 shadow-md rounded-lg">

                <h4 className="font-medium text-xl">Thông tin địa chỉ</h4>
                <FieldArray name="addressDTOS">
                    {({ remove, unshift }) => (
                        <div>

                            <Button
                                type="button"
                                className="mb-4 mt-4"
                                onClick={() => {
                                    // Thêm một địa chỉ mới vào đầu mảng
                                    unshift(initialAddressDTO); // Gọi unshift với initialAddressDTO

                                    // Cập nhật trạng thái formModes
                                    setFormModes(['add', ...formModes]);

                                }}
                            >
                                Thêm địa chỉ mới
                            </Button>

                            {values.addressDTOS.map((address, index) => (
                                <div key={index} className="bg-white p-6 shadow-md rounded-lg mb-6">
                                    <FormContainer>
                                        <h4 className="text-lg font-medium mb-2">
                                            Địa chỉ {(currentPage - 1) * pageSize + index + 1}
                                        </h4>
                                        <div className="flex w-full flex-wrap mb-4">
                                            <div className="w-1/2 pr-4">
                                                <FormItem
                                                    asterisk
                                                    label="Tên"
                                                    invalid={errors.addressDTOS?.[index]?.name && touched.addressDTOS?.[index]?.name}
                                                    errorMessage={errors.addressDTOS?.[index]?.name}
                                                >
                                                    <Field
                                                        type="text"
                                                        name={`addressDTOS[${index}].name`}
                                                        style={{ height: '44px' }}
                                                        placeholder="Nhập tên..."
                                                        component={Input}
                                                    />
                                                </FormItem>
                                            </div>
                                            <div className="w-1/2">
                                                <FormItem
                                                    asterisk
                                                    label="Số điện thoại"
                                                    invalid={errors.addressDTOS?.[index]?.phone && touched.addressDTOS?.[index]?.phone}
                                                    errorMessage={errors.addressDTOS?.[index]?.phone}
                                                >
                                                    <Field
                                                        type="text"
                                                        name={`addressDTOS[${index}].phone`}
                                                        style={{ height: '44px' }}
                                                        placeholder="Nhập số điện thoại..."
                                                        component={Input}
                                                    // onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    //     const value = e.target.value.replace(/\D/g, ''); // Chỉ cho phép nhập ký tự số
                                                    //     setFieldValue("phone", value); // Cập nhật giá trị trong Formik
                                                    //     // setUpdateCustomer((prev) => ({ ...prev, phone: value })); // Cập nhật giá trị cho state updateCustomer
                                                    // }}
                                                    />
                                                </FormItem>
                                            </div>
                                        </div>

                                        <div className="flex w-full flex-wrap mb-4">
                                            <div className="w-1/3 pr-4">
                                                <FormItem
                                                    asterisk
                                                    label="Tỉnh/Thành phố"
                                                    invalid={touched.addressDTOS?.[index]?.province && Boolean(errors.addressDTOS?.[index]?.province)}
                                                    errorMessage={errors.addressDTOS?.[index]?.province}
                                                >
                                                    <Field name={`addressDTOS[${index}].province`}>
                                                        {({
                                                            field,
                                                            form
                                                        }: FieldProps<string, FormikProps<CustomerDTO>>) => {
                                                            // Log giá trị tỉnh/thành phố hiện tại
                                                            console.log('Dữ liệu tỉnh:', field.value);

                                                            return (
                                                                <Select
                                                                    value={provinces.find(prov => prov.NameExtension[1] === field.value) || null}
                                                                    placeholder="Chọn tỉnh/thành phố..."
                                                                    getOptionLabel={(option: Province) => option.NameExtension[1]}
                                                                    getOptionValue={(option: Province) => String(option.ProvinceID)}
                                                                    options={provinces}
                                                                    onChange={(newValue: SingleValue<Province> | null) => {
                                                                        handleLocationChange('province', newValue, form, index);
                                                                    }}
                                                                    onBlur={() => form.setFieldTouched(field.value, true)}
                                                                />
                                                            );
                                                        }}
                                                    </Field>
                                                </FormItem>
                                            </div>


                                            <div className="w-1/3 pr-4">
                                                <FormItem
                                                    asterisk
                                                    label="Quận/huyện"
                                                    invalid={touched.addressDTOS?.[index]?.district && Boolean(errors.addressDTOS?.[index]?.district)}
                                                    errorMessage={errors.addressDTOS?.[index]?.district}
                                                >
                                                    <Field name={`addressDTOS[${index}].district`}>
                                                        {({
                                                            field,
                                                            form
                                                        }: FieldProps<string, FormikProps<CustomerDTO>>) => {
                                                            console.log('Dữ liệu quận:', field.value);
                                                            return (
                                                                <Select
                                                                    isDisabled={!address.province}
                                                                    value={districts.find(prov => prov.DistrictName === field.value) || null}
                                                                    placeholder="Chọn quận/huyện..."
                                                                    getOptionLabel={(option: District) => option.DistrictName}
                                                                    getOptionValue={(option: District) => String(option.DistrictID)}
                                                                    options={districts}
                                                                    onChange={(newValue: SingleValue<District> | null) => {
                                                                        handleLocationChange('district', newValue, form, index);
                                                                    }}
                                                                    onBlur={() => form.setFieldTouched(field.value, true)}
                                                                />
                                                            );
                                                        }}
                                                    </Field>
                                                </FormItem>
                                            </div>

                                            <div className="w-1/3">
                                                <FormItem
                                                    asterisk
                                                    label="Xã/phường/thị trấn"
                                                    invalid={touched.addressDTOS?.[index]?.ward && Boolean(errors.addressDTOS?.[index]?.ward)}
                                                    errorMessage={errors.addressDTOS?.[index]?.ward}
                                                >
                                                    <Field name={`addressDTOS[${index}].ward`}>
                                                        {({
                                                            field,
                                                            form
                                                        }: FieldProps<string, FormikProps<CustomerDTO>>) => {
                                                            console.log('Dữ liệu xã:', field.value);

                                                            return (

                                                                <Select
                                                                    isDisabled={!address.district}
                                                                    value={wards.find(prov => prov.WardName === field.value) || null}
                                                                    placeholder="Chọn xã/phường/thị trấn..."
                                                                    getOptionLabel={(option: Ward) => option.WardName}
                                                                    getOptionValue={(option: Ward) => String(option.WardCode)}
                                                                    options={wards}
                                                                    onChange={(newValue: SingleValue<Ward> | null) => {
                                                                        handleLocationChange('ward', newValue, form, index);
                                                                    }}
                                                                    onBlur={() => form.setFieldTouched(field.value, true)}
                                                                />
                                                            )

                                                        }}
                                                    </Field>
                                                </FormItem>
                                            </div>
                                        </div>

                                        <FormItem
                                            asterisk
                                            label="Địa chỉ chi tiết"
                                            invalid={errors.addressDTOS?.[index]?.detail && touched.addressDTOS?.[index]?.detail}
                                            errorMessage={errors.addressDTOS?.[index]?.detail}
                                        >
                                            <Field type="text" name={`addressDTOS[${index}].detail`}
                                                style={{ height: '44px' }}
                                                placeholder="Nhập địa chỉ chi tiết"
                                                component={Input} />
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
                                                style={{
                                                    backgroundColor: 'rgb(79, 70, 229)',
                                                    height: '40px'
                                                }}
                                                onClick={() => handleAddressSubmit(formModes[index] as 'add' | 'edit', values.addressDTOS[index], address.id, values.id, index, setFieldTouched, setFieldValue, values)}
                                            >
                                                {formModes[index] === 'add' ? 'Thêm' : 'Cập nhật'}
                                            </Button>


                                            <Button
                                                type="button"
                                                variant="default"
                                                style={{ backgroundColor: '#fff', height: '40px' }}
                                                onClick={() => openDialog(address.id)}
                                            >
                                                Xóa
                                            </Button>
                                        </div>
                                    </FormContainer>
                                    {/* Dialog xác nhận xóa */}
                                    <Dialog isOpen={dialogIsOpen} closable={false} onClose={onDialogClose} >
                                        <h5 className="mb-4">Xác nhận xóa sự kiện</h5>
                                        <p>Bạn có chắc chắn muốn xóa sự kiện này không?</p>
                                        <div className="text-right mt-6">
                                            <Button className="ltr:mr-2 rtl:ml-2" variant="plain" onClick={onDialogClose}>
                                                Hủy
                                            </Button>
                                            <Button variant="solid" style={{ backgroundColor: 'rgb(79, 70, 229)', height: '40px' }} type='submit' onClick={() => handleDelete(address.id, index, remove)}>
                                                Xác nhận
                                            </Button>
                                        </div>
                                    </Dialog>
                                </div>

                            ))}
                        </div>
                    )}

                </FieldArray>
                <div>
                    <Pagination
                        current={currentPage} // Trực tiếp sử dụng currentPage mà không cần +1
                        pageSize={pageSize}
                        total={totalAddresses}
                        onChange={handlePageChange}
                    />
                </div>

            </div>
        </Fragment>
    )
}

export default CustomerInformation