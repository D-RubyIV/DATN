import AttributeForm, {
} from '@/views/manage/product/AttributeForm'
import { apiGetSalesCollarOverview, apiDeleteSalesProducts, apiCreateSalesCollar } from '@/services/ProductSalesService';

const CollarList = () => {
    return (
        <>
            <AttributeForm
                apiFunc={apiGetSalesCollarOverview}
                apiDelete={apiDeleteSalesProducts}
                apiAdd={apiCreateSalesCollar}
                lablel='thương hiệu'
            />
        </>
    )
}

export default CollarList
