import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    deleteProductDetail,
    toggleDeleteConfirmation,
    getProductDetails,
    useAppDispatch, 
    useAppSelector,
} from '../store'

const ProductDetailDeleteConfirmation = () => {
    const dispatch = useAppDispatch()
    const dialogOpen = useAppSelector(
        (state) => state.salesProductDetailList.data.deleteConfirmation
    )
    const selectedProduct = useAppSelector(
        (state) => state.salesProductDetailList.data.selectedProductDetail
    )
   
    const tableData = useAppSelector(
        (state) => state.salesProductDetailList.data.tableData
    )

    const onDialogClose = () => {
        dispatch(toggleDeleteConfirmation(false))
    }

    const onDelete = async () => {
        dispatch(toggleDeleteConfirmation(false))
        const success = await deleteProductDetail({ id: selectedProduct })
        if (success) {
        dispatch(getProductDetails(tableData))
            toast.push( 
                <Notification
                    title={'Successfuly Deleted'}
                    type="success"
                    duration={2500}
                >
                    Product successfuly deleted
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        }
    }

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
                Bạn có chắc chắn muốn ngừng bán sản phẩm này không? Tất thông tin sản phẩm liên quan
                đến sản phẩm này cũng sẽ bị xóa.
            </p>
        </ConfirmDialog>
    )
}

export default ProductDetailDeleteConfirmation
