import AdaptableCard from '@/components/shared/AdaptableCard'
import RichTextEditor from '@/components/shared/RichTextEditor'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Field, FormikErrors, FormikTouched, FieldProps } from 'formik'

type FormFieldsName = {
    name: string
    startDate: string
    endDate: string
    typeTicket: string
    code: string
    quantity: number
    maxPercent: number
    minAmount: number
}

type BasicInformationFields = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
}

const BasicInformationFields = (props: BasicInformationFields) => {
    const { touched, errors } = props

    return (
        <AdaptableCard divider className="mb-4">
            <FormItem
                asterisk
                label="Voucher Name"
                invalid={(errors.name && touched.name) as boolean}
                errorMessage={errors.name}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="name"
                    placeholder="Name"
                    component={Input}
                    className="w-full"
                />
            </FormItem>
            <FormItem
                label="Code"
                invalid={(errors.code && touched.code) as boolean}
                errorMessage={errors.code}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="code"
                    placeholder="Code"
                    component={Input}
                    className="w-full"
                />
            </FormItem>

            <FormItem
                label="Quantity"
                asterisk
                invalid={(errors.quantity && touched.quantity) as boolean}
                errorMessage={errors.quantity}
            >
                <Field
                    type="number"
                    autoComplete="off"
                    name="quantity"
                    placeholder="Quantity"
                    component={Input}
                    className="w-full "
                />
            </FormItem>

            <FormItem
                label="Max Percent"
                asterisk
                invalid={(errors.maxPercent && touched.maxPercent) as boolean}
                errorMessage={errors.maxPercent}
            >
                <div className="relative flex items-center">
                    <Field
                        type="number"
                        autoComplete="off"
                        name="maxPercent"
                        placeholder="Max Percent"
                        component={Input}
                        className="w-full pr-12" 
                    />
                    <span className="absolute right-1 text-gray-500">%</span>
                </div>
            </FormItem>

            <FormItem
                label="Min Amount"
                asterisk

                invalid={(errors.minAmount && touched.minAmount) as boolean}
                errorMessage={errors.minAmount}
            >
                <Field
                    type="number"
                    autoComplete="off"
                    name="minAmount"
                    placeholder="Min Amount"
                    component={Input}
                    className="w-full pr-12"
                />
                    <span className="absolute right-1 text-gray-500 mt-3">VNĐ</span>

            </FormItem>

            <div className="flex gap-4">
                <FormItem
                    label="Start Date"
                    asterisk
                    invalid={(errors.startDate && touched.startDate) as boolean}
                    errorMessage={errors.startDate}
                >
                    <Field
                        type="date"
                        autoComplete="off"
                        name="startDate"
                        placeholder="Start Date"
                        component={Input}
                    />
                </FormItem>

                <FormItem
                    label="End Date"
                    asterisk
                    invalid={(errors.endDate && touched.endDate) as boolean}
                    errorMessage={errors.endDate}
                >
                    <Field
                        type="date"
                        autoComplete="off"
                        name="endDate"
                        placeholder="End Date"
                        component={Input}
                    />
                </FormItem>
            </div>
            <FormItem
                label="Type Ticket"
                asterisk
                invalid={(errors.typeTicket && touched.typeTicket) as boolean}
                errorMessage={errors.typeTicket}
            >
                <Field name="typeTicket">
                    {({ field, form }: FieldProps) => (
                        <div className="flex items-center gap-4">
                            <label className="flex items-center space-x-2">
                                <Field
                                    type="radio"
                                    name="typeTicket"
                                    value="Individual"
                                    className="form-radio"
                                    checked={field.value === 'Individual'}
                                />
                                <span>Individual</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <Field
                                    type="radio"
                                    name="typeTicket"
                                    value="Everyone"
                                    className="form-radio"
                                    checked={field.value === 'Everyone'}
                                />
                                <span>Everyone</span>
                            </label>
                        </div>
                    )}
                </Field>
            </FormItem>
        </AdaptableCard>
    )
}

export default BasicInformationFields
