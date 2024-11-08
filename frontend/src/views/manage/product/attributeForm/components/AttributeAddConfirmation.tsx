import reducer, {
    getAttributes,
    addAttribute,
    toggleAddAttributeConfirmation,
    useAppDispatch,
    useAppSelector,
} from '../store';
import { injectReducer } from '@/store/';
import Button from '@/components/ui/Button';
import Dialog from '@/components/ui/Dialog';
import { useState } from 'react';
import { FormItem } from '@/components/ui/Form';
import Input from '@/components/ui/Input';
import { Option } from '../store';
import toast from '@/components/ui/toast';
import Notification from '@/components/ui/Notification';
injectReducer('attributeNew', reducer);

type AttributeAddConfirmationProps = {
    apiFunc: any;
    apiAdd: any;
    label: string;
};

const AttributeAddConfirmation = ({ apiFunc, apiAdd, label }: AttributeAddConfirmationProps) => {
    const dispatch = useAppDispatch();
    const addAttributeState = useAppSelector((state) => state.attributeNew.attributeAdd.addAttribute); // Lấy giá trị addAttribute từ Redux
    const [inputValue, setInputValue] = useState<string>('');
    const [addedAttribute, setAddedAttribute] = useState<Option | null>(null);

    const onDialogClose = () => {
        dispatch(toggleAddAttributeConfirmation(false)); // Đóng dialog
    };

    const generateRandomCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return Array.from({ length: 5 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    };

    const createAttribute = (name: string): Option => ({
        id: Math.floor(Math.random() * 1000),
        code: generateRandomCode(),
        name: name,
        deleted: false,
        createdDate: new Date().toISOString(),
        modifiedDate: new Date().toISOString(),
    });

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setInputValue(newName);
        const newAttribute = createAttribute(newName); // Tạo attribute mới
        setAddedAttribute(newAttribute); // Cập nhật addedAttribute
    };
    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.salesAttributeList.data.tableData
    )

    const onAdd = async () => {
        if (!addedAttribute) return;  

        dispatch(toggleAddAttributeConfirmation(false));
        const resultAction = await dispatch(addAttribute({ AttributeData: addedAttribute, apiAdd }));
        if (resultAction) {
            const requestData = { pageIndex, pageSize, sort, query };
            dispatch(getAttributes({ apiFunc, requestData }));
            toast.push(
                <Notification
                    title={'Successfully Deleted'}
                    type="success"
                    duration={2500}
                >
                    {label} được thêm thành công.
                </Notification>,
                {
                    placement: 'top-center',
                }
            );
        }
    };

    return (
        <Dialog
            isOpen={addAttributeState} // Sử dụng addAttribute từ Redux để quyết định xem dialog có mở không
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
        >
            <h5 className="mb-4">Thêm {label}</h5>
            <FormItem label={`Tên ${label}`}>
                <Input
                    value={inputValue} // Gán giá trị input từ state
                    onChange={onInputChange} // Xử lý sự kiện onChange
                />
            </FormItem>
            <div className="text-right mt-6">
                <Button className="ltr:mr-2 rtl:ml-2" variant="plain" onClick={onDialogClose}>
                    Hủy bỏ
                </Button>
                <Button
                    style={{ backgroundColor: 'rgb(79, 70, 229)', height: '40px' }}
                    variant="solid"
                    onClick={onAdd}
                >
                    Xác nhận
                </Button>
            </div>
        </Dialog>
    );
};

export default AttributeAddConfirmation;
