import AttributeForm, {
} from '@/views/manage/product/AttributeForm'
import { apiGetSalesSleeveOverview, apiDeleteSalesSleeve, apiCreateSalesSleeve } from '@/services/ProductSalesService';

const SleeveList = () => {
    return (
        <>
            <AttributeForm
                apiFunc={apiGetSalesSleeveOverview}
                apiDelete={apiDeleteSalesSleeve}
                apiAdd={apiCreateSalesSleeve}
                lablel='kiểu tay áo'
            />
        </>
    )
}

export default SleeveList
