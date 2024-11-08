import AttributeForm, {
} from '@/views/manage/product/AttributeForm'
import { apiGetSalesBrandOverview,apiDeleteSalesProducts,apiCreateSalesBrand } from '@/services/ProductSalesService';

const BrandList = () => {
    return (
        <>
            <AttributeForm 
                apiFunc={apiGetSalesBrandOverview}
                apiDelete={apiDeleteSalesProducts}
                apiAdd={apiCreateSalesBrand}
                lablel='thương hiệu'
            />
        </>
    )
}

export default BrandList
 