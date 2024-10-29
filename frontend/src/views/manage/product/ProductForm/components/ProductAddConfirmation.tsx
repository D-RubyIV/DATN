import React, { MouseEvent } from 'react';
import { injectReducer } from '@/store/';
import Button from '@/components/ui/Button';
import Dialog from '@/components/ui/Dialog';
import { FormItem } from '@/components/ui/Form';
import Input from '@/components/ui/Input';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import { Option } from '../store';
import { Field, FormikErrors, FormikTouched, FieldProps } from 'formik';
import { apiCreateSalesProduct  } from '@/services/ProductSalesService';
import RichTextEditor from '@/components/shared/RichTextEditor';
import reducer, {
    addProduct,
    toggleAddProductConfirmation,
    useAppDispatch,
    useAppSelector,
} from '../store';
injectReducer('addProduct', reducer); // Nếu cần, thêm reducer cho sản phẩm

type FormFieldsName = {
    product: Option | null;
    description: string;
};

type ProductAddConfirmationProps = {
    touched: FormikTouched<FormFieldsName>;
    errors: FormikErrors<FormFieldsName>;
    values: FormFieldsName;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
    updateOptions: (field: string, newOption: Option) => void;
};

const ProductAddConfirmation = ({ setFieldValue, updateOptions, ...props }: ProductAddConfirmationProps) => {
    const dispatch = useAppDispatch();
    const { dataProduct: addedProduct, addProduct: openDialog } = useAppSelector((state) => ({
        dataProduct: state.addProduct.productAdd.dataProduct,
        addProduct: state.addProduct.productAdd.addProduct,
    }));
    const onDialogClose = (e: MouseEvent) => {
        dispatch(toggleAddProductConfirmation(false));
    };

    const onAdd = async () => {
        if (!addedProduct) {
            toast.push(
                <Notification title={'Error'} type="danger" duration={2500}>
                    Không có dữ liệu sản phẩm để thêm.
                </Notification>,
                { placement: 'top-center' }
            );
            return;
        }

        try {
            const resultAction = await dispatch(addProduct({ ProductData: addedProduct, apiFunc: apiCreateSalesProduct }));

            if (addProduct.fulfilled.match(resultAction)) {
                const newlyAddedProduct = resultAction.payload;

                const newProductOption: Option = {
                    id: newlyAddedProduct.id,
                    code: newlyAddedProduct.code,
                    name: newlyAddedProduct.name,
                    deleted: false,
                    createdDate: newlyAddedProduct.createdDate || new Date().toISOString(),
                    modifiedDate: newlyAddedProduct.modifiedDate || new Date().toISOString(),
                };

                setFieldValue('product', newProductOption);
                updateOptions('product', newProductOption);

                toast.push(
                    <Notification title={`Thêm nhanh sản phẩm`} type="success" duration={2500}>
                        Thành công thêm sản phẩm {newProductOption.name}.
                    </Notification>,
                    { placement: 'top-center' }
                );
            } else {
                throw new Error("Failed to add product");
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            toast.push(
                <Notification title={'Error'} type="danger" duration={2500}>
                    {errorMessage}
                </Notification>,
                { placement: 'top-center' }
            );
        } finally {
            dispatch(toggleAddProductConfirmation(false));
        }
    };

    return (
        <Dialog
            isOpen={openDialog}
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
        >
            <h5 className="mb-4">Thêm nhanh sản phẩm</h5>
            <FormItem label="Tên sản phẩm">
                <Input placeholder={addedProduct?.name || ''} disabled />
            </FormItem>
            <FormItem
                label="Mô tả sản phẩm"
                labelClass="!justify-start"
            >
                <Field name="description">
                    {({ field, form }: FieldProps) => (
                        <RichTextEditor
                            value={field.value}
                            onChange={(val) => form.setFieldValue(field.name, val)}
                        />
                    )}
                </Field>
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

export default ProductAddConfirmation;
