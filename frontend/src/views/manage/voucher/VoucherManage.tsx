import VoucherTable from './components/VoucherTable'
import { AdaptableCard } from '@/components/shared'
import VoucherTableTool from './components/VoucherTableTool'


const VoucherManage = () => {
    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Voucher</h3>
                <VoucherTableTool />
            </div>
            <VoucherTable />
        </AdaptableCard>
    )
}

export default VoucherManage
