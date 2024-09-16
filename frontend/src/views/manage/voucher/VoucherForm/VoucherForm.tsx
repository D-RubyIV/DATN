import { ConfirmDialog } from '@/components/shared'
import { Button, FormContainer } from '@/components/ui'
import { Form, Formik, FormikProps } from 'formik'
import { forwardRef, useCallback, useState } from 'react'
import StickyFooter from '@/components/shared/StickyFooter'

import { HiOutlineTrash } from 'react-icons/hi'
import cloneDeep from 'lodash/cloneDeep'
import * as Yup from 'yup'
import BasicInformationFields from './BasicInformationFields'
import CustomerTable from './CustomersTable'
import CustomersTable from './CustomersTable'

type FormikRef = FormikProps<any>

type InitialData = {
    name?: string
    code?: string
    typeTicket?: string
    quantity?: string
    maxPercent?: number
    minAmount?: number
    statrtDate?: string
    endDate?: string
    status?: string
    customers?: {
        id: number
    }[]
}

export type FormModel = Omit<InitialData, 'tags'>

export type SetSubmitting = (isSubmitting: boolean) => void

export type OnDeleteCallback = React.Dispatch<React.SetStateAction<boolean>>

type OnDelete = (callback: OnDeleteCallback) => void

type VoucherForm = {
    initialData?: InitialData
    type: 'edit' | 'new'
    onDiscard?: () => void
    onDelete?: OnDelete
    onFormSubmit: (formData: FormModel, setSubmitting: SetSubmitting) => void
}

type Customer = {
    id: number
    name: string
    phone: string
    email: string
}

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Voucher Name Required'),
    minAmount: Yup.number().required('Min Amount Required'),
    maxPercent: Yup.number().required('Max Percent Required'),
    typeTicket: Yup.string().required('Type Ticket Required'),
})

const DeleteVoucherButton = ({ onDelete }: { onDelete: OnDelete }) => {
    const [dialogOpen, setDialogOpen] = useState(false)

    const onConfirmDialogOpen = () => {
        setDialogOpen(true)
    }

    const onConfirmDialogClose = () => {
        setDialogOpen(false)
    }

    const handleConfirm = () => {
        onDelete?.(setDialogOpen)
    }

    return (
        <>
            <Button
                className="text-red-600"
                variant="plain"
                size="sm"
                icon={<HiOutlineTrash />}
                type="button"
                onClick={onConfirmDialogOpen}
            >
                Delete
            </Button>
            <ConfirmDialog
                isOpen={dialogOpen}
                type="danger"
                title="Delete voucher"
                confirmButtonColor="red-600"
                onClose={onConfirmDialogClose}
                onRequestClose={onConfirmDialogClose}
                onCancel={onConfirmDialogClose}
                onConfirm={handleConfirm}
            >
                <p>
                    Are you sure you want to delete this voucher? All records
                    related to this voucher will be deleted as well. This action
                    cannot be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

const VoucherForm = forwardRef<FormikRef, VoucherForm>((props, ref) => {
    const [selectedCustomerIds, setSelectedCustomerIds] = useState<number[]>([])

    const handleSelectedCustomersChange = (selectedIds: number[]) => {
        setSelectedCustomerIds(selectedIds)
    }

    const {
        type,
        initialData = {
            name: '',
            code: '',
            typeTicket: '',
            quantity: '',
            maxPercent: 0,
            minAmount: 0,
            startDate: '',
            endDate: '',
            status: '',
            customers: [],
        },
        onFormSubmit,
        onDiscard,
        onDelete,
    } = props

    return (
        <>
            <Formik
                innerRef={ref}
                initialValues={initialData}
                validationSchema={validationSchema}
                onSubmit={(values: FormModel, { setSubmitting }) => {
                    const formData = cloneDeep(values)
                    if (type === 'new') {
                        console.log(formData)
                    }
                    onFormSubmit?.(formData, setSubmitting)
                }}
            >
                {({ values, touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div className="lg:col-span-1">
                                    <BasicInformationFields
                                        touched={touched}
                                        errors={errors}
                                    />
                                </div>
                                <div className="lg:col-span-2">
                                    <CustomersTable
                                        onSelectedCustomersChange={
                                            handleSelectedCustomersChange
                                        }
                                    />
                                </div>
                            </div>
                            <StickyFooter
                                className="-mx-8 px-8 flex items-center justify-between py-4"
                                stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            >
                                <div>
                                    {type === 'edit' && (
                                        <DeleteVoucherButton
                                            onDelete={onDelete as OnDelete}
                                        />
                                    )}
                                </div>
                                <div className="md:flex items-center">
                                    <Button
                                        size="sm"
                                        className="ltr:mr-3 rtl:ml-3"
                                        type="button"
                                        onClick={() => onDiscard?.()}
                                    >
                                        Discard
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="solid"
                                        loading={isSubmitting}
                                        type="submit"
                                    >
                                        Save
                                    </Button>
                                </div>
                            </StickyFooter>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </>
    )
})

VoucherForm.displayName = 'VoucherForm'

export default VoucherForm
