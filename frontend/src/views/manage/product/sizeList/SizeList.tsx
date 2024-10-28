import AttributeForm, {
} from '@/views/manage/product/AttributeForm'
import { apiGetSalesSizeOverview, apiDeleteSalesProducts, apiCreateSalesSize } from '@/services/ProductSalesService';

const SizeList = () => {
    return (
        <>
            <AttributeForm
                apiFunc={apiGetSalesSizeOverview}
                apiDelete={apiDeleteSalesProducts}
                apiAdd={apiCreateSalesSize}
                lablel='kích thước'
            />
        </>
    )
}

export default SizeList
