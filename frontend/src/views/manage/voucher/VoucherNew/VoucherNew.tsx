import { Link, useNavigate } from "react-router-dom"
import VoucherForm, { FormModel, SetSubmitting } from "../VoucherForm"
import axios from "axios"
import toast from '@/components/ui/toast'
import { Notification } from "@/components/ui"
import { AdaptableCard } from "@/components/shared"
 
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
                  Thêm mới thành công!
                </Notification>,
                {
                    placement : 'top-center'
                }
            )
            navigate('/admin/manager/voucher/voucher-list')
        }
    }

    const handleDiscard = () => {
        navigate('/admin/manager/voucher/voucher-list')
    }
    return (

        <AdaptableCard className="h-full" bodyClass="h-full">
        {/* Breadcrumb */}
        <div className="lg:flex items-center justify-between mb-4">
            <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li>
                        <div className="flex items-center">
                            <Link to="/" className="text-gray-700 hover:text-blue-600">
                                Trang Chủ
                            </Link>
                        </div>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <span className="mx-2">/</span>
                            <Link to="/manage" className="text-gray-700 hover:text-blue-600">
                                Quản Lý
                            </Link>
                        </div>
                    </li>
                    <li aria-current="page">
                        <div className="flex items-center">
                            <span className="mx-2">/</span>
                            <Link to="/manage/voucher" className="text-gray-700 hover:text-blue-600">
                                Quản Lý
                            </Link>
                        </div>
                    </li>
                    <li aria-current="page">
                        <div className="flex items-center">
                            <span className="mx-2">/</span>
                            <span className="text-gray-500">Thêm Phiếu Giảm Giá</span>
                        </div>
                    </li>
                </ol>
            </nav>
        </div>
        <>
            <VoucherForm type="new" onFormSubmit={handleFormSubmit} onDiscard={handleDiscard}/>
        </>
    </AdaptableCard>
       
    )
}

export default VoucherNew