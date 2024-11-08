import toast from '@/components/ui/toast';
import Notification from '@/components/ui/Notification';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import {
    toggleDeleteConfirmation,
    deleteProduct,
    getAttributes,
    useAppDispatch,
    useAppSelector,
} from '../store';

type ProductDeleteConfirmationProps = {
    lablel:string;
    apiFunc: any;
    apiDelete: (id: string | string[]) => Promise<{ status: number }>;
};

const ProductDeleteConfirmation = ({ apiFunc, apiDelete, lablel }: ProductDeleteConfirmationProps) => {
    const dispatch = useAppDispatch();
    const dialogOpen = useAppSelector(
        (state) => state.salesAttributeList.data.deleteConfirmation
    );
    const selectedProduct = useAppSelector(
        (state) => state.salesAttributeList.data.selectedAttribute
    );
    const tableData = useAppSelector(
        (state) => state.salesAttributeList.data.tableData
    );

    const onDialogClose = () => {
        dispatch(toggleDeleteConfirmation(false));
    };
    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.salesAttributeList.data.tableData
    )

    const onDelete = async () => {
        dispatch(toggleDeleteConfirmation(false));
        const success = await deleteProduct({ id: selectedProduct }, apiDelete);
        if (success) {
            const requestData = { pageIndex, pageSize, sort, query };
            dispatch(getAttributes({ apiFunc, requestData }));
            toast.push(
                <Notification
                    title={'Successfully Deleted'}
                    type="success"
                    duration={2500}
                >
                    {lablel} được xóa thành công.
                </Notification>,
                {
                    placement: 'top-center',
                }
            );
        }

    };


    return (
        <ConfirmDialog
            isOpen={dialogOpen}
            type="danger"
            title="Xóa sản phẩm"
            confirmButtonColor="red-600"
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            onCancel={onDialogClose}
            onConfirm={onDelete}
        >
            <p>
                Bạn có chắc chắn muốn ngừng sử dụng {lablel} này không? Tất cả sản phẩm chi tiết liên quan
                đến sản phẩm này cũng sẽ bị xóa.
            </p>
        </ConfirmDialog>
    );
};

export default ProductDeleteConfirmation;
