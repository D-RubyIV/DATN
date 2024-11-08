import AttributeForm, {
} from '@/views/manage/product/AttributeForm'
import { apiGetSalesOriginOverview, apiDeleteSalesProducts, apiCreateSalesOrigin } from '@/services/ProductSalesService';

const OriginList = () => {
    return (
        <>
            <AttributeForm
                apiFunc={apiGetSalesOriginOverview}
                apiDelete={apiDeleteSalesProducts}
                apiAdd={apiCreateSalesOrigin}
                lablel='xuất xứ'
            />
        </>
    )
}

export default OriginList
