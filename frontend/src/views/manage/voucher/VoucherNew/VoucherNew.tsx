import { useNavigate } from "react-router-dom"
import VoucherForm, { FormModel, SetSubmitting } from "../VoucherForm"
import axios from "axios"
import toast from '@/components/ui/toast'
import { Notification } from "@/components/ui"
 
const VoucherNew =() => {

    const navigate = useNavigate()

    const addVoucher = async (data: FormModel) => {
        const response = await axios.post<FormModel>('http://localhost:8080/api/v1/voucher/add', data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data
    }

    const handleFormSubmit  = async (
        values: FormModel,
        setSubmitting: SetSubmitting
    ) => {
        setSubmitting(true)
        const success = await addVoucher(values)
        setSubmitting(false)
        if (success) {
            toast.push(
                <Notification title={'Successfuly added'} type="success" duration={2500}>
                    Voucher Successfuly Added
                </Notification>,
                {
                    placement : 'top-center'
                }
            )
            navigate('/manager/voucher/voucher-list')
        }
    }

    const handleDiscard = () => {
        navigate('/manager/voucher/voucher-list')
    }
    return (
        <>
            <VoucherForm type="new" onFormSubmit={handleFormSubmit} onDiscard={handleDiscard}/>
        </>
    )
}

export default VoucherNew