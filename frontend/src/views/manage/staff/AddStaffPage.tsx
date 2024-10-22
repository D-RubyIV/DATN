import React, { useState, useEffect, useRef } from "react"; // Import các hook của React
import { Snackbar, Box } from '@mui/material'; // Import các thành phần UI từ Material-UI
import {
    Formik,
    Field,
    Form,
    FormikHelpers,
    FormikProps,
    FieldProps,
    useFormikContext
} from "formik"; // Import các thành phần từ Formik
import * as Yup from "yup"; // Import Yup để xác thực
import axios from "axios"; // Import axios để gọi API
import emailjs from "emailjs-com"; // Import thư viện gửi email
import dayjs from "dayjs"; // Import thư viện xử lý ngày tháng
import { useNavigate } from "react-router-dom"; // Import hook để điều hướng
import {
    FormItem,
    FormContainer,
} from "@/components/ui/Form"; // Import các thành phần tùy chỉnh
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import DatePicker from "@/components/ui/DatePicker";
import Radio from "@/components/ui/Radio";
import Select from "@/components/ui/Select";
import { toast } from "react-toastify"; // Import thư viện thông báo
import { Html5QrcodeScanner } from "html5-qrcode"; // Import thư viện quét mã QR
import { SingleValue } from "react-select"; // Import kiểu dữ liệu từ react-select
import { CloseOutlined } from '@mui/icons-material'; // Import biểu tượng đóng
import { IoPersonAdd } from "react-icons/io5";
import { RxReset } from "react-icons/rx";
import { BsQrCodeScan } from "react-icons/bs";
import { color } from "framer-motion";
// Định nghĩa kiểu dữ liệu cho nhân viên
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

// Định nghĩa kiểu dữ liệu cho tỉnh, huyện, xã
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

// Khởi tạo trạng thái ban đầu cho nhân viên
const initialStaffState: Staff = {
    id: "",
    code: "",
    name: "",
    email: "",
    phone: "",
    citizenId: "",
    address: "",
    province: null,
    district: null,
    ward: null,
    status: "active",
    note: "",
    birthDay: "",
    gender: true,
    password: "",
    deleted: false,
};

