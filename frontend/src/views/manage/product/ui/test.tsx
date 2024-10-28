import AdaptableCard from '@/components/shared/AdaptableCard';
import { FormItem } from '@/components/ui/Form';
import Select from '@/components/ui/Select';
import { Field, FormikErrors, FormikTouched, FieldProps } from 'formik';
import { components } from 'react-select'
import type { Option } from '../store'
import CreatableSelect from 'react-select/creatable'
import { forwardRef, useState, useEffect } from 'react';
import AttributeAddConfirmation from './AttributeAddConfirmation'
import {
    setAttributeData,
    toggleAddConfirmation,
    setLabelAttribute,
    useAppDispatch,
    useAppSelector,
} from '../store'
const { MultiValueLabel } = components

type FormFieldsName = {
    brand: Option | null;
    origin: Option | null;
    style: Option | null;
    material: Option | null;
    collar: Option | null;
    sleeve: Option | null;
    texture: Option | null;
    thickness: Option | null;
    elasticity: Option | null;
    color: Option[] | null;
    size: Option[] | null;
};

type OrganizationFieldsProps = {
    touched: FormikTouched<FormFieldsName>;
    errors: FormikErrors<FormFieldsName>;
    values: FormFieldsName;
    data?: {
        brands: { label: string; value: Option }[];
        origins: { label: string; value: Option }[];
        styles: { label: string; value: Option }[];
        collars: { label: string; value: Option }[];
        sleeves: { label: string; value: Option }[];
        thicknesses: { label: string; value: Option }[];
        textures: { label: string; value: Option }[];
        elasticities: { label: string; value: Option }[];
        colors: { label: string; value: Option }[];
        sizes: { label: string; value: Option }[];
        materials: { label: string; value: Option }[]
    };

};



