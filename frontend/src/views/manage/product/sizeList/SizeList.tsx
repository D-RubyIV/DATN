import AttributeForm, {
} from '@/views/manage/product/AttributeForm'
import { apiGetSalesSizeOverview, apiDeleteSalesSize, apiCreateSalesSize } from '@/services/ProductSalesService';

const SizeList = () => {
    return (
        <>
            <AttributeForm
                apiFunc={apiGetSalesSizeOverview}
                apiDelete={apiDeleteSalesSize}
                apiAdd={apiCreateSalesSize}
                lablel='kích thước'
            />
        </>
    )
}

export default SizeList
