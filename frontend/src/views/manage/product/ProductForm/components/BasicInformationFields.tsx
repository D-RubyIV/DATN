import { useEffect, useState } from 'react';
import AdaptableCard from '@/components/shared/AdaptableCard';
import RichTextEditor from '@/components/shared/RichTextEditor';
import { FormItem } from '@/components/ui/Form';
import { Field, FormikErrors, FormikTouched, FieldProps } from 'formik';
import Select from '@/components/ui/Select';
import { Option } from '../store';
import { useAppDispatch, useAppSelector } from '../store';
import { setProductData, toggleAddProductConfirmation } from '../store';
import ProductAddConfirmation from './ProductAddConfirmation';
import CreatableSelect from 'react-select/creatable';

type FormFieldsName = {
    product: Option | null;
    description: string;
};

type BasicInformationFieldsProps = {
    touched: FormikTouched<FormFieldsName>;
    errors: FormikErrors<FormFieldsName>;
    values: FormFieldsName;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
    data?: {
        products: { label: string; value: Option }[] | undefined;
    };
};

const BasicInformationFields = ({ touched, errors, values, setFieldValue, data }: BasicInformationFieldsProps) => {
    const dispatch = useAppDispatch();
    const [products, setProducts] = useState(data?.products || []);

    useEffect(() => {
        if (data) {
            setProducts(data.products || []);
        }
    }, [data]);

    const handleCreate = (inputValue: string) => {
        const newOption: Option = {
            id: Math.floor(Math.random() * 1000), 
            code: generateRandomCode(),
            name: inputValue,
            deleted: false,
            createdDate: new Date().toISOString(),
            modifiedDate: new Date().toISOString(),
        };
        dispatch(setProductData(newOption));
        dispatch(toggleAddProductConfirmation(true)); 
    };

    const generateRandomCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return Array.from({ length: 5 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    };

    const updateOptions = (field: string, newOption: Option) => {
        if (field === 'product') {
            setProducts((prev) => [...prev, { label: newOption.name, value: newOption }]);
        }
    };

    return (
        <AdaptableCard divider className="mb-4">
            <h5>Thông tin cơ bản</h5>
            <FormItem
                label="Tên sản phẩm"
                invalid={Boolean(errors.product && touched.product)}
                errorMessage={errors.product as string}
            >
                <Field name="product">
                    {({ field, form }: FieldProps) => (
                        <Select
                            isClearable
                            componentAs={CreatableSelect}
                            onCreateOption={handleCreate}
                            field={field}
                            form={form}
                            options={products}
                            value={values.product ? products.find(prod => prod.value.id === values.product?.id) : null}
                            onChange={(el) => {
                                if (el) {
                                    form.setFieldValue(field.name, el.value);
                                } else {
                                    form.setFieldValue(field.name, null);
                                }
                            }}
                            placeholder="Tên sản phẩm..."
                            formatCreateLabel={(inputValue) => `Thêm nhanh "${inputValue}"`}
                        />
                    )}
                </Field>
            </FormItem>
            <FormItem
                label="Mô tả sản phẩm"
                labelClass="!justify-start"
                invalid={Boolean(errors.description && touched.description)}
                errorMessage={errors.description}
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
            <ProductAddConfirmation
                setFieldValue={setFieldValue}
                updateOptions={updateOptions}
                touched={touched}
                errors={errors}
                values={values}
            />
        </AdaptableCard>
    );
};

export default BasicInformationFields;