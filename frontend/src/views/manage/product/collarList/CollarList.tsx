import AttributeForm, {
} from '@/views/manage/product/AttributeForm'
import { apiGetSalesCollarOverview, apiDeleteSalesCollar, apiCreateSalesCollar } from '@/services/ProductSalesService';

const CollarList = () => {
    return (
        <>
            <AttributeForm
                apiFunc={apiGetSalesCollarOverview}
                apiDelete={apiDeleteSalesCollar}
                apiAdd={apiCreateSalesCollar}
                lablel='kiểu cổ áo'
            />
        </>
    )
}

export default CollarList
