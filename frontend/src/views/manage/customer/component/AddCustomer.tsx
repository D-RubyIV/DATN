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
import { toast } from 'react-toastify';


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
};

type AddressDTO = {
  id: string;
  name: string;
  phone: string;
  provinceId: string;
  province: string | null;
  districtId: string;
  district: string | null;
  wardId: string;
  ward: string | null;
  detail: string;
  isDefault: boolean;
};

interface Province {
  id: string;
  full_name: string;
}

interface District {
  id: string;
  full_name: string;
}

interface Ward {
  id: string;
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
  addressDTOS: Yup.array().of(
    Yup.object().shape({
      province: Yup.string().required("Tỉnh/Thành phố là bắt buộc"),
      district: Yup.string().required("Quận/Huyện là bắt buộc"),
      ward: Yup.string().required("Phường/Xã là bắt buộc"),
      detail: Yup.string().required('Địa chỉ chi tiết là bắt buộc'),
    })
  ).min(1, "Cần ít nhất một địa chỉ").required("Danh sách địa chỉ là bắt buộc"), // Kiểm tra ít nhất 1 địa chỉ,
})

const AddCustomer = () => {
  const initialAddressDTO: AddressDTO = {
    id: '',
    name: '',
    phone: '',
    provinceId: "",
    province: null,
    districtId: "",
    district: null,
    wardId: "",
    ward: null,
    detail: '',
    isDefault: true,
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
    // Tách biến selectedProvince ra để tránh sử dụng biểu thức phức tạp trong dependencies
    const selectedAddress = newCustomer.addressDTOS[0];
    const selectedProvince = selectedAddress?.province;

    if (selectedProvince && provinces.length > 0) {
      const province = provinces.find((prov) => prov.full_name === selectedProvince);
      if (province) {
        fetchDistricts(province.id);
      } else {
        setDistricts([]); // Xóa danh sách huyện nếu không tìm thấy tỉnh
      }
    } else {
      setDistricts([]); // Xóa danh sách huyện nếu không có tỉnh được chọn
    }
  }, [newCustomer.addressDTOS, provinces]);

  useEffect(() => {
    const selectedAddress = newCustomer.addressDTOS[0];
    const selectedDistrict = selectedAddress?.district;

    if (selectedDistrict && districts.length > 0) {
      const district = districts.find((dist) => dist.full_name === selectedDistrict);
      if (district) {
        fetchWards(district.id);
      } else {
        setWards([]);
      }
    } else {
      setWards([]); // Xóa danh sách xã/phường nếu không có huyện được chọn
    }
  }, [newCustomer.addressDTOS, districts]);

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
    form: FormikProps<CustomerDTO>,
  ) => {
    if (newValue) {
      setNewCustomer((prevCustomer) => {
        const updatedAddressDTOS = [...prevCustomer.addressDTOS];
        const selectedAddress = updatedAddressDTOS[0];

        if (type === 'province') {
          // Cập nhật giá trị province
          selectedAddress.provinceId = newValue.id;
          selectedAddress.province = newValue.full_name;
          selectedAddress.districtId = "";
          selectedAddress.district = null;
          selectedAddress.wardId = "";
          selectedAddress.ward = null;
          console.log('Id tỉnh: ' + selectedAddress.provinceId)
          console.log('Tên tỉnh: ' + selectedAddress.province)

          // Cập nhật Formik và gọi fetchDistricts
          form.setFieldValue('addressDTOS[0].provinceId', newValue.id);
          form.setFieldValue('addressDTOS[0].province', newValue.full_name);
          form.setFieldValue('addressDTOS[0].district', '');
          form.setFieldValue('addressDTOS[0].districtId', '');
          form.setFieldValue('addressDTOS[0].ward', '');
          form.setFieldValue('addressDTOS[0].warId', '');

          fetchDistricts(newValue.id);
        } else if (type === 'district') {
          // Cập nhật giá trị district
          selectedAddress.districtId = newValue.id;
          selectedAddress.district = newValue.full_name;
          selectedAddress.wardId = "";
          selectedAddress.ward = null;

          // Cập nhật Formik và gọi fetchWards
          form.setFieldValue('addressDTOS[0].districtId', newValue.id);
          form.setFieldValue('addressDTOS[0].district', newValue.full_name);
          form.setFieldValue('addressDTOS[0].wardId', '');
          form.setFieldValue('addressDTOS[0].ward', '');

          fetchWards(newValue.id);
        } else if (type === 'ward') {
          // Cập nhật giá trị ward
          selectedAddress.wardId = newValue.id;
          selectedAddress.ward = newValue.full_name;

          // Cập nhật Formik
          form.setFieldValue('addressDTOS[0].wardId', newValue.id);
          form.setFieldValue('addressDTOS[0].ward', newValue.full_name);
        }

        return {
          ...prevCustomer,
          addressDTOS: updatedAddressDTOS
        };
      });
    }
  };


  const handleSubmit = async (values: CustomerDTO, { resetForm, setSubmitting }: FormikHelpers<CustomerDTO>) => {
    try {
      const formattedValues = {
        ...values,
        birthDate: dayjs(values.birthDate).format('DD-MM-YYYY'), // Định dạng lại birthDate
      };

      console.log('Submitting formatted values:', formattedValues);

      const response = await axios.post('http://localhost:8080/api/v1/customer/save', formattedValues);
      toast.success('Lưu thành công');
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
      validationSchema={null}
      enableReinitialize={true}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, touched, errors, resetForm, isSubmitting }) => (
        <Form>
          <div className="bg-white p-6 shadow-md rounded-lg mb-6 w-full">
            <h1 className="text-center font-semibold text-2xl mb-4 text-transform: uppercase">Thêm khách hàng</h1>
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
                      autoComplete="on"
                      name="name"
                      placeholder="Nhập tên khách hàng..."
                      style={{ height: '44px' }}
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
                      autoComplete="on"
                      name="email"
                      style={{ height: '44px' }}
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
                      type="tel"
                      autoComplete="on"
                      name="phone"
                      style={{ height: '44px' }}
                      placeholder="Nhập số điện thoại..."
                      component={Input}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value.replace(/[^0-9]/g, ''); // Chỉ cho phép nhập ký tự số
                        setFieldValue("phone", value);
                        setNewCustomer((prev) => ({ ...prev, phone: value }));
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
                      className="custom-datepicker"
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
                  // invalid={!!(Array.isArray(errors.addressDTOS) &&
                  //   errors.addressDTOS[0] &&
                  //   typeof errors.addressDTOS[0] === 'object' &&
                  //   errors.addressDTOS[0].province &&
                  //   touched.addressDTOS?.[0]?.province)}
                  // errorMessage={Array.isArray(errors.addressDTOS) &&
                  //   errors.addressDTOS[0] &&
                  //   typeof errors.addressDTOS[0] === 'object' ?
                  //   errors.addressDTOS[0].province : undefined}
                  >
                    <Field name="addressDTOS[0].province">
                      {({ field, form }: FieldProps<CustomerDTO>) => (
                        <Select
                          isDisabled={loadingProvinces}
                          value={provinces.find(prov => prov.full_name === newCustomer.addressDTOS[0].province) || null}
                          placeholder="Chọn tỉnh/thành phố..."
                          style={{ height: '40px' }}
                          getOptionLabel={(option) => option.full_name}
                          getOptionValue={(option) => option.full_name}
                          options={provinces}
                          onChange={(newValue: SingleValue<Province> | null) => {
                            handleLocationChange('province', newValue, form);
                          }}
                          onBlur={() => form.setFieldTouched(field.name, true)}
                        />
                      )}
                    </Field>
                  </FormItem>

                  <FormItem
                    asterisk
                    label="Quận/huyện"
                  // invalid={!!(errors.addressDTOS && errors.addressDTOS[0] && touched.addressDTOS?.[0]?.province)}
                  // errorMessage={errors.addressDTOS?.[0]?.province}
                  >
                    <Field name="addressDTOS[0].district">
                      {({ form }: FieldProps<CustomerDTO>) => (
                        <Select
                          isDisabled={loadingDistricts}
                          value={districts.find(prov => prov.full_name === newCustomer.addressDTOS[0].district) || null}
                          placeholder="Chọn quận/huyện..."
                          style={{ height: '40px' }}
                          getOptionLabel={(option) => option.full_name}
                          getOptionValue={(option) => option.full_name}
                          options={districts}
                          onChange={(newValue: SingleValue<District> | null) => {
                            handleLocationChange('district', newValue, form);
                          }}
                          onBlur={() => form.setFieldTouched("addressDTOS[0].district", true)}
                        />
                      )}
                    </Field>

                  </FormItem>
                  <FormItem
                    asterisk
                    label="Xã/phường/thị trấn"
                  // invalid={errors.ward && touched.ward}
                  // errorMessage={errors.ward}
                  >
                    <Field name="addressDTOS[0].ward">
                      {({ form }: FieldProps<CustomerDTO>) => (
                        <Select
                          isDisabled={loadingWards}
                          value={wards.find(prov => prov.full_name === newCustomer.addressDTOS[0].ward) || null}
                          placeholder="Chọn xã/phường/thị trấn..."
                          style={{ height: '40px' }}
                          getOptionLabel={(option) => option.full_name}
                          getOptionValue={(option) => option.full_name}
                          options={wards}
                          onChange={(newValue: SingleValue<Ward> | null) => {
                            handleLocationChange('ward', newValue, form);
                          }}
                          onBlur={() => form.setFieldTouched("addressDTOS[0].ward", true)}
                        />
                      )}
                    </Field>

                  </FormItem>
                  <FormItem
                    asterisk
                    label="Địa chỉ cụ thể"
                  // invalid={errors.addressDTOS?.[0]?.detail && touched.addressDTOS?.[0]?.detail}
                  // errorMessage={errors.addressDTOS?.[0]?.detail}
                  >
                    <Field
                      type="text"
                      autoComplete="on"
                      name="addressDTOS[0].detail"
                      style={{ height: '44px' }}
                      placeholder="Nhập địa chỉ cụ thể..."
                      component={Input}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue("addressDTOS[0].detail", e.target.value); // Cập nhật để phản ánh đúng cấu trúc
                        setNewCustomer((prev) => ({
                          ...prev,
                          addressDTOS: [
                            {
                              ...prev.addressDTOS[0],
                              detail: e.target.value, // Cập nhật detail trong đối tượng addressDTOS
                            },
                          ],
                        }));
                      }}
                    />
                  </FormItem>
                  <FormItem>
                    <Button
                      type="reset"
                      style={{ backgroundColor: '#fff', height: '40px' }}
                      className="ltr:mr-2 rtl:ml-2"
                      disabled={isSubmitting}
                      onClick={() => resetForm()}
                    >
                      Tải lại
                    </Button>
                    <Button variant="solid" style={{ backgroundColor: 'rgb(79, 70, 229)', height: '40px' }} type="submit" disabled={isSubmitting}>
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