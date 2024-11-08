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
                lablel='kiểu cổ áo'
            />
        </>
    )
}

export default CollarList
