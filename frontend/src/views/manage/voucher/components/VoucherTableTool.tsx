import { Link, useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { HiDownload, HiPlusCircle } from 'react-icons/hi'

const VoucherTableTool = () => {

    const navigate = useNavigate();

    const handleAddVoucher = () => {
        navigate('/manage/voucher/voucher-new');
    };
    return (
        <div className="flex flex-col lg:flex-row lg:items-center">
            
            {/* // sửa lại export */}
            <Link
                download
                className="block lg:inline-block md:mx-2 md:mb-0 mb-4"
                to="/data/voucher-list.csv"
                target="_blank"
            >
                <Button block size="sm" icon={<HiDownload />}>
                    Export
                </Button>
            </Link>
            <Link
                className="block lg:inline-block md:mb-0 mb-4"
                to="/manage/voucher/voucher-new"
            >
                <Button block variant="solid" size="sm" color='blue' icon={<HiPlusCircle />} onClick={handleAddVoucher}>
                    Add Voucher
                </Button>
            </Link>
        </div>
    )
}

export default VoucherTableTool
