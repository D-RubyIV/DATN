import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, DatePicker, Input, Radio } from '@/components/ui';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { InitialData } from '../VoucherForm/VoucherForm';
import instance from '@/axios/CustomAxios';
import CustomerTable from '../components/CustomerTable';

type ICustomer = {
    id: number;
    name: string;
    email: string;
    phone: string;
};

const VoucherUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [initialData, setInitialData] = useState<InitialData | null>(null);
    const [selectedCustomerIds, setSelectedCustomerIds] = useState<number[]>([]);

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<InitialData>();

    const typeTicket = watch('typeTicket');

    useEffect(() => {
        const fetchVoucherData = async () => {
            try {
                const response = await instance.get(`/voucher/${id}`);
                const voucherData = response.data;

                // Set initial form values and directly pass Date objects to DatePicker
                setInitialData(voucherData);
                setValue('name', voucherData.name);
                setValue('code', voucherData.code);
                setValue('typeTicket', voucherData.typeTicket);
                setValue('quantity', voucherData.quantity);
                setValue('maxPercent', voucherData.maxPercent);
                setValue('minAmount', voucherData.minAmount);
                
                // Pass Date objects to DatePicker
                setValue('startDate', new Date(voucherData.startDate));
                setValue('endDate', new Date(voucherData.endDate));

                setSelectedCustomerIds(voucherData.customerIds || []);
            } catch (error) {
                toast.error('Không thể tải thông tin voucher');
                navigate('/admin/manage/voucher');
            }
        };

        if (id) {
            fetchVoucherData();
        }
    }, [id, setValue, navigate]);

    const onSubmit = async (data: InitialData) => {
        setLoading(true);
        try {
            const response = await instance.put(`/voucher/update/${id}`, { ...data, customerIds: selectedCustomerIds });
            if (response.status === 200) {
                toast.success('Cập nhật voucher thành công');
                navigate('/admin/manage/voucher');
            }
        } catch (error) {
            toast.error('Cập nhật voucher thất bại');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectedCustomersChange = useCallback((selectedCustomers: ICustomer[]) => {
        const customerIds = selectedCustomers.map((customer: ICustomer) => customer.id);
        setSelectedCustomerIds(customerIds);
    }, []);

    if (!initialData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Cập Nhật Phiếu Giảm Giá</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    {/* Form fields */}
                    <div>
                        <label className="block mb-2">Tên phiếu</label>
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: 'Vui lòng nhập tên phiếu' }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Nhập tên phiếu"
                                    error={errors.name?.message}
                                />
                            )}
                        />
                    </div>

                    <div>
                        <label className="block mb-2">Mã phiếu</label>
                        <Controller
                            name="code"
                            control={control}
                            rules={{ required: 'Vui lòng nhập mã phiếu' }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Nhập mã phiếu"
                                    error={errors.code?.message}
                                />
                            )}
                        />
                    </div>

                    <div>
                        <label className="block mb-2">Loại phiếu</label>
                        <Controller
                            name="typeTicket"
                            control={control}
                            rules={{ required: 'Vui lòng chọn loại phiếu' }}
                            render={({ field }) => (
                                <Radio.Group
                                    value={field.value}
                                    onChange={field.onChange}
                                >
                                    <Radio value="Individual">Cá nhân</Radio>
                                    <Radio value="Everybody">Tất cả</Radio>
                                </Radio.Group>
                            )}
                        />
                    </div>

                    <div>
                        <label className="block mb-2">Số lượng</label>
                        <Controller
                            name="quantity"
                            control={control}
                            rules={{
                                required: 'Vui lòng nhập số lượng',
                                min: { value: 1, message: 'Số lượng phải lớn hơn 0' }
                            }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="number"
                                    placeholder="Nhập số lượng"
                                    error={errors.quantity?.message}
                                />
                            )}
                        />
                    </div>

                    <div>
                        <label className="block mb-2">Phần trăm giảm tối đa</label>
                        <Controller
                            name="maxPercent"
                            control={control}
                            rules={{
                                required: 'Vui lòng nhập phần trăm giảm',
                                min: { value: 0, message: 'Phần trăm không được âm' },
                                max: { value: 100, message: 'Phần trăm không được vượt quá 100' }
                            }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="number"
                                    placeholder="Nhập phần trăm giảm"
                                    error={errors.maxPercent?.message}
                                />
                            )}
                        />
                    </div>

                    <div>
                        <label className="block mb-2">Số tiền tối thiểu</label>
                        <Controller
                            name="minAmount"
                            control={control}
                            rules={{
                                required: 'Vui lòng nhập số tiền tối thiểu',
                                min: { value: 0, message: 'Số tiền không được âm' }
                            }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="number"
                                    placeholder="Nhập số tiền tối thiểu"
                                    error={errors.minAmount?.message}
                                />
                            )}
                        />
                    </div>

                    <div>
                        <label className="block mb-2">Ngày bắt đầu</label>
                        <Controller
                            name="startDate"
                            control={control}
                            rules={{ required: 'Vui lòng chọn ngày bắt đầu' }}
                            render={({ field }) => (
                                <DatePicker
                                    {...field}
                                    showTime
                                    placeholder="Chọn ngày bắt đầu"
                                    error={errors.startDate?.message}
                                />
                            )}
                        />
                    </div>

                    <div>
                        <label className="block mb-2">Ngày kết thúc</label>
                        <Controller
                            name="endDate"
                            control={control}
                            rules={{ required: 'Vui lòng chọn ngày kết thúc' }}
                            render={({ field }) => (
                                <DatePicker
                                    {...field}
                                    showTime
                                    placeholder="Chọn ngày kết thúc"
                                    error={errors.endDate?.message}
                                />
                            )}
                        />
                    </div>

                    {typeTicket === 'Individual' && (
                        <div className="col-span-2">
                            <label className="block mb-2">Chọn khách hàng</label>
                            <CustomerTable onSelectedCustomersChange={handleSelectedCustomersChange} selectedCustomerIds={selectedCustomerIds} />
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-4">
                    <Button
                        type="button"
                        variant="plain"
                        onClick={() => navigate('/admin/manage/voucher')}
                    >
                        Hủy
                    </Button>
                    <Button
                        loading={loading}
                        variant="solid"
                        type="submit"
                    >
                        Cập nhật
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default VoucherUpdate;
