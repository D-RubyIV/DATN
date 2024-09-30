import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Field, FieldInputProps, FieldProps, Form, Formik, FormikProps } from "formik";
import { DatePicker, FormContainer, FormItem, Radio, Input, Select } from "@/components/ui";
import dayjs from "dayjs";
import { SingleValue } from "react-select";

type CustomerDetailDTO = {
    id: number;
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
    id: number;
    name: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
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


const UpdateCustomer1 = () => {

    // const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); // lay id tu URL thong qua props
    const [data, setData] = useState<CustomerDetailDTO | null>(null);
    const [provinces, setProvinces] = useState<Province[]>([])
    const [districts, setDistricts] = useState<District[]>([])
    const [wards, setWards] = useState<Ward[]>([])
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
    const [selectedWard, setSelectedWard] = useState<string | null>(null);
    // Fetch tỉnh và dữ liệu khách hàng khi component được mount
    useEffect(() => {
        if (id) {
            fetchCustomerDetailDTO(Number(id));
            console.log(fetchCustomerDetailDTO)
        }
    }, [id]);

    //     // APi lay du lieu theo id
    const fetchCustomerDetailDTO = async (id: number) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/customer/${id}`);
            if (response.status === 200) {
                const customerDetailData = response.data;
                setData(customerDetailData);

                // Thiết lập tỉnh, quận, xã theo tên từ dữ liệu fetch được
                setSelectedProvince(customerDetailData.addressDTOS[0]?.province || null);
                setSelectedDistrict(customerDetailData.addressDTOS[0]?.district || null);
                setSelectedWard(customerDetailData.addressDTOS[0]?.ward || null);

                // Fetch danh sách quận và xã dựa trên tỉnh và quận đã chọn
                if (customerDetailData.addressDTOS[0]?.province) {
                    fetchDistricts(customerDetailData.addressDTOS[0].province);
                }
                if (customerDetailData.addressDTOS[0]?.district) {
                    fetchWards(customerDetailData.addressDTOS[0].district);
                }
            }
        } catch (error) {
            console.error('Error fetching customer data:', error);
        }
    };

    useEffect(() => {
        fetchProvinces();
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            console.log('Selected Province:', selectedProvince);
            fetchDistricts(selectedProvince);
            setWards([]); // Reset xã khi thay đổi tỉnh
        }
    }, [selectedProvince]);

    // Xử lý khi thay đổi quận
    useEffect(() => {
        if (selectedDistrict) {
            console.log('Selected District:', selectedDistrict);
            fetchWards(selectedDistrict);
        }
    }, [selectedDistrict]);

    // Fetch  tỉnh
    const fetchProvinces = async () => {
        try {
            const response = await axios.get('/api/api-tinhthanh/1/0.htm');
            const data = response.data;
            if (data.error === 0) {
                setProvinces(data.data);
            } else {
                console.error('Error loading province:', data.message || 'ko xac dinh');
            }
        } catch (error) {
            console.error('Error when calling API province:', error);
        }
    };


    // Fetch  quận
    const fetchDistricts = async (provinceId: string) => {
        // console.log("Fetching districts for provinceId:", provinceId);
        if (!provinceId) {
            console.error("Lỗi: provinceId không được xác định!");
            return;
        }
        try {
            const response = await axios.get(`/api/api-tinhthanh/2/${provinceId}.htm`);
            // console.log('API Response Data:', response.data); // Xem cấu trúc dữ liệu
            const data_district = response.data;
            if (data_district.error === 0) {
                setDistricts(data_district.data);
            } else {
                console.error('Error loading district:', data_district.error_text);
            }
        } catch (error) {
            console.error(`Error when calling API district with provinceId ${provinceId}:`, error);
        }
    };

    // Fetch  xã
    const fetchWards = async (districtId: string) => {
        if (!districtId) {
            // console.error("Lỗi: districtId không được xác định!");
            return;
        }
        try {
            const response = await axios.get(`/api/api-tinhthanh/3/${districtId}.htm`);
            const data_ward = response.data;
            if (data_ward.error === 0) {
                console.log(data_ward.data)
                setWards(data_ward.data);
            } else {
                console.error('Error loading ward:', data_ward.error_text);
            }
        } catch (error) {
            console.error(`Error when calling API ward with districtId ${districtId}:`, error);
        }
    };

    const handleProvinceChange = (newValue: SingleValue<Province> | null, form: FormikProps<CustomerDetailDTO>) => {
        form.setFieldValue('province', newValue?.name || '');
        form.setFieldValue('district', ''); // Reset giá trị quận khi thay đổi tỉnh
        form.setFieldValue('ward', ''); // Reset giá trị xã khi thay đổi tỉnh
        if (newValue) {
            fetchDistricts(newValue.id); // Fetch danh sách quận cho tỉnh mới
        }
    };

    const handleDistrictChange = (newValue: SingleValue<District> | null, form: FormikProps<CustomerDetailDTO>) => {
        form.setFieldValue('district', newValue?.name || '');
        form.setFieldValue('ward', ''); // Reset giá trị xã khi thay đổi quận
        if (newValue) {
            fetchWards(newValue.id); // Fetch danh sách xã cho quận mới
        }
    };



    // Lấy địa chỉ mặc định từ customerDetail
    const address = data?.addressDTOS.find(addr => addr.isDefault) || data?.addressDTOS?.[0];

    return (
        <FormContainer>
            <Formik
                initialValues={{
                    name: data?.name || '',
                    email: data?.email || '',
                    phone: data?.phone || '',
                    birthDate: dayjs(data?.birthDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                    gender: data?.gender || '',
                    province: address?.province || '',
                    district: address?.district || '',
                    ward: address?.ward || '',
                    detail: address?.detail || '',
                    status: data?.status || '',
                }}
                // validationSchema={validationSchema}
                enableReinitialize={true}
                onSubmit={() => {
                    console.log('abc')
                }}

            >
                {({ setFieldValue }) => (
                    <Form>
                        <h1 className="text-center font-semibold text-2xl mb-4 uppercase">Cập nhật khách hàng</h1>
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="w-full lg:w-1/3 bg-white p-6 shadow-md rounded-lg">
                                <h4 className="font-medium text-xl mb-4">Thông tin khách hàng</h4>


                                <FormItem
                                    asterisk
                                    label="Tên khách hàng"
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="name"
                                        placeholder="Tên khách hàng"
                                        as={Input}
                                    />
                                </FormItem>

                                <FormItem
                                    asterisk
                                    label="Email"

                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="email"
                                        placeholder="email"
                                        as={Input}
                                    />
                                </FormItem>

                                <FormItem
                                    asterisk
                                    label="Số điện thoại"

                                >
                                    <Field
                                        type="number"
                                        autoComplete="off"
                                        name="phone"
                                        placeholder="Số điện thoại"
                                        as={Input}
                                    />
                                </FormItem>

                                <FormItem
                                    asterisk
                                    label="Ngày sinh"
                                >
                                    <Field name="birthDate">
                                        {({ field }: { field: FieldInputProps<string> }) => (
                                            <DatePicker
                                                {...field}
                                                value={field.value ? dayjs(field.value).toDate() : null} // Chuyển đổi từ Dayjs sang Date
                                                onChange={(date: Date | null) => {
                                                    if (date) {
                                                        setFieldValue('birthDate', dayjs(date).format('YYYY-MM-DD')); // Chuyển đổi Date thành Dayjs và định dạng
                                                    }
                                                }}
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                <FormItem asterisk label="Gender">
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



                            </div>
                            <div className="w-full lg:w-2/3 bg-white p-6 shadow-md rounded-lg">
                                <h4 className="font-medium text-xlb">Thông tin địa chỉ</h4>

                                <FormItem
                                    asterisk
                                    label="Tỉnh/thành phố"
                                    className="mt-4"
                                >


                                    <Field name="province">
                                        {({ field, form }: FieldProps<CustomerDetailDTO>) => (
                                            <Select
                                                value={provinces.find(province => province.id === field.value)}
                                                placeholder="Chọn tỉnh/thành phố..."
                                                getOptionLabel={(option) => option.name} // Hiển thị tên tỉnh
                                                getOptionValue={(option) => option.id} // Giá trị là tên của tỉnh
                                                options={provinces} // Danh sách các tỉnh
                                                onChange={(newValue: SingleValue<Province> | null) => handleProvinceChange(newValue, form)}
                                            />
                                        )}
                                    </Field>



                                </FormItem>

                                <FormItem
                                    asterisk
                                    label="Quận/huyện"

                                >
                                    <Field name="district">
                                        {({ field, form }: FieldProps<CustomerDetailDTO>) => (
                                            <Select

                                                value={districts.find(district => district.id === field.value) || null}
                                                placeholder="Chọn quận huyện..."
                                                getOptionLabel={(option) => option.name} // Hiển thị tên tỉnh
                                                getOptionValue={(option) => option.id} // Giá trị là tên của tỉnh
                                                options={districts} // Danh sách các tỉnh
                                                onChange={(newValue: SingleValue<District> | null) => handleDistrictChange(newValue, form)}

                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                <FormItem
                                    asterisk
                                    label="Xã/phường/thị trấn"

                                >
                                    <Field name="ward">
                                        {({ field, form }: FieldProps<CustomerDetailDTO>) => (
                                            <Select

                                                value={wards.find(ward => ward.id === field.value) || null}
                                                placeholder="Chọn xã/phường/thị trấn..."
                                                getOptionLabel={(option) => option.name} // Hiển thị tên tỉnh
                                                getOptionValue={(option) => option.id} // Giá trị là tên của tỉnh
                                                options={wards} // Danh sách các tỉnh
                                                onChange={(newValue: SingleValue<Ward> | null) => handleWardChange(newValue, form)}

                                            />
                                        )}
                                    </Field>
                                </FormItem>



                                <FormItem label="Chi tiết địa chỉ">
                                    <Field name="detail" as={Input} placeholder="Chi tiết địa chỉ" />
                                </FormItem>



                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </FormContainer>

    );
}

export default UpdateCustomer1;