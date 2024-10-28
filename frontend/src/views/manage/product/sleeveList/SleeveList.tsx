import AttributeForm, {
} from '@/views/manage/product/AttributeForm'
import { apiGetSalesSleeveOverview, apiDeleteSalesProducts, apiCreateSalesSleeve } from '@/services/ProductSalesService';

const SleeveList = () => {
    return (
        <>
            <AttributeForm
                apiFunc={apiGetSalesSleeveOverview}
                apiDelete={apiDeleteSalesProducts}
                apiAdd={apiCreateSalesSleeve}
                lablel='thương hiệu'
            />
        </>
    )
}

export default SleeveList