const CustomSelectOption = ({ innerProps, label, isSelected }) => {
    return (
        <div
            className={`flex items-center  p-2 ${isSelected
                ? 'bg-gray-100 dark:bg-gray-500'
                : 'hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
            {...innerProps}
        >
            <div className={`w-6 h-6 rounded-full`} style={{ backgroundColor: label }} />
            <span className="ml-2 rtl:mr-2 font-bold">{label}</span>
        </div>
    );
};



const CustomControlMulti = ({ data, innerProps, children }) => {
    const { label } = data;

    return (
        <MultiValueLabel innerProps={innerProps} data={data} selectProps={children}>
            <div className="inline-flex items-center">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: label }} />
                {children}
            </div>
        </MultiValueLabel>
    );
};


const OrganizationFields = (props: OrganizationFieldsProps) => {
    const { values = { brand: null, origin: null, style: null, material: null, collar: null, sleeve: null, texture: null, thickness: null, elasticity: null, color: [], size: [] }, touched, errors } = props;
    const dispatch = useAppDispatch()

    const generateRandomCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';
        for (let i = 0; i < 5; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    };

    const createOption = (label: string): { label: string; value: Option } => {
        const newValue: Option = {
            id: 10, // You might want to make this dynamic
            code: generateRandomCode(),
            name: label,
            deleted: false,
            createdDate: new Date().toISOString(),
            modifiedDate: new Date().toISOString(),
        };

        return {
            label,
            value: newValue,
        };
    };

    const handleCreate = (inputValue: string, fieldLabel?: string) => {
        const newOption = createOption(inputValue).value;
        dispatch(setAttributeData(newOption));
        dispatch(setLabelAttribute(fieldLabel));
        dispatch(toggleAddConfirmation(true));
    };



    return (
        <AdaptableCard divider isLastChild className="mb-4">
            <h5>Thuộc tính</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1">
                    <FormItem
                        label="Thương hiệu"
                        invalid={Boolean(errors.brand && touched.brand)}
                        errorMessage={errors.brand as string}
                    >
                        <Field name="brand">
                            {({ field, form }: FieldProps) => (
                                <Select
                                    isClearable
                                    componentAs={CreatableSelect}
                                    onCreateOption={(inputValue) => handleCreate(inputValue, "Thương hiệu")}
                                    field={field}
                                    form={form}
                                    options={props.data?.brands}
                                    value={values.brand ? props.data?.brands.find(brand => brand.value.id === values?.brand?.id) : null}
                                    onChange={(el) => {
                                        if (el) {
                                            form.setFieldValue(field.name, el.value); // Set value as the object
                                        } else {
                                            form.setFieldValue(field.name, null); // Reset to null if no selection
                                        }
                                    }}
                                    placeholder='Chọn thương hiệu...'

                                />
                            )}
                        </Field>
                    </FormItem>
                </div>

                {/* <div className="col-span-1">
                    <FormItem
                        label="Xuất xứ"
                        invalid={Boolean(errors.origin && touched.origin)}
                        errorMessage={errors.origin as string}
                    >
                        <Field name="origin">
                            {({ field, form }: FieldProps) => (
                                <Select
                                    // componentAs={CreatableSelect}
                                    field={field}
                                    form={form}
                                    options={originOptions}
                                    value={values.origin ? originOptions.find(origin => origin.value.id === values?.origin?.id) : null}
                                    onChange={(el) => {
                                        if (el) {
                                            form.setFieldValue(field.name, el.value); // Đặt giá trị là đối tượng
                                        } else {
                                            form.setFieldValue(field.name, null); // Reset về null nếu không có lựa chọn
                                        }
                                        console.log(form.values)
                                    }}
                                    placeholder='Chọn xuất xứ...'

                                />
                            )}
                        </Field>
                    </FormItem>
                </div>
                <div className="col-span-1">
                    <FormItem
                        label="Kiểu dáng"
                        invalid={Boolean(errors.style && touched.style)}
                        errorMessage={errors.style as string}
                    >
                        <Field name="style">
                            {({ field, form }: FieldProps) => (
                                <Select
                                    field={field}
                                    form={form}
                                    options={styleOptions}
                                    value={values.style ? styleOptions.find(style => style.value.id === values?.style?.id) : null}
                                    onChange={(el) => {
                                        if (el) {
                                            form.setFieldValue(field.name, el.value); // Đặt giá trị là đối tượng
                                        } else {
                                            form.setFieldValue(field.name, null); // Reset về null nếu không có lựa chọn
                                        }
                                        // console.log(form.values)
                                    }}
                                    placeholder='Chọn kiểu dáng...'

                                />

                                
                            )}
                        </Field>
                    </FormItem>
                </div> */}
            </div>
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1">
                    <FormItem
                        label="Chất liệu"
                        invalid={Boolean(errors.material && touched.material)}
                        errorMessage={errors.material as string}
                    >
                        <Field name="material">
                            {({ field, form }: FieldProps) => (
                                <Select
                                    field={field}
                                    form={form}
                                    options={materialOptions}
                                    value={values.material ? materialOptions.find(material => material.value.id === values?.material?.id) : null}
                                    onChange={(el) => {
                                        if (el) {
                                            form.setFieldValue(field.name, el.value); // Đặt giá trị là đối tượng
                                        } else {
                                            form.setFieldValue(field.name, null); // Reset về null nếu không có lựa chọn
                                        }
                                        // console.log(form.values)
                                    }}
                                    placeholder='Chọn chất liệu...'

                                />
                            )}
                        </Field>
                    </FormItem>
                </div>
                <div className="col-span-1">
                    <FormItem
                        label="Kiểu cổ áo"
                        invalid={Boolean(errors.collar && touched.collar)}
                        errorMessage={errors.collar as string}
                    >
                        <Field name="collar">
                            {({ field, form }: FieldProps) => (
                                <Select
                                    field={field}
                                    form={form}
                                    options={collarOptions}
                                    value={values.collar ? collarOptions.find(collar => collar.value.id === values?.collar?.id) : null}
                                    onChange={(el) => {
                                        if (el) {
                                            form.setFieldValue(field.name, el.value); // Đặt giá trị là đối tượng
                                        } else {
                                            form.setFieldValue(field.name, null); // Reset về null nếu không có lựa chọn
                                        }
                                        // console.log(form.values)
                                    }}
                                    placeholder='Chọn kiểu cổ áo...'

                                />
                            )}
                        </Field>
                    </FormItem>
                </div>
                <div className="col-span-1">
                    <FormItem
                        label="Kiểu tay áo"
                        invalid={Boolean(errors.sleeve && touched.sleeve)}
                        errorMessage={errors.sleeve as string}
                    >
                        <Field name="sleeve">
                            {({ field, form }: FieldProps) => (
                                <Select
                                    field={field}
                                    form={form}
                                    options={sleeveOptions}
                                    value={values.sleeve ? sleeveOptions.find(sleeve => sleeve.value.id === values?.sleeve?.id) : null}
                                    onChange={(el) => {
                                        if (el) {
                                            form.setFieldValue(field.name, el.value); // Đặt giá trị là đối tượng
                                        } else {
                                            form.setFieldValue(field.name, null); // Reset về null nếu không có lựa chọn
                                        }
                                        // console.log(form.values)
                                    }}
                                    placeholder='Chọn kiểu tay áo...'

                                />
                            )}
                        </Field>
                    </FormItem>
                </div>
            </div> */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1">
                    <FormItem
                        label="Kết cấu"
                        invalid={Boolean(errors.texture && touched.texture)}
                        errorMessage={errors.texture as string}
                    >
                        <Field name="texture">
                            {({ field, form }: FieldProps) => (
                                <Select
                                    field={field}
                                    form={form}
                                    options={textureOptions}
                                    value={values.texture ? textureOptions.find(texture => texture.value.id === values?.texture?.id) : null}
                                    onChange={(el) => {
                                        if (el) {
                                            form.setFieldValue(field.name, el.value); // Đặt giá trị là đối tượng
                                        } else {
                                            form.setFieldValue(field.name, null); // Reset về null nếu không có lựa chọn
                                        }
                                        // console.log(form.values)
                                    }}
                                    placeholder='Chọn kết cấu...'

                                />
                            )}
                        </Field>
                    </FormItem>
                </div>
                <div className="col-span-1">
                    <FormItem
                        label="Độ dày"
                        invalid={Boolean(errors.thickness && touched.thickness)}
                        errorMessage={errors.thickness as string}
                    >
                        <Field name="thickness">
                            {({ field, form }: FieldProps) => (
                                <Select
                                    field={field}
                                    form={form}
                                    options={thicknessOptions}
                                    value={values.thickness ? thicknessOptions.find(thickness => thickness.value.id === values?.thickness?.id) : null}
                                    onChange={(el) => {
                                        if (el) {
                                            form.setFieldValue(field.name, el.value); // Đặt giá trị là đối tượng
                                        } else {
                                            form.setFieldValue(field.name, null); // Reset về null nếu không có lựa chọn
                                        }
                                        // console.log(form.values)
                                    }}
                                    placeholder='Chọn độ dày...'
                                />
                            )}
                        </Field>
                    </FormItem>
                </div>
                <div className="col-span-1">
                    <FormItem
                        label="Dộ đàn hồi"
                        invalid={Boolean(errors.elasticity && touched.elasticity)}
                        errorMessage={errors.elasticity as string}
                    >
                        <Field name="elasticity">
                            {({ field, form }: FieldProps) => (
                                <Select
                                    field={field}
                                    form={form}
                                    options={elasticityOptions}
                                    value={values.elasticity ? elasticityOptions.find(elasticity => elasticity.value.id === values?.elasticity?.id) : null}
                                    onChange={(el) => {
                                        if (el) {
                                            form.setFieldValue(field.name, el.value); // Đặt giá trị là đối tượng
                                        } else {
                                            form.setFieldValue(field.name, null); // Reset về null nếu không có lựa chọn
                                        }
                                        // console.log(form.values)
                                    }}
                                    placeholder='Chọn độ đàn hồi...'
                                />
                            )}
                        </Field>
                    </FormItem>
                </div>
            </div> */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1">
                    <FormItem
                        label="Màu sắc"
                        invalid={Boolean(errors.color && touched.color)}
                        errorMessage={touched.color ? errors.color : undefined}
                    >
                        <Field name="color">
                            {({ field, form }: FieldProps) => {
                                const formattedColors = values.color ? values.color.map(option => ({
                                    label: option.name,
                                    value: option,
                                })) : [];
                                return (
                                    <Select
                                        isMulti
                                        field={field}
                                        form={form}
                                        options={colorOptions}
                                        value={formattedColors}
                                        onChange={(selectedOptions) => {
                                            const newValue = selectedOptions ? selectedOptions.map(option => option.value) : [];
                                            form.setFieldValue(field.name, newValue);
                                        }}
                                        components={{
                                            Option: CustomSelectOption,
                                            MultiValueLabel: CustomControlMulti,
                                        }}
                                        placeholder="Chọn màu sắc..."
                                        closeMenuOnSelect={false}
                                        // componentAs={CreatableSelect}

                                    />
                                );
                            }}
                        </Field>
                    </FormItem>
                </div>
                <div className="col-span-1">
                    <FormItem
                        label="kích thước"
                        invalid={Boolean(errors.size && touched.size)}
                        errorMessage={touched.size ? errors.size : undefined}
                    >
                        <Field name="size">
                            {({ field, form }: FieldProps) => {
                                const formattedSizes = values.size ? values.size.map(option => ({
                                    label: option.name,
                                    value: option,
                                })) : [];

                                return (
                                    <Select
                                        isMulti
                                        field={field}
                                        form={form}
                                        options={sizeOptions}
                                        value={formattedSizes}
                                        onChange={(selectedOptions) => {
                                            const newValue = selectedOptions ? selectedOptions.map(option => option.value) : [];
                                            form.setFieldValue(field.name, newValue);
                                        }}
                                        placeholder='Chọn kích thước...'
                                        closeMenuOnSelect={false}
                                    />
                                );
                            }}
                        </Field>
                    </FormItem>
                </div>
                
            </div> */}
            {/* <AttributeAddConfirmation/> */}
        </AdaptableCard>
    );
};

export default OrganizationFields;
