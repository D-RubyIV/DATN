import AttributeForm, {
} from '@/views/manage/product/AttributeForm'
import { apiGetSalesBrandOverview, apiDeleteSalesBrand,apiCreateSalesBrand } from '@/services/ProductSalesService';

const BrandList = () => {
    return (
        <>
            <AttributeForm 
                apiFunc={apiGetSalesBrandOverview}
                apiDelete={apiDeleteSalesBrand}
                apiAdd={apiCreateSalesBrand}
                lablel='thương hiệu'
            />
        </>
    )
}

export default BrandList
 