// Thành phần chính của trang thêm nhân viên
const AddStaffPage = () => {
    const [newStaff, setNewStaff] = useState<Staff>(initialStaffState); // Trạng thái cho nhân viên mới
    const [provinces, setProvinces] = useState<Province[]>([]); // Trạng thái cho danh sách tỉnh
    const [districts, setDistricts] = useState<District[]>([]); // Trạng thái cho danh sách huyện
    const [wards, setWards] = useState<Ward[]>([]); // Trạng thái cho danh sách xã
    const [loadingProvinces, setLoadingProvinces] = useState(false); // Trạng thái đang tải tỉnh
    const [loadingDistricts, setLoadingDistricts] = useState(false); // Trạng thái đang tải huyện
    const [loadingWards, setLoadingWards] = useState(false); // Trạng thái đang tải xã
    const [openDialog, setOpenDialog] = useState(false); // Trạng thái hiển thị hộp thoại quét mã
    const scannerRef = useRef<any>(null); // Tham chiếu cho scanner mã QR
    const [snackbarOpen, setSnackbarOpen] = useState(false); // Trạng thái hiển thị snackbar
    const [snackbarMessage, setSnackbarMessage] = useState(''); // Thông điệp snackbar
    const navigate = useNavigate(); // Khởi tạo hàm điều hướng

    // Fetch tỉnh khi trang được tải
    useEffect(() => {
        fetchProvinces();
    }, []);

    // Fetch huyện khi tỉnh được chọn
    useEffect(() => {
        if (newStaff.province && provinces.length > 0) {
            const province = provinces.find((prov) => prov.full_name === newStaff.province);
            if (province) {
                fetchDistricts(province.id);
            } else {
                setDistricts([]);
            }
        }
    }, [newStaff.province, provinces]);

    // Fetch xã khi huyện được chọn
    useEffect(() => {
        if (newStaff.district && districts.length > 0) {
            const district = districts.find((dist) => dist.full_name === newStaff.district);
            if (district) {
                fetchWards(district.id);
            } else {
                setWards([]);
            }
        }
    }, [newStaff.district, districts]);

    // Hàm fetch tỉnh từ API
    const fetchProvinces = async () => {
        setLoadingProvinces(true);
        try {
            const response = await axios.get("https://esgoo.net/api-tinhthanh/1/0.htm");
            const data = response.data;
            if (data.error === 0) {
                setProvinces(data.data); // Cập nhật danh sách tỉnh
            } else {
                // Xử lý lỗi nếu cần
            }
        } catch (error) {
            // Xử lý lỗi khi gọi API
        } finally {
            setLoadingProvinces(false);
        }
    };

    // Hàm fetch huyện từ API
    const fetchDistricts = async (provinceId: string) => {
        setLoadingDistricts(true);
        try {
            const response = await axios.get(`https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`);
            if (response.data.error === 0) {
                setDistricts(response.data.data); // Cập nhật danh sách huyện
            } else {
                setDistricts([]);
            }
        } catch (error) {
            setDistricts([]); // Xử lý lỗi
        } finally {
            setLoadingDistricts(false);
        }
    };

    // Hàm fetch xã từ API
    const fetchWards = async (districtId: string) => {
        setLoadingWards(true);
        try {
            const response = await axios.get(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`);
            if (response.data.error === 0) {
                setWards(response.data.data); // Cập nhật danh sách xã
            } else {
                setWards([]);
            }
        } catch (error) {
            setWards([]); // Xử lý lỗi
        } finally {
            setLoadingWards(false);
        }
    };

    // Hàm xử lý thay đổi địa điểm
    const handleLocationChange = (
        type: 'province' | 'district' | 'ward',
        newValue: Province | District | Ward | null,
        form: FormikProps<Staff>
    ) => {
        if (newValue) {
            if (type === 'province') {
                form.setFieldValue('province', newValue.full_name); // Cập nhật tỉnh
                form.setFieldValue('district', ''); // Reset huyện
                form.setFieldValue('ward', ''); // Reset xã
                setNewStaff((prev) => ({ ...prev, province: newValue.full_name, district: null, ward: null }));
                fetchDistricts(newValue.id); // Fetch huyện mới
            } else if (type === 'district') {
                form.setFieldValue('district', newValue.full_name); // Cập nhật huyện
                form.setFieldValue('ward', ''); // Reset xã
                setNewStaff((prev) => ({ ...prev, district: newValue.full_name, ward: null }));
                fetchWards(newValue.id); // Fetch xã mới
            } else if (type === 'ward') {
                form.setFieldValue('ward', newValue.full_name); // Cập nhật xã
                setNewStaff((prev) => ({ ...prev, ward: newValue.full_name }));
            }
        }
    };

    // Xác thực dữ liệu nhập vào
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


    // Hàm xử lý khi gửi biểu mẫu
    const handleSubmit = async (
        values: Staff,
        { resetForm, setSubmitting }: FormikHelpers<Staff>
    ) => {
        setSubmitting(true); // Đặt trạng thái gửi thành true

        try {
            const selectedProvince = provinces.find((p) => p.id === values.province);
            if (selectedProvince) values.province = selectedProvince.name;

            const selectedDistrict = districts.find((d) => d.id === values.district);
            if (selectedDistrict) values.district = selectedDistrict.name;

            const selectedWard = wards.find((w) => w.id === values.ward);
            if (selectedWard) values.ward = selectedWard.name;

            const payload = {
                ...values,
                province: values.province,
                district: values.district,
                ward: values.ward,
            };

            const response = await axios.post("http://localhost:8080/api/v1/staffs", payload);

            if (response.status === 201) {
                const { code, password } = response.data;
                setNewStaff((prev) => ({ ...prev, code, password }));


                const serviceId = 'service_t622scu';
                const templateId = 'template_j3dv5du';
                const publicKey = 'OHyULXp7jha_7dpil';

                const templateParams = {
                    from_name: 'Fashion Canth Shop',
                    from_email: 'no-reply@fashioncanthshop.com',
                    to_name: values.name,
                    to_email: values.email,
                    message: `Tài khoản của bạn:\nMã nhân viên: ${code}\nMật khẩu: ${password}`,
                };

                // Gửi email
                await emailjs.send(serviceId, templateId, templateParams, publicKey);
                toast.success('Nhân viên đã thêm thành công! Thông tin đã gửi qua email.');

                resetForm(); // Reset biểu mẫu
                navigate("/admin/manage/staff"); // Điều hướng đến trang quản lý nhân viên
            }
        } catch (error) {
            toast.error(`Lỗi lưu nhân viên`); // Hiển thị lỗi
        } finally {
            setSubmitting(false); // Kết thúc trạng thái gửi
        }
    };




    // Hàm reset biểu mẫu
    const handleReset = (resetForm: () => void) => {
        resetForm();
        setNewStaff(initialStaffState); // Reset trạng thái nhân viên mới
    };

    // Hàm đóng snackbar
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // Hàm mở hộp thoại quét mã CCCD
    const handleQuetCCCDNhanVienClick = () => {
        setOpenDialog(true);
    };

    // Hàm đóng hộp thoại
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    // Hàm định dạng ngày
    const parseDate = (dateString: string): string | null => {
        if (dateString.length === 8) {
            const day = dateString.slice(0, 2);
            const month = dateString.slice(2, 4);
            const year = dateString.slice(4, 8);
            const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            return formattedDate; // Trả về định dạng ngày chuẩn
        }
        return null;
    };

    // Hook để quét mã QR
    useEffect(() => {
        if (openDialog && scannerRef.current) {
            const html5QrCodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 350 }, false);
    
            html5QrCodeScanner.render(
                async (data: string) => {
                    const cccdParts = data.split('|');
                    if (cccdParts.length >= 6) {
                        const citizenId = cccdParts[0];
                        const name = cccdParts[2];
                        const birthDay = parseDate(cccdParts[3]);
                        const gender = cccdParts[4] === 'Nam';
                        const diaChi = cccdParts[5];
                        const diaChiSplit = diaChi.split(",");
    
                        if (!birthDay) {
                            console.error('Invalid date format in QR code');
                            return;
                        }
    
                        const soNha = diaChiSplit[0];
                        const tinhName = diaChiSplit[3] || ''; // check to prevent undefined
                        const foundTinh = provinces.find((province) =>
                            province.full_name.toLowerCase().includes(tinhName.toLowerCase())
                        );
    
                        if (foundTinh && foundTinh.id) {
                            try {
                                const districtResponse = await axios.get(`https://esgoo.net/api-tinhthanh/2/${foundTinh.id}.htm`);
                                if (districtResponse.status === 200) {
                                    setDistricts(districtResponse.data.data);
                                    const foundQuanOBJ = districtResponse.data.data.find((district: District) =>
                                        district.full_name.toLowerCase().includes((diaChiSplit[2] || '').toLowerCase())
                                    );
    
                                    if (foundQuanOBJ && foundQuanOBJ.id) {
                                        const wardResponse = await axios.get(`https://esgoo.net/api-tinhthanh/3/${foundQuanOBJ.id}.htm`);
                                        if (wardResponse.status === 200) {
                                            setWards(wardResponse.data.data);
                                            const foundPhuongOBJ = wardResponse.data.data.find((ward : Ward) =>
                                                ward.full_name.toLowerCase().includes((diaChiSplit[1] || '').toLowerCase())
                                            );
    
                                            setNewStaff(prevState => ({
                                                ...prevState,
                                                citizenId,
                                                name,
                                                birthDay,
                                                address: soNha,
                                                province: foundTinh.full_name || "",
                                                district: foundQuanOBJ.full_name || "",
                                                ward: foundPhuongOBJ?.full_name || "",
                                                gender,
                                            }));
    
                                            form.setFieldValue("province", foundTinh.full_name || "");
                                            form.setFieldValue("district", foundQuanOBJ.full_name || "");
                                            form.setFieldValue("ward", foundPhuongOBJ?.full_name || "");
                                        }
                                    }
                                }
                            } catch (error) {
                                console.error(error); // Add proper error handling
                            }
                        } else {
                            console.error('Province not found');
                            setNewStaff(prevState => ({
                                ...prevState,
                                citizenId,
                                name,
                                birthDay,
                                address: soNha,
                                province: "",
                                gender,
                            }));
                        }
    
                        setOpenDialog(false); // Close dialog after scanning
                        html5QrCodeScanner.clear(); // Clear the scanner
                    } else {
                        console.error('Invalid QR code format');
                    }
                },
                (error: unknown) => {
                    console.error(error); // Handle scan error
                }
            );
    
            return () => {
                html5QrCodeScanner.clear(); // Cleanup when the component is unmounted
            };
        }
    }, [openDialog, provinces]);

    // Đồng bộ dữ liệu mới với Formik
    const SyncFormikWithNewStaff = () => {
        const formik = useFormikContext<Staff>();

        useEffect(() => {
            formik.setValues(newStaff); // Cập nhật giá trị Formik
        }, [newStaff]);

        return null; // Không trả về gì
    };

    return (
        <div>
            {/* <h1 className="text-center font-semibold text-2xl mb-4 text-transform: uppercase">Thêm nhân viên</h1> */}

            <div className="bg-white p-6 shadow-md rounded-lg mb-6 w-full">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    {/* Left-aligned Heading */}
                    <p className="text-left text-xl font-bold">THÊM NHÂN VIÊN</p>

                    {/* Right-aligned Button */}
                    <Box style={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            color="primary"
                            className="btn-outline-info"
                            onClick={handleQuetCCCDNhanVienClick}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <BsQrCodeScan className="mr-2" style={{ fontSize: '24px' }} />
                            Quét CCCD
                        </Button>
                    </Box>
                </div>

                <div className={`shadow-xl px-8 z-10 bg-white py-2 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/6 ${openDialog ? "" : "hidden"}`}>
                    <div className='flex flex-col'>
                        <div className='flex justify-between'>
                            <label>Quét thẻ căn cước công dân</label>
                            <button onClick={handleCloseDialog}><CloseOutlined /></button>
                        </div>
                        <div>
                            <div id="reader" ref={scannerRef}></div>
                        </div>
                    </div>
                </div>
                <Formik
                    initialValues={newStaff}
                    validationSchema={validationSchema}
                    validateOnChange={true} // Xác thực khi thay đổi
                    validateOnBlur={true} // Xác thực khi mất tiêu điểm
                    onSubmit={handleSubmit}
                    enableReinitialize={true}
                >
                    {({ errors, touched, resetForm, setFieldValue, values, isSubmitting }) => (
                        <Form>
                            <SyncFormikWithNewStaff />
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
                                                    setFieldValue("name", e.target.value);
                                                    setNewStaff((prev) => ({ ...prev, name: e.target.value }));
                                                }}
                                                value={newStaff.name}
                                            />
                                            {touched.name && errors.name && (
                                                <div style={{ color: "red", fontSize: "0.875rem", marginTop: "0.25rem", minHeight: "20px" }}>
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
                                                    setFieldValue("citizenId", e.target.value);
                                                    setNewStaff((prev) => ({ ...prev, citizenId: e.target.value }));
                                                }}
                                                value={newStaff.citizenId}
                                            />
                                            {touched.citizenId && errors.citizenId && (
                                                <div style={{ color: "red", fontSize: "0.875rem", marginTop: "0.25rem", minHeight: "20px" }}>
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
                                                // Hiển thị ngày sinh nếu có, chuyển đổi từ định dạng "YYYY-MM-DD" sang "Date" object để tương thích với DatePicker
                                                value={newStaff.birthDay ? dayjs(newStaff.birthDay, 'YYYY-MM-DD').toDate() : null}
                                                onChange={(date) => {
                                                    if (date) {
                                                        // Chuyển đổi ngày từ "Date" sang "YYYY-MM-DD"
                                                        const formattedDate = dayjs(date).format('YYYY-MM-DD');

                                                        // Cập nhật giá trị vào form (Formik) và state (newStaff)
                                                        setFieldValue('birthDay', formattedDate);
                                                        setNewStaff((prev) => ({
                                                            ...prev,
                                                            birthDay: formattedDate
                                                        }));
                                                    } else {
                                                        // Nếu người dùng xoá ngày, reset giá trị birthDay
                                                        setFieldValue('birthDay', '');
                                                        setNewStaff((prev) => ({
                                                            ...prev,
                                                            birthDay: ''
                                                        }));
                                                    }
                                                }}
                                                // Ngăn người dùng chọn ngày tương lai
                                                disableDate={(current) => {
                                                    const dayjsCurrent = dayjs(current); // Chuyển đổi current sang dayjs
                                                    return dayjsCurrent.isAfter(dayjs().endOf('day')); // Kiểm tra xem có phải ngày tương lai không
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
                                                            checked={newStaff.gender === true}
                                                            onChange={() => {
                                                                form.setFieldValue('gender', true);
                                                                setNewStaff((prev) => ({ ...prev, gender: true }));
                                                            }}
                                                        >
                                                            Nam
                                                        </Radio>
                                                        <Radio
                                                            value="Nữ"
                                                            checked={newStaff.gender === false}
                                                            onChange={() => {
                                                                form.setFieldValue('gender', false);
                                                                setNewStaff((prev) => ({ ...prev, gender: false }));
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
                                        <FormItem
                                            asterisk
                                            label="Tỉnh/Thành phố"
                                            invalid={errors.province && touched.province}
                                            errorMessage={errors.province}
                                        >
                                            <Field name="province">
                                                {({ form }: FieldProps<Staff>) => (
                                                    <Select
                                                        isDisabled={loadingProvinces}
                                                        value={provinces.find(s => s.full_name === newStaff.province) || null}
                                                        placeholder="Chọn tỉnh/thành phố..."
                                                        getOptionLabel={(option) => option.full_name}
                                                        getOptionValue={(option) => option.full_name}
                                                        options={provinces}
                                                        onChange={(newValue: SingleValue<Province> | null) => {
                                                            handleLocationChange("province", newValue, form);
                                                            form.setFieldValue("province", newValue ? newValue.full_name : "");
                                                            setNewStaff((prev) => ({ ...prev, province: newValue ? newValue.full_name : "" }));
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
                                                {({ form }: FieldProps<Staff>) => (
                                                    <Select
                                                        // isDisabled={loadingDistricts}
                                                        value={districts.find(s => s.full_name === newStaff.district) || null}
                                                        placeholder="Chọn quận/huyện..."
                                                        getOptionLabel={(option) => option.full_name}
                                                        getOptionValue={(option) => option.full_name}
                                                        options={districts}
                                                        onChange={(newValue: SingleValue<District> | null) => {
                                                            handleLocationChange("district", newValue, form);
                                                            form.setFieldValue("district", newValue ? newValue.full_name : "");
                                                            setNewStaff((prev) => ({ ...prev, district: newValue ? newValue.full_name : "" }));
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
                                                {({ form }: FieldProps<Staff>) => (
                                                    <Select
                                                        // isDisabled={loadingWards}
                                                        value={wards.find(s => s.full_name === newStaff.ward) || null}
                                                        placeholder="Chọn xã/phường/thị trấn..."
                                                        getOptionLabel={(option) => option.full_name}
                                                        getOptionValue={(option) => option.full_name}
                                                        options={wards}
                                                        onChange={(newValue: SingleValue<Ward> | null) => {
                                                            handleLocationChange("ward", newValue, form);
                                                            form.setFieldValue("ward", newValue ? newValue.full_name : "");
                                                            setNewStaff((prev) => ({ ...prev, ward: newValue ? newValue.full_name : "" }));
                                                        }}
                                                        onBlur={() => form.setFieldTouched("ward", true)}
                                                    />
                                                )}
                                            </Field>
                                        </FormItem>
                                        <FormItem
                                            asterisk
                                            label="Số đường/số nhà"
                                            invalid={!!errors.address && touched.address}
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="address"
                                                placeholder="Nhập số đường/số nhà..."
                                                component={Input}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    setFieldValue("address", e.target.value);
                                                    setNewStaff((prev) => ({ ...prev, address: e.target.value }));
                                                }}
                                                value={newStaff.address}
                                            />
                                            {touched.address && errors.address && (
                                                <div style={{ color: "red", fontSize: "0.875rem", marginTop: "0.25rem", minHeight: "20px" }}>
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
                                                    setFieldValue("phone", e.target.value);
                                                    setNewStaff((prev) => ({ ...prev, phone: e.target.value }));
                                                }}
                                                value={newStaff.phone}
                                            />
                                            {touched.phone && errors.phone && (
                                                <div style={{ color: "red", fontSize: "0.875rem", marginTop: "0.25rem", minHeight: "20px" }}>
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
                                                    setFieldValue("email", e.target.value);
                                                    setNewStaff((prev) => ({ ...prev, email: e.target.value }));
                                                }}
                                                value={newStaff.email}
                                            />
                                            {touched.email && errors.email && (
                                                <div style={{ color: "red", fontSize: "0.875rem", marginTop: "0.25rem", minHeight: "20px" }}>
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
                                                    setFieldValue("note", e.target.value);
                                                    setNewStaff((prev) => ({ ...prev, note: e.target.value }));
                                                }}
                                                value={newStaff.note}
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
                                    >
                                        <IoPersonAdd className="mr-2" style={{ fontSize: '20px' }} />
                                        Lưu
                                    </Button>

                                    <Button
                                        type="button"
                                        onClick={() => handleReset(resetForm)}
                                        className="flex items-center justify-center"
                                        style={{
                                            height: '40px',
                                            width: '110px',
                                            lineHeight: '40px',
                                            padding: '0',
                                            fontSize: '15px',
                                            marginLeft: '1rem' // Thêm khoảng cách bên trái cho nút Đặt lại
                                        }}
                                    >
                                        <RxReset className="mr-2" style={{ fontSize: '18px' }} />
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

export default AddStaffPage;