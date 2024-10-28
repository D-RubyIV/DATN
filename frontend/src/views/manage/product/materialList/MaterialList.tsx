import AttributeForm, {
} from '@/views/manage/product/AttributeForm'
import { apiGetSalesMaterialOverview, apiDeleteSalesProducts, apiCreateSalesMaterial } from '@/services/ProductSalesService';

const MaterialList = () => {
    return (
        <>
            <AttributeForm
                apiFunc={apiGetSalesMaterialOverview}
                apiDelete={apiDeleteSalesProducts}
                apiAdd={apiGetSalesMaterialOverview}
                lablel='chất liệu'
            />
        </>
    )
}

export default MaterialList
