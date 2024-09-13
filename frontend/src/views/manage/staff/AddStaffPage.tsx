import React, { ChangeEvent, FormEvent, Fragment, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    TextField,
    Typography,
    Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { Html5QrcodeScanner } from "html5-qrcode";
import emailjs from 'emailjs-com';
import { CloseOutlined } from '@mui/icons-material';

// Khai báo các interface
interface Staff {
    id?: string;
    code: string;
    name: string;
    email: string;
    phone: string;
    citizenId: string;
    address: string;
    province: string;
    district: string;
    password: string,
    ward: string;
    status: string;
    note: string;
    birthDay: string;
    gender?: boolean;
    deleted?: boolean;
    role: {
        id: string;
        name: string;
    };
}

interface Tinh {
    id: string,
    name: string,
    full_name: string
}

interface Quan {
    id: string,
    name: string,
    full_name: string
}

interface Phuong {
    id: string,
    name: string,
    full_name: string
}

interface AddNhanVienProps {
    onAddSuccess?: () => void;
}

const AddStaffPage: React.FC<AddNhanVienProps> = ({ onAddSuccess }) => {
    const initialStaffState: Staff = {
        id: '',
        code: generateRandomMaNV(),
        name: '',
        email: '',
        phone: '',
        citizenId: '',
        address: '',
        province: '',
        district: '',
        ward: '',
        status: 'active',
        note: '',
        birthDay: '',
        gender:true,
        password: generateRandomPassword(),
        deleted: false,
        role: {
            id: '',
            name: ''
        }
    };

    const [newStaff, setNewStaff] = useState<Staff>(initialStaffState);
    const [formErrors, setFormErrors] = useState<Partial<Staff>>({});
    const [provinces, setProvinces] = useState<Tinh[]>([]);
    const [districts, setDistricts] = useState<Quan[]>([]);
    const [wards, setWards] = useState<Phuong[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState(false);
    const scannerRef = useRef<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProvinces();
    }, []);
    useEffect(() => {
        if (newStaff.name) {
            const code = generateRandomMaNV(newStaff.name);
            setNewStaff(prevState => ({ ...prevState, code }));
        }
    }, [newStaff.name]);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | { name?: any; value: any }>) => {
        const { name, value } = e.target;
        setNewStaff({ ...newStaff, [name]: value });
    };

    const fetchProvinces = async () => {
        try {
            const response = await axios.get('https://esgoo.net/api-tinhthanh/1/0.htm');
            const data = response.data;
            if (data.error === 0) {
                setProvinces(data.data);
            } else {
                console.error('Lỗi khi tải dữ liệu tỉnh/thành phố:', data.message);
            }
        } catch (error) {
            console.error('Lỗi khi gọi API tỉnh/thành phố:', error);
        }
    };

    const fetchDistricts = async (provinceId: string) => {
        try {
            const response = await axios.get(`https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`);
            const data_district = response.data;
            if (data_district.error === 0) {
                setDistricts(data_district.data);
            } else {
                console.error('Lỗi khi tải dữ liệu quận/huyện:', data_district.message);
            }
        } catch (error) {
            console.error(`Lỗi khi gọi API quận/huyện với provinceId ${provinceId}:`, error);
        }
    };

    const fetchWards = async (districtId: string) => {
        try {
            const response = await axios.get(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`);
            const data_ward = response.data;
            if (data_ward.error === 0) {
                setWards(data_ward.data);
            } else {
                console.error('Lỗi khi tải dữ liệu phường/xã:', data_ward.message);
            }
        } catch (error) {
            console.error(`Lỗi khi gọi API phường/xã với districtId ${districtId}:`, error);
        }
    };

    const handleProvinceChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const province = event.target.value as Tinh;
        setNewStaff(prevState => ({
            ...prevState,
            province: province.full_name,
        }));
        fetchDistricts(province.id);
    };

    const handleDistrictChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const district = event.target.value as Quan;
        setNewStaff(prevState => ({
            ...prevState,
            district: district.full_name,
        }));
        fetchWards(district.id);
    };

    const handleWardChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const ward = event.target.value as Phuong;
        setNewStaff(prevState => ({
            ...prevState,
            ward: ward.full_name,
        }));
    };


const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = validateForm(newStaff);
    if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
    }

    try {
        console.log("Form data being submitted: ", newStaff);

        // POST request to add a new staff member
        const response = await axios.post<Staff>('http://localhost:8080/api/v1/staffs', newStaff, {
            
            method: "POST",
            headers: {
                "Content-Type": "application/json",
             },
        });
        console.log(newStaff.code)
        console.log('Saved staff:', response.data);

        // EmailJS integration
        const serviceId = 'service_tmmslu9';
        const templateId = 'template_lad6zvl';
        const publicKey = '2TdUStOWX9A6vm7Ex';

        const templateParams = {
            from_name: 'BeeShop',
            from_email: 'no-reply@beeshop.com',
            to_name: newStaff.code,
            to_email: newStaff.email,
            message: `Your account:\nEmployee code: ${newStaff.code}\nPassword: ${newStaff.password}`,
        };

        try {
            const emailResponse = await emailjs.send(serviceId, templateId, templateParams, publicKey);
            console.log('Email sent successfully!', emailResponse);
        } catch (emailError) {
            console.error('EmailJS error:', emailError);
            setSnackbarMessage('Email không thể gửi. Vui lòng kiểm tra lại.');
            setSnackbarOpen(true);
        }

        setNewStaff(initialStaffState);
        setFormErrors({});
        setSnackbarMessage('Thêm nhân viên thành công và email đã được gửi.');
        setSnackbarOpen(true);

        if (typeof onAddSuccess === 'function') {
            onAddSuccess();
        } else {
            navigate('/manage');
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.error('Response error data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            } else {
                console.error('Axios error without response:', error.message);
            }
        } else {
            console.error('Non-Axios error:', error);
        }

        setSnackbarMessage('Lỗi khi lưu thông tin nhân viên hoặc gửi email.');
        setSnackbarOpen(true);
    }
};

    

    const validateForm = (newStaff: Staff): Partial<Staff> => {
        const errors: Partial<Staff> = {};

        if (!newStaff.name) {
            errors.name = 'Họ và Tên là bắt buộc';
        } else if (!/^[\p{L}\s]+$/u.test(newStaff.name)) {
            errors.name = 'Họ và Tên chỉ chứa chữ cái và khoảng trắng';
        }

        if (!newStaff.phone) {
            errors.phone = 'Số điện thoại là bắt buộc';
        } else if (!/^\d{10,11}$/.test(newStaff.phone)) {
            errors.phone = 'Số điện thoại không hợp lệ';
        }

        if (!newStaff.email) {
            errors.email = 'Email là bắt buộc';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newStaff.email)) {
            errors.email = 'Email không hợp lệ';
        }

        if (!newStaff.citizenId) {
            errors.citizenId = 'CCCD là bắt buộc';
        } else if (!/^\d{12}$/.test(newStaff.citizenId)) {
            errors.citizenId = 'CCCD phải chứa 12 số';
        }

        if (!newStaff.birthDay) {
            errors.birthDay = 'Ngày sinh là bắt buộc';
        } else {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(newStaff.birthDay)) {
                errors.birthDay = 'Ngày sinh không hợp lệ (YYYY-MM-DD)';
            } else {
                const birthDayDate = new Date(newStaff.birthDay);
                const today = new Date();
                if (birthDayDate > today) {
                    errors.birthDay = 'Ngày sinh không được lớn hơn ngày hiện tại';
                } else {
                    let age = today.getFullYear() - birthDayDate.getFullYear();
                    const monthDiff = today.getMonth() - birthDayDate.getMonth();
                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDayDate.getDate())) {
                        age--;
                    }
                    if (age < 16 || age > 40) {
                        errors.birthDay = 'Tuổi phải lớn hơn 16 và nhỏ hơn 40 tuổi';
                    }
                }
            }
        }

        if (!newStaff.address) {
            errors.address = 'Địa chỉ là bắt buộc';
        }

        if (!newStaff.province) {
            errors.province = 'Tỉnh là bắt buộc';
        }

        if (!newStaff.district) {
            errors.district = 'Quận là bắt buộc';
        }

        if (!newStaff.ward) {
            errors.ward = 'Phường là bắt buộc';
        }

        return errors;
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleQuetCCCDNhanVienClick = () => {
        setOpenDialog(true); // Mở dialog khi click vào nút "Quét CCCD"
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const parseDate = (dateString: string): string | null => {
        if (dateString.length === 8) {
            const day = dateString.slice(0, 2);
            const month = dateString.slice(2, 4);
            const year = dateString.slice(4, 8);
            const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            return formattedDate;
        }
        return null;
    };

    useEffect(() => {
        if (openDialog && scannerRef.current) {
            const html5QrCodeScanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: 350 },
                false
            );
    
            html5QrCodeScanner.render(
                (data: string) => {
                    const cccdParts = data.split('|');
                    if (cccdParts.length >= 5) {
                        const citizenId = cccdParts[0];
                        const name = cccdParts[2];
                        const birthDay = parseDate(cccdParts[3]);
                        if (!birthDay) {
                            console.error('Invalid date format in QR code');
                            return;
                        }
                        const gender = cccdParts[4] === 'Nam' ? "Nam" : "Nữ";
                        const diaChi = cccdParts[5];
                        const diaChiSplit = diaChi.split(",");
                        const soNha = diaChiSplit[0];
                        const tinhOBJ = provinces.find(s => s.full_name.toLowerCase().includes(diaChiSplit[3].toLowerCase()));
    
                        if (tinhOBJ?.id) {
                            axios.get(`https://esgoo.net/api-tinhthanh/2/${tinhOBJ?.id}.htm`).then(function (response) {
                                if (response.status === 200) {
                                    setDistricts(response.data.data);
    
                                    if (Array.isArray(response.data.data)) {
                                        const foundQuanOBJ = (response.data.data as Quan[]).find(s => s.full_name.toLowerCase().includes(diaChiSplit[2].toLowerCase()));
                                        setNewStaff(prevState => ({
                                            ...prevState,
                                            district: foundQuanOBJ?.full_name || "",
                                        }));
    
                                        if (foundQuanOBJ?.full_name) {
                                            axios.get(`https://esgoo.net/api-tinhthanh/3/${foundQuanOBJ.id}.htm`).then(function (response) {
                                                if (response.status === 200) {
                                                    setWards(response.data.data)
                                                    if (Array.isArray(response.data.data)) {
                                                        const foundPhuongOBJ = (response.data.data as Phuong[]).find(s => s.full_name.toLowerCase().includes(diaChiSplit[1].toLowerCase()));
                                                        setNewStaff(prevState => ({
                                                            ...prevState,
                                                            ward: foundPhuongOBJ?.full_name || "",
                                                        }));
                                                    } else {
                                                        console.error("Expected an array but received:", response.data);
                                                    }
                                                }
                                            })
                                        }
                                    } else {
                                        console.error("Expected an array but received:", response.data);
                                    }
    
                                    setNewStaff(prevState => ({
                                        ...prevState,
                                        citizenId: citizenId,
                                        name: name,
                                        birthDay: birthDay,
                                        role: { ...prevState.role, name: gender },
                                        address: soNha,
                                        province: tinhOBJ?.full_name || "",
                                    }));
                                }
                            });
                        } else {
                            setNewStaff(prevState => ({
                                ...prevState,
                                citizenId: citizenId,
                                name: name,
                                birthDay: birthDay,
                                role: { ...prevState.role, name: gender },
                                address: soNha,
                                province: tinhOBJ?.full_name || "",
                            }));
                        }
    
                        setOpenDialog(false);
                        html5QrCodeScanner.clear();
                    } else {
                        console.error('Dữ liệu mã QR không đúng định dạng');
                    }
                },
                (error: unknown) => {
                    console.error(error);
                }
            );
    
            return () => {
                html5QrCodeScanner.clear();
            };
        }
    }, [openDialog, provinces]);

    return (
        <Fragment>
            <Grid item>
                <Typography variant="h5" color="textPrimary" fontWeight="bold" style={{ color: '#666' }}>
                    THÊM MỚI NHÂN VIÊN
                </Typography>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 2 }}>
                <Button variant="contained" color="primary" onClick={handleQuetCCCDNhanVienClick}>
                    Quét CCCD
                </Button>
            </Box>
            <div className={`shadow-xl px-8 z-10 bg-white py-4 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/6 ${openDialog ? "" : "hidden"}`}>
                <div className='flex flex-col'>
                    <div className='flex justify-between'>
                        <label>Quét CCCD</label>
                        <button onClick={handleCloseDialog}><CloseOutlined /></button>
                    </div>
                    <div>
                        <div id="reader" ref={scannerRef}></div>
                    </div>
                </div>
            </div>
            <Grid container spacing={3}>
      <Grid item xs={12}>
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={4} style={{ width: '33.33%' }}>
              <TextField
                label="Họ và tên"
                name="name"
                value={newStaff.name}
                onChange={handleInputChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="CCCD"
                name="citizenId"
                value={newStaff.citizenId}
                onChange={handleInputChange}
                error={!!formErrors.citizenId}
                helperText={formErrors.citizenId}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Ngày sinh"
                type="date"
                name="birthDay"
                value={newStaff.birthDay}
                onChange={handleInputChange}
                error={!!formErrors.birthDay}
                helperText={formErrors.birthDay}
                fullWidth
                required
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">Giới tính</FormLabel>
                <RadioGroup
                  row
                  aria-label="gender"
                  name="gender"
                  value={newStaff.gender ? 'true' : 'false'}
                  onChange={(e) => setNewStaff({ ...newStaff, gender: e.target.value === 'true' })}
                >
                  <FormControlLabel value="true" control={<Radio />} label="Nam" />
                  <FormControlLabel value="false" control={<Radio />} label="Nữ" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={4} style={{ width: '33.33%' }}>
              <FormControl fullWidth required margin="normal" error={!!formErrors.province}>
                <InputLabel>Tỉnh/Thành phố</InputLabel>
                <Select
                  name="province"
                  value={provinces.find(s => s.full_name === newStaff.province) || ""}
                  onChange={handleProvinceChange}
                  label="Tỉnh/Thành phố"
                >
                  {provinces.map(province => (
                    <MenuItem key={province.id} value={province}>{province.full_name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth required margin="normal" error={!!formErrors.district}>
                <InputLabel>Quận/Huyện</InputLabel>
                <Select
                  name="district"
                  value={Array.isArray(districts) && districts.find(s => s.full_name === newStaff.district) || ""}
                  onChange={handleDistrictChange}
                  label="Quận/Huyện"
                >
                  {Array.isArray(districts) && districts.map(district => (
                    <MenuItem key={district.id} value={district}>{district.full_name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth required margin="normal" error={!!formErrors.ward}>
                <InputLabel>Phường/Xã</InputLabel>
                <Select
                  name="ward"
                  value={Array.isArray(wards) && wards.find(s => s.full_name === newStaff.ward) || ""}
                  onChange={handleWardChange}
                  label="Phường/Xã"
                >
                  {wards.map(ward => (
                    <MenuItem key={ward.id} value={ward}>{ward.full_name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Địa Chỉ"
                name="address"
                value={newStaff.address}
                onChange={handleInputChange}
                error={!!formErrors.address}
                helperText={formErrors.address}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={4} style={{ width: '33.33%' }}>
              <TextField
                label="Số điện thoại"
                name="phone"
                value={newStaff.phone}
                onChange={handleInputChange}
                error={!!formErrors.phone}
                helperText={formErrors.phone}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={newStaff.email}
                onChange={handleInputChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
              />
              <TextField
                label="Ghi chú"
                name="note"
                value={newStaff.note}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={4.5}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disableElevation
                style={{ marginRight: 10 }}
              >
                {isEditMode ? 'Cập nhật' : 'Thêm mới'}
              </Button>
              <Button
                variant="contained"
                disableElevation
                onClick={() => navigate('/manage/staff')}
              >
                Hủy bỏ
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
 


            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
        </Fragment>
    );
};

const removeVietnameseTones = (str: string): string => {
    str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    str = str.replace(/đ/g, 'd').replace(/Đ/g, 'D');
    return str;
};

// const generateRandomMaNV = (hoTen: string = ''): string => {
//     const nameStringDefault = 'defaultnv';

//     if (!hoTen || typeof hoTen !== 'string') {
//         const randomMa = Math.floor(10000 + Math.random() * 90000).toString();
//         return `${nameStringDefault}NV${randomMa}`;
//     }

//     hoTen = removeVietnameseTones(hoTen);
//     const nameParts = hoTen.split(' ');

//     const ho = nameParts[0].charAt(0); // Chữ cái đầu của họ
//     const tenDem = nameParts.length > 2 ? nameParts.slice(1, -1).map(part => part.charAt(0)).join('') : ''; // Chữ cái đầu của tên đệm, nếu có
//     const ten = nameParts[nameParts.length - 1]; // Tên

//     const nameInitials = ten.toLowerCase() + ho.toLowerCase() + tenDem.toLowerCase();
    
//     const randomMa = Math.floor(10000 + Math.random() * 90000).toString(); // 5 số ngẫu nhiên

//     return `${nameInitials}NV${randomMa}`;
// };


// hùng test có thể xóa đi
const generateRandomMaNV = (hoTen: string = ''): string => {
    const nameStringDefault = 'defaultnv';

    if (!hoTen || typeof hoTen !== 'string') {
        const randomChar = generateRandomString(1); // Sinh 1 ký tự ngẫu nhiên
        return `${nameStringDefault}${randomChar}`;  // Ghép với tên mặc định
    }

    hoTen = removeVietnameseTones(hoTen);
    const nameParts = hoTen.split(' ');

    const ten = nameParts[nameParts.length - 1]; // Tên (lấy phần cuối cùng của họ tên)

    const randomChar = generateRandomString(1); // Sinh 1 ký tự ngẫu nhiên

    return `${ten.toLowerCase()}${randomChar}`; // Ghép tên với 1 ký tự ngẫu nhiên
};

// Hàm phụ để sinh ký tự ngẫu nhiên
const generateRandomString = (length: number): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
};


// hùng test có thể xóa đi

const generateRandomPassword = (): string => {
    const randomPassword = Math.floor(Math.random() * 90000) + 10000; // Generate random 5-digit number
    return `${randomPassword}`;
};



export default AddStaffPage;