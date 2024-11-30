import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { HiPlusCircle } from 'react-icons/hi';
import { FaFileDownload } from 'react-icons/fa';
import { useHasRole } from '@/utils/permission'

const VoucherTableTool = () => {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center">
            <Link
                download
                className="block lg:inline-block md:mx-2 md:mb-0 mb-4"
                to="/data/voucher-list.csv"
                target="_blank"
            >
                <Button block size="sm" icon={<FaFileDownload />}>
                    Xuất Excel
                </Button>
            </Link>
            <Link
                className="block lg:inline-block md:mb-0 mb-4"
                to="/admin/manage/voucher/voucher-new"
            >
                <Button block variant="solid" size="sm" color='blue' icon={<HiPlusCircle /> } hidden={useHasRole(['ROLE_ADMIN'])}>
                    Thêm Mới 
                </Button>
            </Link>
        </div>
    );
}

export default VoucherTableTool;
