import AttributeForm, {
} from '@/views/manage/product/AttributeForm'
import { apiGetSalesMaterialOverview, apiDeleteSalesMaterial, apiCreateSalesMaterial } from '@/services/ProductSalesService';

const MaterialList = () => {
    return (
        <>
            <AttributeForm
                apiFunc={apiGetSalesMaterialOverview}
                apiDelete={apiDeleteSalesMaterial}
                apiAdd={apiCreateSalesMaterial}
                lablel='chất liệu'
            />
        </>
    )
}

export default MaterialList
