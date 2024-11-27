import AttributeForm, {
} from '@/views/manage/product/AttributeForm'
import { apiGetSalesOriginOverview, apiDeleteSalesOrigin, apiCreateSalesOrigin } from '@/services/ProductSalesService';

const OriginList = () => {
    return (
        <>
            <AttributeForm
                apiFunc={apiGetSalesOriginOverview}
                apiDelete={apiDeleteSalesOrigin}
                apiAdd={apiCreateSalesOrigin}
                lablel='xuất xứ'
            />
        </>
    )
}

export default OriginList
